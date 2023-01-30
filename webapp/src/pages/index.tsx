import { Box } from "@chakra-ui/react";
import { navigate, RouteComponentProps } from "@reach/router";
import { useEffect } from "react";
import { useLogout } from "../hooks/useLogout";
import { useMe } from "../hooks/useMe";

const IndexPage: React.FC<RouteComponentProps> = () => {
  const user = useMe()
  const { logout } = useLogout()

  useEffect(() => {
    if ((!user.isRefetching && !user.isLoading) && !user.data) {
      navigate('/login')
    }
  }, [user])

  const roles = user.data?.roles ?? []
  const permissions = user.data?.permissions ?? []


  return <Box>

  </Box>
}

export default IndexPage