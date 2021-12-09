import {GetDatabaseResponse} from '@notionhq/client/build/src/api-endpoints'
import {showToast, ToastStyle} from '@raycast/api'
import {useEffect, useState} from 'react'
import {notion} from './notion'

export default (dbID: string) => {
  const [db, setDB] = useState<GetDatabaseResponse | null>(null)

  useEffect(() => {
    const getDB = async () => {
      try {
        const resp = await notion.databases.retrieve({
          database_id: dbID
        })

        setDB(resp)
      } catch (err) {
        console.error(err)
        await showToast(ToastStyle.Failure, `Error fetching database ${dbID}`)
      }
    }

    getDB()
  }, [dbID])

  return db
}
