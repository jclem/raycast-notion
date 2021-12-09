import {GetDatabaseResponse} from '@notionhq/client/build/src/api-endpoints'
import {showToast, ToastStyle} from '@raycast/api'
import {useQuery} from 'react-query'
import {notion} from './notion'

export default (dbID: string) => {
  return useQuery<GetDatabaseResponse | null>(['database', dbID], async () => {
    try {
      const resp = await notion.databases.retrieve({
        database_id: dbID
      })

      return resp
    } catch (err) {
      console.error(err)
      await showToast(ToastStyle.Failure, `Error fetching database ${dbID}`)
      return null
    }
  })
}
