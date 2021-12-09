import {CreatePageParameters} from '@notionhq/client/build/src/api-endpoints'
import {
  ActionPanel,
  Form,
  FormTagPicker,
  FormTagPickerItem,
  FormTextField,
  popToRoot,
  showToast,
  SubmitFormAction,
  ToastStyle
} from '@raycast/api'
import {useEffect, useState} from 'react'
import {notion, peopleDatabaseId} from './lib/notion'

export default () => {
  const [contexts, setContexts] = useState<string[]>([])

  useEffect(() => {
    const fetchContexts = async () => {
      const resp = await notion.databases.retrieve({
        database_id: peopleDatabaseId
      })
      const contextProp = resp.properties.Context

      if (contextProp?.type === 'multi_select') {
        setContexts(contextProp.multi_select.options.map(o => o.name))
      }
    }

    fetchContexts()
  }, [])

  return (
    <Form actions={<Actions />}>
      <FormTextField id="name" title="Name" />
      <FormTextField id="handle" title="Handle" />

      <FormTagPicker id="context" title="Context">
        {contexts.map(ctx => (
          <FormTagPickerItem key={ctx} title={ctx} value={ctx} />
        ))}
      </FormTagPicker>

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
