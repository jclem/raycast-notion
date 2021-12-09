import {Client} from '@notionhq/client'
import {preferences} from '@raycast/api'

export const notion = new Client({auth: String(preferences.notionToken.value)})
export const peopleDatabaseId = String(preferences.peopleDatabaseID.value)
