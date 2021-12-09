import {Client} from '@notionhq/client'
import {CreatePageParameters} from '@notionhq/client/build/src/api-endpoints'
import {ImageLike, preferences} from '@raycast/api'
import {SearchResult} from './useSearch'

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

export const getObjectIcon = (object: SearchResult): string | undefined => {
  switch (object.icon?.type) {
    case 'emoji':
      return object.icon.emoji
    case 'external':
      return object.icon.external.url
    case 'file':
      return object.icon.file.url
  }
}

export const getObjectAccessoryIcon = (object: {
  object: 'page' | 'database'
}): ImageLike | undefined => {
  if (object.object === 'page') {
    return {source: {dark: 'file@dark.png', light: 'file.png'}}
  } else {
    return {source: {dark: 'database@dark.png', light: 'database.png'}}
  }
}

export const getObjectTitle = (object: SearchResult): string => {
  if (object.object === 'database') {
    return object.title.map(t => t.plain_text).join(' ')
  }

  for (const key in object.properties) {
    const prop = object.properties[key]

    if (prop.type === 'title') {
      return prop.title.map(t => t.plain_text).join(' ')
    }
  }

  return 'Untitled page'
}
