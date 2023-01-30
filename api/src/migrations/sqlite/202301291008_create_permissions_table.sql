CREATE TABLE permissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  `name` varchar(255) NOT NULL,
  UNIQUE (`name`)
);
--202301291008_create_permissions_table
DROP TABLE permissions;