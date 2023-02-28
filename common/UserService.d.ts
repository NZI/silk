import { Service } from "./lib/Service";
interface User {
    roles: string[];
    permissions: string[];
}
export declare class User extends Service {
    me(user?: any): Promise<any>;
    getVisibleUsers(): Promise<void>;
    create(email: string, password: string, roles: string[], permissions: string[]): Promise<void>;
    register(email: string, password: string): Promise<false | number>;
    updateUserPassword(id: number, password: string): Promise<boolean>;
    login(email: string, password: string, cookies?: any, session?: any): Promise<boolean>;
    logout(cookies?: any, session?: any): Promise<boolean>;
    update(id: number, column: string, value: string): Promise<boolean>;
    getRole(role: string): Promise<any>;
    getUserRoles(id: number): Promise<any>;
    getUserPermissions(id: number): Promise<any>;
    getRolePermissions(role: string): Promise<any>;
    getPermission(permission: string): Promise<any>;
    userHasRole(id: number, role: string): Promise<boolean>;
    userHasPermission(id: number, permission: string): Promise<boolean>;
    roleHasPermission(role: string, permission: string): Promise<boolean>;
    addRoleToUser(id: number, role: string, insert?: boolean): Promise<void>;
    addRolesToUser(userId: number, roles: string[]): Promise<void>;
    addPermissionToUser(id: number, permission: string, insert?: boolean): Promise<void>;
    addPermissionToRole(role: string, permission: string, insert?: boolean): Promise<void>;
    getUserByEmail(email: string, includeSensitive?: boolean): Promise<any>;
    getUserById(id: number): Promise<any>;
    getUserAndRolesById(id: number): Promise<User | null>;
}
export {};
