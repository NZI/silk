CREATE TABLE user_roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id int,
  role_id int,
  `order` int,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(role_id) REFERENCES roles(id)
);

--2023_01_27__14_41_00_create_user_roles_table
DROP TABLE user_roles;