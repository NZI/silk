CREATE TABLE role_permissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role_id int,
  permission_id int,
  FOREIGN KEY(permission_id) REFERENCES permissions(id),
  FOREIGN KEY(role_id) REFERENCES roles(id)
);
--202301291011_create_role_permissions_table
DROP TABLE role_permissions;