
import { Box, Button, Flex, Grid, Heading, Icon, Input, Portal, Text } from "@chakra-ui/react"
import { navigate } from "@reach/router"
import React, { ReactElement, useCallback, useEffect, useState } from "react"
import { useForm, UseFormReturn } from "react-hook-form"
import { IconType } from "react-icons"
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"
import { useQueryClient } from "react-query"
import { usePage } from "../hooks/usePage"
import useRole from "../hooks/useRole"
import { useDeferredPromise } from "./DeferredDialog"
import { Layout } from "./Layout"

interface Action {
  icon: IconType
  title: string
  form: string
}


interface CellProps {
  index: number
  id: number
  currentId: number
  column: string
  value: string
  editable: boolean
  update: (id: number, column: string, value: string) => void
}

const Cell: React.FC<CellProps> = ({ index, value, editable, id, column, update, currentId }) => {

  const [transient, setTransient] = useState(value)

  return <Flex alignItems="center"
    padding={2}
    backgroundColor={index % 2 === 1 ? "blue.50" : "white"}
    borderX="2px solid transparent"
    borderY={currentId === id ? "2px dashed grey" : "2px solid transparent"}
    cursor={editable ? "text" : "pointer"}
    _hover={{
      border: editable || currentId === id ? "2px dashed grey" : "2px solid transparent"
    }}>
    {editable ? <Input type="text"
      value={transient}
      onBlur={() => {
        if (transient !== value) {
          update(id, column, transient)
        }
      }}
      onChange={e => setTransient(e.currentTarget.value)}
      border="none"
    /> : <Text>{value}</Text>}

  </Flex>
}

interface RowProps {
  index: number
  datum: any
  currentId: number
  columns: {
    label: string
    column: string
    editable?: boolean
  }[]
  actions: Action[]
  update: (id: number, column: string, value: string) => void
  showForm: ((form: string, id?: number) => void)
}

const Row: React.FC<RowProps> = ({ datum, columns, currentId, index = 0, actions, update, showForm }) => {
  const isAdmin = useRole("ADMIN")
  return <>
    <Flex alignItems="center"
      paddingX={6}
      backgroundColor={index % 2 === 1 ? "blue.50" : "white"}
      borderRight="2px solid transparent"
      borderLeft={currentId === datum.id ? "2px dashed grey" : "2px solid transparent"}
      borderY={currentId === datum.id ? "2px dashed grey" : "2px solid transparent"}
    ><Text>{datum.id}</Text></Flex>
    {columns.map(({ column, editable }) => {
      return <Cell key={column} currentId={currentId} index={index} value={datum[column]} editable={editable && isAdmin} column={column} id={datum.id} update={update} />
    })}
    <Box padding={2}
      backgroundColor={index % 2 === 1 ? "blue.50" : "white"}
      borderLeft="2px solid transparent"
      borderRight={currentId === datum.id ? "2px dashed grey" : "2px solid transparent"}
      borderY={currentId === datum.id ? "2px dashed grey" : "2px solid transparent"}
    >
      {actions.map((action) => {
        return <Button key={action.title} marginX={2} title={action.title} onClick={() => showForm(action.form, datum.id)}>
          <Icon as={action.icon} />
        </Button>
      })}
    </Box>
  </>
}

interface Props {
  table: string
  title: string
  icon: IconType
  columns: {
    label: string
    column: string
    editable?: boolean
  }[]
  forms: {
    create: (done: (data: any) => void) => ReactElement
    [key: string]: (
      (done: (data: any) => void) => ReactElement
    ) | (
      (done: (data: any) => void, id?: number) => ReactElement
    )
  }
  actions: Action[]
  update: (id: number, column: string, value: string) => Promise<boolean>
}

