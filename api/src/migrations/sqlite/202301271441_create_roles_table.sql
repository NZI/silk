CREATE TABLE roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  `name` varchar(255) NOT NULL,
  UNIQUE (`name`)
);
--202301271441_create_roles_table
DROP TABLE roles;