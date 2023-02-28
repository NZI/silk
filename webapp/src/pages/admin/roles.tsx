import { RouteComponentProps } from "@reach/router";
import { useCallback } from "react";
import { BsFillPeopleFill, BsKeyFill, BsUnlockFill } from "react-icons/bs";
import { TiDelete } from "react-icons/ti";
import { useQueryClient } from "react-query";
import { client } from "~client";
import Crud from "~components/Crud";


const RolesPage: React.FC<RouteComponentProps> = () => {
  const queryClient = useQueryClient()
  const update = useCallback(async (id: number, column: string, value: string) => {
    console.log({ id, column, value })
    if (await client.Role.update(id, column, value)) {
      queryClient.invalidateQueries({ queryKey: 'roles', refetchInactive: true })
    }
  }, [queryClient])

  return <Crud
    title="Roles"
    icon={BsFillPeopleFill}
    table="roles"
    columns={[
      { label: "Name", column: "name", editable: true },
    ]}
    actions={[
      {
        icon: TiDelete,
        title: "Delete",
        onClick: id => {
          console.log({ user: "Delete", id })
        }
      },
    ]}
    update={update}
  />
}

export default RolesPage