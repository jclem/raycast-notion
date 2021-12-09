import {FormTagPicker, FormTagPickerItem, Icon} from '@raycast/api'
import {peopleDatabaseId} from '../../lib/notion'
import useProperty from '../../lib/useProperty'

interface Props {
  omit?: string[]
}

export default ({omit}: Props) => {
  const contexts =
    useProperty(
      peopleDatabaseId,
      'Context',
      'multi_select'
    )?.multi_select.options.filter(o => !omit?.includes(o.name)) ?? []

  return (
    <FormTagPicker id="context" title="Context">
      {contexts.map(ctx => (
        <FormTagPickerItem
          key={ctx.name}
          title={ctx.name}
          value={ctx.name}
          icon={{
            source: Icon.Pin,
            tintColor: ctx.color
          }}
        />
      ))}
    </FormTagPicker>
  )
}
