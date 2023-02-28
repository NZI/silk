CREATE TABLE user_permissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id int,
  permission_id int,
  `type` text,
  metadata text,
  FOREIGN KEY(user_id) REFERENCES user(id),
  FOREIGN KEY(permission_id) REFERENCES permissions(id)
);

--2023_01_29__10_10_00_create_user_permissions_table
DROP TABLE user_permissions;