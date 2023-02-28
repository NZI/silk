select name,
  iif(user_id is null, FALSE, TRUE) as 'add'
from roles
  LEFT JOIN user_roles on roles.id = user_roles.role_id