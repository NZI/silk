import { randomBytes, createHmac } from "crypto";
import { Allow, Service, Inject } from ".";

interface User {
  roles: string[],
  permissions: string[],
}

export class UserService extends Service {

  @Allow()
  async me(@Inject(d => d.user) user?: any): Promise<any> {
    console.log({ user })
    return user
  }

  @Allow()
  async register(email: string, password: string): Promise<any> {
    const userExists = await this.getUserByEmail(email)

    if (userExists) {
      return userExists.id
    }

    const salt = randomBytes(64)
    const hash = createHmac('sha512', salt)
      .update(password)
      .digest('base64');
    const { lastID } = await this.services.DatabaseService().all(
      `INSERT INTO users (
          email,
          password_hash,
          password_salt
        ) VALUES (
          :email,
          :hash,
          :salt
        )`,
      {
        email,
        hash,
        salt,
      }
    )
    return lastID
  }

  @Allow()
  async login(
    email: string,
    password: string,
    @Inject(d => d.cookies) cookies?: any,
    @Inject(d => d.session) session?: any,
  ): Promise<boolean> {
    const user = await this.getUserByEmail(email, true)

    if (!user) {
      return false
    }

    const hash = createHmac('sha512', user.password_salt)
      .update(password)
      .digest('base64');

    if (hash === user.password_hash) {
      session.userId = user?.id
    } else {
      session.userId = null
    }
    await this.services.SessionService().save(cookies.sid, session)

    return !!session.userId
  }

  @Allow()
  async logout(
    @Inject(d => d.cookies) cookies?: any,
    @Inject(d => d.session) session?: any,
  ): Promise<boolean> {
    if (!('userId' in session)) {
      return false
    }

    delete session.userId
    await this.services.SessionService().save(cookies.sid, session)

    return true
  }

  async getRole(role: string) {
    return await this.services.DatabaseService().selectOne(
      "SELECT id FROM roles WHERE `name` = :role",
      { role }
    )
  }

  async getUserRoles(id: number) {
    return await this.services.DatabaseService().all(
      `SELECT roles.\`name\`--sql
      FROM user_roles
      INNER JOIN roles ON roles.id = user_roles.role_id
      WHERE user_id == :id`,
      { id }
    )
  }

  async getUserPermissions(id: number) {
    return await this.services.DatabaseService().all(
      `SELECT permissions.\`name\`--sql
      FROM user_permissions
      INNER JOIN permissions ON permissions.id = user_permissions.permissions_id
      WHERE user_id == :id`,
      { id }
    )
  }

  async getRolePermissions(role: string) {
    return await this.services.DatabaseService().all(
      `SELECT permissions.\`name\`--sql
      FROM roles
      INNER JOIN role_permissions ON roles.id = role_permissions.role_id
      INNER JOIN permissions ON role_permissions.permission_id = permissions.id
      WHERE roles.\`name\` = :role`,
      { role }
    )
  }

  async getPermission(permission: string) {
    return await this.services.DatabaseService().selectOne(
      "SELECT id FROM permissions WHERE `name` == :permission",
      { permission }
    )
  }

  async userHasRole(id: number, role: string): Promise<boolean> {
    return await this.services.DatabaseService().selectOne(
      `SELECT 1 FROM user_roles
      INNER JOIN roles ON user_roles.role_id = roles.id
      WHERE user_roles.user_id = :id
      AND roles.\`name\` = :role
      `, { id, role }
    )
  }

  async userHasPermission(id: number, permission: string): Promise<boolean> {
    return await this.services.DatabaseService().selectOne(
      `SELECT 1 FROM user_permissions
      INNER JOIN permissions ON permissions.id = user_permissions.permission_id 
      WHERE user_permissions.user_id = :id
      AND permissions.\`name\` = :permission
      `, { id, permission }
    )
  }
  async roleHasPermission(role: string, permission: string): Promise<boolean> {
    return await this.services.DatabaseService().selectOne(
      `SELECT 1 FROM role_permissions
      INNER JOIN permissions ON permissions.id = role_permissions.permission_id
      INNER JOIN roles ON role_permissions.role_id = roles.id
      WHERE permissions.\`name\` = :permission
      AND roles.\`name\` = :role
      `, { role, permission }
    )
  }

