CREATE TABLE roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  `name` varchar(255) NOT NULL,
  parent INTEGER,
  UNIQUE (`name`)
);

--2023_01_27__14_41_00_create_roles_table
DROP TABLE roles;