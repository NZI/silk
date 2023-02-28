import { ChakraProps, Flex } from "@chakra-ui/react"

export const Container: React.FC<React.PropsWithChildren<ChakraProps>> = (props) => {
  return <Flex
    width="full"
    height="full"
    minHeight="100vh"
    alignItems="center"
    backgroundColor={props.backgroundColor ?? "white"}
    justifyContent="center"
    {...props} />
}
