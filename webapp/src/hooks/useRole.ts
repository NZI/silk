import { useMemo } from "react"
import { useMe } from "./useMe"

const useRole = (role: string) => {
  const user = useMe()

  return useMemo(() => {
    if (!user.data) {
      return undefined
    }

    const roles = user.data?.roles ?? []

    return roles.includes(role)
  }, [user, role])
}

export default useRole