import { BackgroundProps, Box, ChakraProps, Flex, Icon, Text } from "@chakra-ui/react";
import { navigate } from "@reach/router";
import React, { DOMAttributes, ReactElement, useEffect, useMemo, useState } from "react";
import { BiCog, BiLogOut } from "react-icons/bi";
import { BsFillPeopleFill, BsGlobe, BsShieldCheck } from "react-icons/bs";
import { MdManageAccounts } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { TiSpanner } from "react-icons/ti";
import { Container } from "../components/Container";
import { useLogout } from "../hooks/useLogout";
import { useMe } from "../hooks/useMe";


interface MenuIconProps {
  showMenu: boolean
}
interface MenuItem extends React.DOMAttributes<Element> {
  icon?: ReactElement
  label: string
  to?: string
  submenu?: MenuItem[]
}
interface MenuProps {
  menu: MenuItem[]
  level?: number
}

const MenuBackgroundColors: BackgroundProps['backgroundColor'][] = [
  'white',
  'white',
  'white',
]

const MenuForegroundColors: BackgroundProps['backgroundColor'][] = [
  'black',
]


const MenuIcon: React.FC<MenuIconProps & ChakraProps & DOMAttributes<Element>> = ({ showMenu, ...props }) => {
  return <Box as="svg"
    {...props}
    viewBox="0 0 10 10"
    marginY="auto"
    width={{ base: 8, md: 5 }} height={{ base: 8, md: 5 }}
  >
    <line x1={1}
      y1={5}
      x2={9}
      y2={5}
      stroke="white"
      strokeLinecap="round"
      style={{
        transformOrigin: "50% 50%",
        transition: "0.3s all",
        transform: showMenu ? "rotate(315deg) scale(0.9)" : "translateY(-2px) scale(0.8)"
      }}
    />
    <line x1={1}
      y1={5}
      x2={9}
      y2={5}
      stroke="white"
      strokeLinecap="round"
      style={{
        transformOrigin: "50% 50%",
        transition: "0.3s all",
        transform: showMenu ? "rotate(45deg) scale(0.9)" : "translateY(2px) scale(0.8)"
      }}
    />
  </Box>
}

const Menu: React.FC<MenuProps> = ({ menu, level = 0 }) => {
  return <>{menu.map(item => {

    return <React.Fragment key={item.label}>
      <Flex
        onClick={(e) => {
          if (item.to) {
            return navigate(item.to)
          }

          item.onClick?.(e)
        }}
        alignItems="center"
        gap={6}
        // minW={200}
        paddingLeft={6}
        paddingY={4}
        paddingRight={6}
        cursor="pointer"
        whiteSpace="nowrap"
        color={MenuForegroundColors.at(level) ?? "black"}>
        {item.icon}
        <Text fontFamily="Helvetica"
          paddingLeft={0}
          fontSize="xl"
          marginX="auto"
          fontWeight="500"
        >{item.label}</Text>
      </Flex>
      {item.submenu && item.to && <Menu menu={item.submenu} level={level + 1} />}
    </React.Fragment>
  })}</>
}



const UserMenu: MenuItem[] = []

interface LayoutProps {
}

export const Layout: React.FC<React.PropsWithChildren<LayoutProps>> = ({ children }) => {
  const user = useMe()
  const { logout } = useLogout()


  useEffect(() => {
    if ((!user.isRefetching && !user.isLoading) && !user.data) {
      navigate('/login')
    }
  }, [user])

  const AdminMenu: MenuItem[] = useMemo(() => [
    {
      icon: <Icon as={RxDashboard} color="#dc6041" width={5} height={5} />,
      label: "Dashboard",
      to: "/",
    },
    {
      label: "Domains",
      to: "/domains",
      icon: <Icon as={BsGlobe} color="#dc6041" width={5} height={5} />,
    },
    {
      label: "Admin",
      to: "/admin",
      icon: <Icon as={BiCog} color="#dc6041" width={5} height={5} />,
      submenu: [
        {
          icon: <Icon as={BsFillPeopleFill} color="#dc6041" width={5} height={5} />,
          label: "Users",
          to: "/admin/users",
          submenu: [
            {
              icon: <Icon as={MdManageAccounts} color="#dc6041" width={5} height={5} />,
              label: "Roles",
              to: "/admin/users/roles"
            },
            {
              icon: <Icon as={BsShieldCheck} color="#dc6041" width={5} height={5} />,
              label: "Permissions",
              to: "/admin/users/permissions"
            },
          ]
        },
        {
          icon: <Icon as={TiSpanner} color="#dc6041" width={5} height={7} />,
          label: "Integrations",
          to: "/admin/integrations"
        },
      ]
    },
    {
      icon: <Icon as={BiLogOut} color="#dc6041" width={5} height={5} />,
      label: "Logout",
      onClick() {
        logout.mutate()
      },
    },
  ], [logout])

  const roles = user.data?.roles ?? []
  const permissions = user.data?.permissions ?? []
  const isAdmin = roles.includes("ADMIN")
  const isVerified = permissions.includes("VERIFIED")

  const [showMenu, setShowMenu] = useState(false)
  /**    width: 69px;
      overflow-x: hidden;
      width: 347px;
  } */
  const menu = isAdmin ? AdminMenu : UserMenu

  return <Container justifyContent="left" alignItems="top" position="relative">
    <Flex flexDir="column"
      position="relative"
      gap={5}
      backgroundColor="white"
      flexGrow={1}
      marginRight={16}
      marginY="auto"
      padding={10}
      minHeight="100vh">
      {children}
    </Flex>
    <Flex direction="column"
      position="absolute"
      right={0}
      top={0}
    >
      <Flex padding={2}
        marginY={3}
        marginRight={4}
        backgroundColor="#dc6041"
        color="white"
        cursor="pointer"
        marginLeft="auto"
        zIndex={1}
        // marginBottom={showMenu ? "-3.0rem" : 0}
        borderRadius={12}
        alignItems="center"
        userSelect="none"
        onClick={(e) => {
          setShowMenu(!showMenu)
        }}
      >
        <MenuIcon showMenu={showMenu} />
      </Flex>
      <Flex direction="column"
        // flexGrow={1}
        backgroundColor="white"
        zIndex={1}
        transition="0.3s all"
        width={showMenu ? "215px" : "69px"}
        overflowX="hidden"
        alignItems="top"
        boxShadow="0 0 5px 5px #cacaca">
        {menu && <Menu menu={menu} />}
      </Flex>
    </Flex>
  </Container>
}
