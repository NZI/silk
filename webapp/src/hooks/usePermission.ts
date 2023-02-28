import { useMemo } from "react"
import { useMe } from "./useMe"

const usePermission = (permission: string) => {
  const user = useMe()

  return useMemo(() => {
    const permissions = user.data?.permissions ?? []
    return permissions.includes(permissions)
  }, [user, permission])
}

export default usePermission