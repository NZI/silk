
import { ChakraProvider } from '@chakra-ui/react'
import { Router } from "@reach/router"
import React, { lazy } from 'react'
import * as ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import HomePage from './pages/home'
import NotFoundPage from './pages/not-found'
import RedirectPage from './pages/redirect'
import { theme } from './theme'

const UsersPage = lazy(() => import('./pages/admin/users'))
const RolesPage = lazy(() => import('./pages/admin/roles'))
const PermissionsPage = lazy(() => import('./pages/admin/permissions'))
const LoginPage = lazy(() => import('./pages/login'))

const rootElement = document.getElementById('root');
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
})

ReactDOM.createRoot(rootElement as HTMLElement).render(
  <ChakraProvider theme={theme}>
    <QueryClientProvider client={queryClient}>
      <Router>
        <HomePage path="/" />
        <LoginPage path="/login" />
        <RedirectPage path="/admin" to="/admin/users" />
        <UsersPage path="/admin/users" />
        <RolesPage path="/admin/users/roles" />
        <PermissionsPage path="/admin/users/permissions" />
        <NotFoundPage default />
      </Router>
    </QueryClientProvider>
  </ChakraProvider>,
)