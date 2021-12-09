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
      <ContextPicker />
      <FormTextField id="photo" title="Photo URL" />
    </Form>
  )
}

const Actions = () => {
  const onSubmit = async ({
    name,
    handle,
    context,
    photo
  }: {
    name: string
    handle: string
    context: string[]
    photo: string
  }) => {
    try {
      await createPerson(name, handle, context, photo)
      await showToast(ToastStyle.Success, `Added person ${name}`)
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
