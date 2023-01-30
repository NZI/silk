import { Box, Button, ChakraProps, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Grid, Icon, Input, Text } from "@chakra-ui/react";
import { navigate, RouteComponentProps } from "@reach/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BsShieldLock } from "react-icons/bs";
import { useMutation, useQueryClient } from "react-query";
import { client } from "../client";

const Container: React.FC<React.PropsWithChildren<ChakraProps>> = (props) => {
  return <Flex
    width="full"
    height="full"
    minHeight="100vh"
    alignItems="center"
    justifyContent="center"
    {...props} />
}

interface UserLoginData {
  email: string
  password: string
}

interface UserRegisterData {
  email: string
  password: string
  confirmPassword: string
}
interface FormProps {
  show: boolean
  onSubmit: Function
}
const LoginForm: React.FC<FormProps> = ({ show, onSubmit }) => {
  const queryClient = useQueryClient()

  const login = useMutation((data: UserLoginData) => {
    return client.UserService().login(data.email, data.password)
  }, {
    onSettled() {
      queryClient.invalidateQueries(['me'])
    }
  })


  const { handleSubmit, register, setError, formState: { errors } } = useForm<UserLoginData>()
  const beforeSubmit = async (data: UserLoginData) => {
    const user = await login.mutateAsync(data)
    console.log({ user })
    if (user) {
      onSubmit()
    } else {
      setError("email", { message: "Incorrect email or password" })
    }
  }

  return <Flex as="form" gap={4}
    gridArea="a"
    opacity={show ? 1 : 0}
    zIndex={show ? 1 : 1}
    pointerEvents={show ? "all" : "none"}
    transition="0.3s all"
    flexDirection="column"
    justifyContent="center"
    width="full"
    onSubmit={handleSubmit(beforeSubmit)}
    alignItems="center">
    <FormControl isInvalid={!!errors.email}>
      <Input backgroundColor="white"
        width="full"
        type="email"
        placeholder="Email"
        {...register("email", { required: true })} />
      {errors.email?.message && <FormErrorMessage>{errors.email.message}</FormErrorMessage>}
    </FormControl>
    <FormControl isInvalid={!!errors.password}>
      <Input backgroundColor="white"
        width="full"
        type="password"
        placeholder="Password"
        {...register("password", { required: true })}
      />
      {errors.password?.message && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
    </FormControl>
    <Input backgroundColor="white" paddingX={20} as={Button} type="submit" marginTop="auto">Login</Input>
  </Flex>
}

const RegisterForm: React.FC<FormProps> = ({ show, onSubmit }) => {

  const { handleSubmit, register, setError, formState: { errors } } = useForm<UserRegisterData>()
  const beforeSubmit = async (data: UserRegisterData) => {
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", { message: "Passwords must match" })
      return
    }
    if (await client.UserService().register(data.email, data.password)) {
      onSubmit()
    }
  }

  return <Flex as="form"
    gap={4}
    gridArea="a"
    zIndex={show ? 1 : 2}
    opacity={show ? 1 : 0}
    pointerEvents={show ? "all" : "none"}
    transition="0.3s all"
    flexDirection="column"
    justifyContent="center"
    onSubmit={handleSubmit(beforeSubmit)}
    width="full">
    <FormControl isInvalid={!!errors.email}>
      <Input backgroundColor="white"
        width="full"
        type="email"
        placeholder="Email"
        {...register("email", { required: true })} />
      {errors.email?.message && <FormErrorMessage>{errors.email.message}</FormErrorMessage>}
    </FormControl>
    <FormControl isInvalid={!!errors.password}>
      <Input backgroundColor="white"
        width="full"
        type="password"
        placeholder="Password"
        {...register("password", { required: true })}
      />
      {errors.password?.message && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
    </FormControl>
    <FormControl isInvalid={!!errors.confirmPassword}>
      <Input backgroundColor="white"
        width="full"
        type="password"
        placeholder="Confirm Password"
        {...register("confirmPassword", { required: true })} />
      {errors.confirmPassword?.message && <FormErrorMessage>{errors.confirmPassword.message}</FormErrorMessage>}
    </FormControl>
    <Input backgroundColor="white" paddingX={20} as={Button} type="submit">Register</Input>
  </Flex>
}

const LoginPage: React.FC<RouteComponentProps> = () => {
  const [showLogin, setShowLogin] = useState(true)

  return <Container background="#535353">
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      maxWidth={400}
      width="100vw"
    >
      <Flex width="full"
        borderTopRadius={10}
        textAlign="center"
        position="relative"
        overflow="hidden">
        <Box position="absolute"
          left={showLogin ? "-5%" : "50%"}
          top={0}
          transition="0.3s all"
          width="55%"
          height="101%"
          borderTopRightRadius={showLogin ? 10 : 0}
          borderTopLeftRadius={showLogin ? 0 : 10}
          transform={showLogin ? "skew(10deg)" : "skew(-10deg)"}
          backgroundColor="white"
        />
        <Text width="50%"
          padding={4}
          cursor="pointer"
          fontSize={20}
          position="relative"
          fontWeight="bold"
          onClick={() => setShowLogin(true)}
          color={showLogin ? "#535353" : "white"}>
          Login
        </Text>
        <Text width="50%"
          padding={4}
          cursor="pointer"
          fontSize={20}
          fontWeight="bold"
          position="relative"
          onClick={() => setShowLogin(false)}
          color={showLogin ? "white" : "#535353"}>
          Register
        </Text>
      </Flex>
      <Grid gridTemplateAreas='"a"'
        transition="0.3s all"
        width="full"
        borderTopRightRadius={showLogin ? 10 : 0}
        borderTopLeftRadius={showLogin ? 0 : 10}
        padding={6}
        borderBottomRadius={10}
        backgroundColor="white">
        <LoginForm show={showLogin} onSubmit={() => navigate('/')} />
        <RegisterForm show={!showLogin} onSubmit={() => setShowLogin(true)} />
      </Grid>
    </Flex>
  </Container >
}

export default LoginPage