import {
  SearchParameters,
  SearchResponse
} from '@notionhq/client/build/src/api-endpoints'
import {showToast, ToastStyle} from '@raycast/api'
import {useQuery} from 'react-query'
import {notion} from './notion'

export type SearchResult = SearchResponse['results'][number]

export default (search: string) => {
  return useQuery<SearchResult[]>(
    ['search', search],
    async () => {
      const params = parseSearch(search)

      try {
        const {results} = await notion.search(params)
        return results
      } catch (err) {
        console.error(err)
        await showToast(ToastStyle.Failure, 'Error searching Notion')
        return []
      }
    },
    {
      enabled: search.trim() !== ''
    }
  )
}

/**
 * Parse a search string into a query object.
 *
 * A sort can be specified like "sort:edited" or "sort:edited-desc". Any other
 * key:value pairs will be added to the query string as-is.
 *
 * A filter can be specified like "is:page" or "is:database".
 *
 * Example searches:
 *   > foo sort:edited bar
 *   { query: 'foo bar', sort: {timestamp: 'last_edited_time', direction: 'ascending'}}
 *   > foo sort:edited-desc bar is:database
 *   { query: 'foo bar', sort: {timestamp: 'last_edited_time', direction: 'descending'}, filter: {property: 'object', value: 'database'}}
 *   > foo bar baz hello:there
 *   { query: 'foo bar baz hello:there'}
 *
 * @param query The query to be parsed
 * @returns A search parameters object
 */
const parseSearch = (search: string): SearchParameters => {
  const searchParts = search.split(' ')

  let sort: SearchParameters['sort']
  let filter: SearchParameters['filter']
  let query = ''

  for (const part of searchParts) {
    if (/^sort:edited(?:-desc)?$/.test(part)) {
      sort = {
        timestamp: 'last_edited_time',
        direction: part.endsWith('-desc') ? 'descending' : 'ascending'
      }

      continue
    }

    if (/^is:(?:page|database)$/.test(part)) {
      filter = {
        property: 'object',
        value: part.split(':')[1] as 'page' | 'database'
      }

      continue
    }

    query += ` ${part}`
  }

  return {query: query.trim(), sort, filter}
}