  async addRoleToUser(id: number, role: string, insert: boolean = false) {
    let roleData = await this.getRole(role)

    let roleId: number
    if (roleData) {
      roleId = roleData.id
    } else {
      if (!insert) {
        throw `${role} not found`
      }

      const newData = await this.services.DatabaseService().run(
        "INSERT INTO roles (`name`) VALUES (:role)",
        { role }
      )

      roleId = newData.lastID
    }

    const userHasRole = await this.userHasRole(id, role)

    if (!userHasRole) {
      await this.services.DatabaseService().run("INSERT INTO user_roles (user_id, role_id) VALUES (:id, :roleId)", {
        id,
        roleId
      })
    }

  }

  async addPermissionToUser(id: number, permission: string, insert: boolean = false) {
    let permissionData = await this.getPermission(permission)

    let permissionId: number
    if (permissionData) {
      permissionId = permissionData.id
    } else {
      if (!insert) {
        throw `${permission} not found`
      }

      const newData = await this.services.DatabaseService().run(
        "INSERT INTO permissions (`name`) VALUES (:permission)",
        { permission }
      )

      permissionId = newData.lastID
    }

    const userHasPermission = await this.userHasPermission(id, permission)

    if (!userHasPermission) {
      await this.services.DatabaseService().run("INSERT INTO user_permissions (user_id, permission_id) VALUES (:id, :permissionId)", {
        id,
        permissionId
      })
    }
  }

  async addPermissionToRole(role: string, permission: string, insert: boolean = false) {
    let roleData = await this.getRole(role)
    let permissionData = await this.getPermission(permission)

    let permissionId: number
    let roleId: number
    if (permissionData) {
      permissionId = permissionData.id
    } else {
      if (!insert) {
        throw `${permission} not found`
      }

      const newData = await this.services.DatabaseService().run(
        "INSERT INTO permissions (`name`) VALUES (:permission)",
        { permission }
      )

      permissionId = newData.lastID
    }

    if (roleData) {
      roleId = roleData.id
    } else {
      if (!insert) {
        throw `${role} not found`
      }

      const newData = await this.services.DatabaseService().run(
        "INSERT INTO roles (`name`) VALUES (:role)",
        { role }
      )

      roleId = newData.lastID
    }

    const roleHasPermission = await this.roleHasPermission(role, permission)

    if (!roleHasPermission) {
      await this.services.DatabaseService().run(
        "INSERT INTO role_permissions (role_id, permission_id) VALUES (:roleId, :permissionId)",
        {
          roleId,
          permissionId
        }
      )
    }

  }

  async getUserByEmail(email: string, includeSensitive: boolean = false) {

    if (includeSensitive) {
      return this.services.DatabaseService().selectOne(
        `SELECT * FROM users WHERE email = :email`,
        { email }
      )
    } else {
      return this.services.DatabaseService().selectOne(
        `SELECT id FROM users WHERE email = :email`,
        { email }
      )
    }

  }

  async getUserById(id: number) {

    const user = await this.services.DatabaseService().selectOne(
      `SELECT id, email FROM users WHERE id = :id`,
      { id }
    )

    return user
  }

  async getUserAndRolesById(id: number): Promise<User | null> {
    const user = await this.getUserById(id)
    if (!user) {
      return null
    }

    const permissions = await this.services.DatabaseService().all(
      `SELECT p.name as name
      FROM users u_p
      INNER JOIN user_permissions up ON up.user_id = :id
      INNER JOIN permissions p ON up.permission_id = p.id

      WHERE u_p.id = :id

      UNION SELECT pr.name as name
      FROM users u_r
      INNER JOIN
        user_roles ur ON ur.user_id = :id
      INNER JOIN
        role_permissions rp 
      ON rp.role_id = ur.role_id
      INNER JOIN permissions pr ON rp.permission_id = pr.id
      INNER JOIN roles r ON r.id = rp.role_id

      WHERE u_r.id = :id`,
      { id }
    )

    const roles = await this.services.DatabaseService().all(
      `SELECT roles.name as name
       FROM roles
       INNER JOIN user_roles ON user_roles.role_id = roles.id
       WHERE user_roles.user_id = :id`,
      { id }
    )



    return {
      ...user,
      permissions: permissions.map(p => p.name),
      roles: roles.map(r => r.name),
    }
    /* {
      roles: ['ANY', 'OTHER'],
      permissions: []
    } */
  }
}