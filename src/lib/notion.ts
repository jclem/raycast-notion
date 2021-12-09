import {Client} from '@notionhq/client'
import {CreatePageParameters} from '@notionhq/client/build/src/api-endpoints'
import {preferences} from '@raycast/api'

export const notion = new Client({auth: String(preferences.notionToken.value)})

export const peopleDatabaseId = String(preferences.peopleDatabaseID.value)

export const createPerson = async (
  name: string,
  handle: string,
  context: string[],
  photo: string
): Promise<void> => {
  const properties: CreatePageParameters['properties'] = {
    title: {title: [{type: 'text', text: {content: name}}]},
    'GitHub Handle': {
      rich_text: [{type: 'text', text: {content: handle}}]
    },
    Context: {
      multi_select: context.map(name => ({name}))
    }
  }

  if (photo !== '') {
    properties.Photo = {files: [{name: photo, external: {url: photo}}]}
  }

  await notion.pages.create({
    parent: {database_id: peopleDatabaseId},
    properties
  })
}
