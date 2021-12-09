import {
  ActionPanel,
  Detail,
  Form,
  FormTextField,
  popToRoot,
  preferences,
  showToast,
  SubmitFormAction,
  ToastStyle
} from '@raycast/api'
import {notion} from './lib/notion'

export default () => {
  return (
    <Form actions={<Actions />}>
      <FormTextField id="name" title="Name" />
      <FormTextField id="handle" title="Handle" />
    </Form>
  )
}

const Actions = () => {
  const dbID = String(preferences.peopleDatabaseID.value)

  const onSubmit = async ({name, handle}: {name: string; handle: string}) => {
    const avatarURL = `https://github.com/${handle}.png`

    try {
      await notion.pages.create({
        parent: {database_id: dbID},
        properties: {
          title: {title: [{type: 'text', text: {content: name}}]},
          'GitHub Handle': {
            rich_text: [{type: 'text', text: {content: handle}}]
          },
          Context: {multi_select: [{name: 'GitHub'}]},
          Photo: {files: [{name: avatarURL, external: {url: avatarURL}}]}
        }
      })

      await showToast(ToastStyle.Success, `Added hubber ${handle}`)
      await popToRoot()
    } catch (err) {
      console.error('error creating person', err)
      await showToast(ToastStyle.Failure, 'Error creating person')
    }
  }

  return (
    <ActionPanel>
      <SubmitFormAction onSubmit={onSubmit} />
    </ActionPanel>
  )
}
