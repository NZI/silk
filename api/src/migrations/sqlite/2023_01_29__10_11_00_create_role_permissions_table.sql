CREATE TABLE role_permissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role_id int,
  permission_id int,
  `type` text,
  metadata text,
  FOREIGN KEY(permission_id) REFERENCES permissions(id),
  FOREIGN KEY(role_id) REFERENCES roles(id)
);

--2023_01_29__10_11_00_create_role_permissions_table
DROP TABLE role_permissions;