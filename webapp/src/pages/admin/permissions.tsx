import { RouteComponentProps } from "@reach/router";
import { useCallback } from "react";
import { BsFillPeopleFill, BsKeyFill, BsUnlockFill } from "react-icons/bs";
import { TiDelete } from "react-icons/ti";
import { useQueryClient } from "react-query";
import { client } from "~client";
import Crud from "../../components/Crud";


const PermissionsPage: React.FC<RouteComponentProps> = () => {
  const queryClient = useQueryClient()
  const update = useCallback(async (id: number, column: string, value: string) => {
    console.log({ id, column, value })
    if (await client.Permission.update(id, column, value)) {
      queryClient.invalidateQueries({ queryKey: 'permissions', refetchInactive: true })
    }
  }, [queryClient])

  return <Crud
    title="Permissions"
    icon={BsFillPeopleFill}
    table="permissions"
    columns={[
      { label: "Name", column: "name", editable: true },
    ]}
    update={update}
    actions={[
      {
        icon: TiDelete,
        title: "Delete",
        onClick: async (id) => {

          console.log({ user: "Delete", id })
        }
      },
    ]} />
}

export default PermissionsPage