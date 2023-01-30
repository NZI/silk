import { useMutation, useQueryClient } from "react-query"
import { client } from "../client"


export const useLogout = () => {

  const queryClient = useQueryClient()

  const logout = useMutation(() => {
    return client.UserService().logout()
  }, {
    onSettled() {
      queryClient.invalidateQueries(['me'])
    }
  })

  return { logout }
}