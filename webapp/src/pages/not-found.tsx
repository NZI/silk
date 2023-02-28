

import { Box } from "@chakra-ui/react";
import { RouteComponentProps } from "@reach/router";
import React from "react";
import { Layout } from "~components/Layout";


const NotFoundPage: React.FC<RouteComponentProps> = () => {

  return <Layout>
    <Box>Page Not Found</Box>
  </Layout>
}

export default NotFoundPage