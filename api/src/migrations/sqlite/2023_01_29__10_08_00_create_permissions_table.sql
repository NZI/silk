CREATE TABLE permissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  `name` varchar(255) NOT NULL,
  UNIQUE (`name`)
);

--2023_01_29__10_08_00_create_permissions_table
DROP TABLE permissions;