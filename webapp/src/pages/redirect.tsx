
import { navigate, RouteComponentProps } from "@reach/router"
import { useEffect } from "react"
import { Layout } from "../components/Layout"

interface Props {
  to: string
}

const RedirectPage: React.FC<RouteComponentProps & Props> = ({ to }) => {
  useEffect(() => {
    navigate(to)
  }, [])

  return <Layout />
}

export default RedirectPage