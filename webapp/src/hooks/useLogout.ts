import { useMutation, useQueryClient } from "react-query"
import { client } from "../client";


export const useLogout = () => {

  const queryClient = useQueryClient()

  const logout = useMutation(async () => {
    return client.User.logout()
  }, {
    onSettled() {
      queryClient.invalidateQueries(['me'])
    }
  })

  return { logout }
}