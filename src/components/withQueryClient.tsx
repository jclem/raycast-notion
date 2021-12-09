import {ComponentType} from 'react'
import {QueryClient, QueryClientProvider} from 'react-query'

const queryClient = new QueryClient()

export default function withQueryClient<P = unknown>(
  Component: ComponentType<P>
): ComponentType<P> {
  return (props: P) => (
    <QueryClientProvider client={queryClient}>
      <Component {...props} />
    </QueryClientProvider>
  )
}
