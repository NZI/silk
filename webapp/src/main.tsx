
import { ChakraProvider } from '@chakra-ui/react'
import { Router } from "@reach/router"
import * as ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import IndexPage from './pages'
import LoginPage from './pages/login'
import { theme } from './theme'

const rootElement = document.getElementById('root');
const queryClient = new QueryClient()

ReactDOM.createRoot(rootElement as HTMLElement).render(
  <ChakraProvider theme={theme}>
    <QueryClientProvider client={queryClient}>
      <Router>
        <IndexPage path="/" />
        <LoginPage path="/login" />
      </Router>
    </QueryClientProvider>
  </ChakraProvider>,
)