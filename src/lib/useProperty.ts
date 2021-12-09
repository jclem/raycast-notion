import {GetDatabaseResponse} from '@notionhq/client/build/src/api-endpoints'
import useDatabase from './useDatabase'

type PropertyType = GetDatabaseResponse['properties'][string]['type']
type SpecificPropertyType<T extends PropertyType> =
  GetDatabaseResponse['properties'][string] & {type: T}

export default function useProperty<T extends PropertyType>(
  dbID: string,
  name: string,
  type: T
): SpecificPropertyType<T> | null {
  const {data: db} = useDatabase(dbID)
  const prop = db?.properties[name]

  if (prop?.type === type) {
    return prop as SpecificPropertyType<T>
  }

  return null
}
