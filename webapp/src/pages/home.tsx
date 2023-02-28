import { Text } from "@chakra-ui/react";
import { RouteComponentProps } from "@reach/router";
import React from "react";
import { Layout } from "../components/Layout";
import usePermission from "../hooks/usePermission";
import useRole from "../hooks/useRole";

const AdminView: React.FC = () => {
  return <Text>Admin</Text>
}

const UserView: React.FC = () => {
  return <Text>User</Text>
}

const IndexPage: React.FC<RouteComponentProps> = () => {
  const isAdmin = useRole('ADMIN')
  const isVerified = usePermission('ADMIN')
  console.log(isAdmin)

  return <Layout>
    {isAdmin && <AdminView />}
    {!isAdmin && isVerified && <UserView />}
  </Layout>
}

export default IndexPage