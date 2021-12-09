import {List, ListItem} from '@raycast/api'
import {useState} from 'react'
import ResultActions from './components/ResultActions'
import withQueryClient from './components/withQueryClient'
import {
  getObjectAccessoryIcon,
  getObjectIcon,
  getObjectTitle
} from './lib/notion'
import useSearch from './lib/useSearch'

export default withQueryClient(() => {
  const [search, setSearch] = useState('')
  const {data, isFetching} = useSearch(search)

  return (
    <List onSearchTextChange={setSearch} isLoading={isFetching} throttle>
      {data?.map(result => (
        <ListItem
          key={result.id}
          title={getObjectTitle(result)}
          icon={getObjectIcon(result)}
          accessoryIcon={getObjectAccessoryIcon(result)}
          actions={<ResultActions result={result} />}
        />
      ))}
    </List>
  )
})
