import { useQuery } from "react-query"
import { client } from "../client"

export const useMe = () => useQuery("me", async () => client.UserService().me())