import {
  ActionPanel,
  Form,
  FormTextField,
  popToRoot,
  showToast,
  SubmitFormAction,
  ToastStyle
} from '@raycast/api'
import ContextPicker from './components/people/ContextPicker'
import {createPerson} from './lib/notion'

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
      await createPerson(name, handle, ['GitHub', ...context], avatarURL)
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
