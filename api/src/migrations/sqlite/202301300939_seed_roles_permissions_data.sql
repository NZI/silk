INSERT INTO roles(`name`)
VALUES ("ADMIN");
INSERT INTO permissions(`name`)
VALUES ("VERIFIED");
INSERT INTO role_permissions (role_id, permission_id)
SELECT roles.id,
  permissions.id
FROM roles
  CROSS JOIN permissions
WHERE roles.`name` = "ADMIN"
  AND permissions.`name` = "VERIFIED";
--202301300939_seed_roles_permissions_data
DELETE FROM role_permissions
WHERE id IN (
    SELECT rp.id FROM role_permissions rp
    INNER JOIN roles ON rp.role_id = roles.id
    INNER JOIN permissions ON rp.permission_id = permissions.id
    WHERE roles.`name` = "ADMIN"
      AND permissions.`name` = "VERIFIED"
  );
DELETE FROM `permissions`
WHERE `name` = "VERIFIED";
DELETE FROM `roles`
WHERE `name` = "ADMIN";