const Crud: React.FC<Props> = ({ table, title, icon, columns, actions, update, forms }) => {
  const isAdmin = useRole('ADMIN')
  const [pageSize, setPageSize] = useState(10)
  const [filter, setFilter] = useState('')
  const [currentColumn, setCurrentColumn] = useState('id')
  const [order, setOrder] = useState('ASC')
  const queryClient = useQueryClient()


  const onUpdate = useCallback(async (id: number, column: string, value: string) => {
    if (await update(id, column, value)) {
      queryClient.invalidateQueries({ queryKey: table, refetchInactive: true })
    }
  }, [queryClient, update, table])

  const done = useCallback(async () => {
    queryClient.invalidateQueries({ queryKey: table, refetchInactive: true })
  }, [queryClient, update, table])


  useEffect(() => {
    if (isAdmin === false) {
      navigate('/')
    }
  }, [isAdmin])

  const {
    data,
    gotoPage,
    page,
  } = usePage(table, pageSize, filter, currentColumn, order)

  const [currentForm, setCurrentForm] = useState<{ name: string, id: number }>({
    name: "",
    id: -1
  })

  const toggleOrder = useCallback((newColumn: string) => {
    if (newColumn === currentColumn) {
      setOrder(order === "ASC" ? "DESC" : "ASC")
    } else {
      setCurrentColumn(newColumn)
      setOrder("ASC")
    }
  }, [currentColumn, setOrder, order, setCurrentColumn])

  const showForm = useCallback((name: string, id: number = 0) => {
    setCurrentForm({ name, id })
  }, [setCurrentForm])


  return <Layout>
    <Flex gap={5} alignItems="center" justifyContent="left">
      <Icon as={icon} width={10} height={10} />
      <Heading>{title}</Heading>
      <Button onClick={() => showForm("create")}>+</Button>
      <Input value={filter} onChange={e => setFilter(e.target.value)} placeholder="filter" marginLeft="auto" width={400} />
    </Flex>
    <Flex width="full" flexGrow={1}>
      <Flex>
        <Grid
          marginBottom="auto"
          gridTemplateAreas='"a"'
        >
          <Box onClick={() => setCurrentForm({ name: "", id: 0 })}>Close</Box>
          {Object.keys(forms).map((form) => {
            return <Flex key={form}
              flexShrink={1}
              gridArea="a"
              // opacity={currentForm.name === form ? 1 : 0}
              overflow="hidden"
              transformOrigin="50% 50%"
              width={currentForm.name === "" ? 0 : "300px"}
              transform={currentForm.name === form ? "scale(1)" : "scale(0.8)"}
              transition="0.3s all"
              pointerEvents={currentForm.name === form ? "all" : "none"}
              zIndex={currentForm.name === form ? 1 : 2}
            >
              {form === "create" && forms.create(done)}
              {form !== "create" && forms[form](done, currentForm.id)}
            </Flex>
          })}
        </Grid>
      </Flex>
      <Flex width="full" flexDirection="column">
        <Grid flexDir="column" gridTemplateColumns={`auto repeat(${columns.length}, 1fr) auto`}>
          <Box paddingX={6}
            cursor="pointer"
            onClick={() => toggleOrder('id')}
            paddingY={2}
            borderBottomWidth={2}
            borderBottomColor="grey.500"
            fontWeight={currentColumn === "id" ? 800 : 600}>
            ID
            {currentColumn === "id" ? (
              <Icon marginLeft={2} width={4} as={order === "ASC" ? AiOutlineArrowUp : AiOutlineArrowDown} />
            ) : (
              <Box marginLeft={2} width={8} />
            )}
          </Box>
          {columns.map(({ column, label }) => {
            return <Box key={column}
              padding={2}
              cursor="pointer"
              onClick={() => toggleOrder(column)}
              borderBottomWidth={2}
              borderBottomColor="grey.500"
              fontWeight={currentColumn === column ? 800 : 600}>
              {label}
              {currentColumn === column ? (
                <Icon marginLeft={2} width={4} as={order === "ASC" ? AiOutlineArrowUp : AiOutlineArrowDown} />
              ) : (
                <Box marginLeft={2} width={8} />
              )}
            </Box>
          })}
          <Box padding={2} borderBottomWidth={2} borderBottomColor="grey.500" fontWeight={600} textAlign="center">
            Actions
          </Box>
          {data.data.map((datum: any, index: number) => <Row key={datum.id}
            currentId={currentForm.id}
            index={index}
            columns={columns}
            datum={datum}
            actions={actions}
            showForm={showForm}
            update={onUpdate} />)}
        </Grid>
        <Flex justifyContent="center" marginTop="auto" alignItems="center" gap={10}>
          <Button disabled={page <= 0} variant={page <= 0 ? "ghost" : "solid"} onClick={() => gotoPage(page - 1)}>
            <Icon as={IoIosArrowBack} />
          </Button>
          <Text>{page * pageSize + 1} to {Math.min(data.count, (page + 1) * pageSize)} of {data.count}</Text>
          <Button disabled={(page + 1) * pageSize >= data.count} variant={(page + 1) * pageSize >= data.count ? "ghost" : "solid"} onClick={() => gotoPage(page + 1)}>
            <Icon as={IoIosArrowForward} />
          </Button>
        </Flex>
      </Flex>
    </Flex>
  </Layout>
}

export default Crud