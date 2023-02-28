export type PermChecker = (...roles: (string | TemplateStringsArray)[]) => boolean;
export declare function Allow(...perms: ((R: PermChecker, P: PermChecker) => boolean)[]): any;
