import {
  ActionPanel,
  Form,
  FormTextField,
  popToRoot,
  preferences,
  showToast,
  SubmitFormAction,
  ToastStyle
} from '@raycast/api'
import ContextPicker from './components/people/ContextPicker'
import {notion} from './lib/notion'

export default () => {
  return (
    <Form actions={<Actions />}>
      <FormTextField id="name" title="Name" />
      <FormTextField id="handle" title="Handle" />
      <ContextPicker omit={['GitHub']} />
    </Form>
  )
}

const Actions = () => {
  const dbID = String(preferences.peopleDatabaseID.value)

  const onSubmit = async ({
    name,
    handle,
    context
  }: {
    name: string
    handle: string
    context: string[]
  }) => {
    const avatarURL = `https://github.com/${handle}.png`

    try {
      await notion.pages.create({
        parent: {database_id: dbID},
        properties: {
          title: {title: [{type: 'text', text: {content: name}}]},
          'GitHub Handle': {
            rich_text: [{type: 'text', text: {content: handle}}]
          },
          Context: {
            multi_select: [{name: 'GitHub'}, ...context.map(name => ({name}))]
          },
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
