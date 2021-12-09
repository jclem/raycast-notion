import {CreatePageParameters} from '@notionhq/client/build/src/api-endpoints'
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
import {notion, peopleDatabaseId} from './lib/notion'

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
      const properties: CreatePageParameters['properties'] = {
        title: {title: [{type: 'text', text: {content: name}}]},
        'GitHub Handle': {
          rich_text: [{type: 'text', text: {content: handle}}]
        },
        Context: {multi_select: context.map(ctx => ({name: ctx}))}
      }

      if (photo) {
        properties.photo = {files: [{name: photo, external: {url: photo}}]}
      }

      await notion.pages.create({
        parent: {database_id: peopleDatabaseId},
        properties
      })

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
