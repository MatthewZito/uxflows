import { ApolloClient, InMemoryCache } from '@apollo/client'
import { useMemo } from 'react'

import { link } from './links'

const baseOptions = { errorPolicy: 'all' as const }

export function ApolloProvider() {
  return useMemo(
    () =>
      new ApolloClient({
        cache: new InMemoryCache(),
        defaultOptions: {
          mutate: baseOptions,
          query: baseOptions,
          watchQuery: baseOptions,
        },
        link,
      }),
    [],
  )
}
