import {
  ActionPanel,
  Form,
  FormTagPicker,
  FormTagPickerItem,
  FormTextField,
  popToRoot,
  preferences,
  showToast,
  SubmitFormAction,
  ToastStyle
} from '@raycast/api'
import {useEffect, useState} from 'react'
import {notion, peopleDatabaseId} from './lib/notion'

export default () => {
  const [additionalContext, setAdditionalContext] = useState<string[]>([])

  useEffect(() => {
    const fetchContexts = async () => {
      const resp = await notion.databases.retrieve({
        database_id: peopleDatabaseId
      })
      const contextProp = resp.properties.Context

      if (contextProp?.type === 'multi_select') {
        setAdditionalContext(
          contextProp.multi_select.options
            .filter(o => o.name !== 'GitHub')
            .map(o => o.name)
        )
      }
    }

    fetchContexts()
  }, [])

  return (
    <Form actions={<Actions />}>
      <FormTextField id="name" title="Name" />
      <FormTextField id="handle" title="Handle" />

      <FormTagPicker id="context" title="Context">
        {additionalContext.map(ctx => (
          <FormTagPickerItem key={ctx} title={ctx} value={ctx} />
        ))}
      </FormTagPicker>
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
