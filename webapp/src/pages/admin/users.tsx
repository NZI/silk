import { Button, Flex, Input, Text, useDisclosure } from "@chakra-ui/react";
import { RouteComponentProps } from "@reach/router";
import { useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { BsFillPeopleFill, BsKeyFill, BsShieldCheck } from "react-icons/bs";
import { MdManageAccounts } from "react-icons/md";
import { TiDelete } from "react-icons/ti";
import { client } from "~client";
import Crud from "../../components/Crud";



const UsersPage: React.FC<RouteComponentProps> = () => {


  const update = useCallback(async (id: number, column: string, value: string) => {
    return client.User.update(id, column, value)
  }, [])


  const create = useCallback(async (data: any): Promise<boolean> => {
    return !!client.User.register(data.email, data.password)
  }, [])


  return <Crud
    title="Users"
    icon={BsFillPeopleFill}
    table="users"
    columns={[{ label: "Email", column: "email", editable: true }]}
    forms={{
      create(done) {
        interface Values {
          email: string
          password: string
          confirmPassword: string
        }
        const { register, handleSubmit } = useForm<Values>()
        const onSubmit = useCallback(async (data: Values) => {
          const { email, password, confirmPassword, } = data
          if (password !== confirmPassword) {
            return false
          }
          const success = await client.User.register(email, password)
          if (success) {
            done(data)
          }
        }, [done])

        return <Flex flexDirection="column" gap={4} as="form" onSubmit={handleSubmit(onSubmit)}>
          <Text>Create New User</Text>
          <Input placeholder="Email address" type="email" {...register("email")} />
          <Input placeholder="Password" type="password" {...register("password")} />
          <Input placeholder="Confirm Password" type="password" {...register("confirmPassword")} />
          <Input type="submit" value="Register" />
        </Flex>
      },
      updatePassword(done, id) {
        interface Values {
          password: string
          confirmPassword: string
        }
        const { register, handleSubmit } = useForm<Values>()
        const onSubmit = useCallback(async (data: Values) => {
          if (!id) {
            return false
          }
          const success = await client.User.updateUserPassword(id, data.password)
          if (success) {
            done(data)
          }
        }, [done])

        return <Flex flexDirection="column" gap={4} as="form" onSubmit={handleSubmit(onSubmit)}>
          <Text>Update Password</Text>
          <Input {...register("password")} />
          <Input {...register("confirmPassword")} />
          <Input type="submit" value="Update Password" />
        </Flex>
      },
      updateRoles(done, id) {
        interface Values {
          password: string
          confirmPassword: string
        }
        const { register, handleSubmit } = useForm<Values>()
        const onSubmit = useCallback(async (data: Values) => {
          if (!id) {
            return false
          }
          const success = await client.User.updateUserPassword(id, data.password)
          if (success) {
            done(data)
          }
        }, [done])

        return <Flex flexDirection="column" gap={4} as="form" onSubmit={handleSubmit(onSubmit)}>
          <Text>Update Roles</Text>
          <Input {...register("password")} />
          <Input {...register("confirmPassword")} />
          <Input type="submit" value="Update Password" />
        </Flex>
      },
      updatePermissions(done, id) {
        interface Values {
          password: string
          confirmPassword: string
        }
        const { register, handleSubmit } = useForm<Values>()
        const onSubmit = useCallback(async (data: Values) => {
          if (!id) {
            return false
          }
          const success = await client.User.updateUserPassword(id, data.password)
          if (success) {
            done(data)
          }
        }, [done])

        return <Flex flexDirection="column" gap={4} as="form" onSubmit={handleSubmit(onSubmit)}>
          <Text>Update Permissions</Text>
          <Input {...register("password")} />
          <Input {...register("confirmPassword")} />
          <Input type="submit" value="Update Password" />
        </Flex>
      },
      delete(done, id) {
        interface Values {
          password: string
          confirmPassword: string
        }
        const { register, handleSubmit } = useForm<Values>()
        const onSubmit = useCallback(async (data: Values) => {
          if (!id) {
            return false
          }
          const success = await client.User.updateUserPassword(id, data.password)
          if (success) {
            done(data)
          }
        }, [done])

        return <Flex flexDirection="column" gap={4} as="form" onSubmit={handleSubmit(onSubmit)}>
          <Text>Delete User</Text>
          <Input {...register("password")} />
          <Input {...register("confirmPassword")} />
          <Input type="submit" value="Update Password" />
        </Flex>
      },
    }}

    actions={
      [
        {
          icon: BsKeyFill,
          title: "Update Password",
          form: "updatePassword",
        },
        {
          icon: MdManageAccounts,
          title: "Update Roles",
          form: "updateRoles",
        },
        {
          icon: BsShieldCheck,
          title: "Update Permissions",
          form: "updatePermissions",
        },
        {
          icon: TiDelete,
          title: "Delete",
          form: "delete",
        },
      ]
    }
    update={update}
  />
}

export default UsersPage