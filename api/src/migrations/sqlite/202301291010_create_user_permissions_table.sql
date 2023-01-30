CREATE TABLE user_permissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id int,
  permission_id int,
  FOREIGN KEY(user_id) REFERENCES user(id),
  FOREIGN KEY(permission_id) REFERENCES permissions(id)
);
--202301291010_create_user_permissions_table
DROP TABLE user_permissions;