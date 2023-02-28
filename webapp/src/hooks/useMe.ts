import { useQuery } from "react-query"
import { client } from "../client";

export const useMe = () => {
  return useQuery("me", async () => {
    console.log("here")
    return client.User.me()
  }, { refetchOnMount: false, enabled: true })

}