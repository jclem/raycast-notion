import {FormTagPicker, FormTagPickerItem, ImageSource} from '@raycast/api'
import useProperty from '../lib/useProperty'

export interface MultiSelectPickerProps {
  databaseID: string
  name: string
  icon?: ImageSource
  omit?: string[]
}

export default ({databaseID, name, omit, icon}: MultiSelectPickerProps) => {
  const opts =
    useProperty(databaseID, name, 'multi_select')?.multi_select.options.filter(
      o => !omit?.includes(o.name)
    ) ?? []

  return (
    <FormTagPicker id="context" title="Context">
      {opts.map(opt => (
        <FormTagPickerItem
          key={opt.name}
          title={opt.name}
          value={opt.name}
          icon={
            icon && {
              source: icon,
              tintColor: opt.color
            }
          }
        />
      ))}
    </FormTagPicker>
  )
}
