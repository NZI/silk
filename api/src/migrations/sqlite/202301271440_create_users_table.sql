CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email varchar(255) NOT NULL,
  password_hash varchar(255) NOT NULL,
  password_salt varchar(255) NOT NULL,
  UNIQUE (email)
);
--202301271440_create_users_table
DROP TABLE users;