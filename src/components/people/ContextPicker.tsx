import {Icon} from '@raycast/api'
import {peopleDatabaseId} from '../../lib/notion'
import MultiSelectPicker, {MultiSelectPickerProps} from '../MultiSelectPicker'

type Props = Pick<MultiSelectPickerProps, 'omit'>

export default ({omit}: Props) => {
  return (
    <MultiSelectPicker
      databaseID={peopleDatabaseId}
      name="Context"
      icon={Icon.Pin}
      omit={omit}
    />
  )
}
