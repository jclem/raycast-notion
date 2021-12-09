import {QueryDatabaseResponse} from '@notionhq/client/build/src/api-endpoints'
import {
  ActionPanel,
  Icon,
  List,
  ListItem,
  PushAction,
  showToast,
  ToastStyle
} from '@raycast/api'
import {useState} from 'react'
import {useQuery} from 'react-query'
import {
  getObjectAccessoryIcon,
  getObjectIcon,
  getObjectTitle,
  notion
} from '../lib/notion'
import {SearchResult} from '../lib/useSearch'
import withQueryClient from './withQueryClient'

interface Props {
  result: SearchResult
}

export default ({result}: Props) => {
  if (result.object === 'database') {
    return <DatabaseActions database={result} />
  } else {
    return null
  }
}

type Database = SearchResult & {object: 'database'}

const DatabaseActions = ({database}: {database: Database}) => {
  return (
    <ActionPanel>
      <PushAction
        title="Query database"
        icon={Icon.MagnifyingGlass}
        target={<QueryDatabase database={database} />}
      />
    </ActionPanel>
  )
}

const QueryDatabase = withQueryClient(({database}: {database: Database}) => {
  const [search, setSearch] = useState('')
  const {data, isFetching} = useQuery<QueryDatabaseResponse['results'] | null>(
    ['database', 'query', search],
    async () => {
      try {
        const {results} = await notion.databases.query({
          database_id: database.id
        })
        return results
      } catch (err) {
        console.error(err)
        await showToast(ToastStyle.Failure, 'Failed to query database')
        return null
      }
    }
  )

  return (
    <List onSearchTextChange={setSearch} isLoading={isFetching} throttle>
      {data?.map(result => (
        <ListItem
          key={result.id}
          title={getObjectTitle(result)}
          icon={getObjectIcon(result)}
          accessoryIcon={getObjectAccessoryIcon(result)}
        />
      ))}
    </List>
  )
})
