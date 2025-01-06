SET @ROOT_UUID = UNHEX(REPLACE(UUID(), '-', ''));
SET @ROOT_USERNAME = '';
SET @ROOT_PASSWORD_HASH = '';

INSERT INTO volunteers (uuid, username, password, fullname, function_uuid, voluntary_role, valid)
VALUES (
    @ROOT_UUID,
    @ROOT_USERNAME,
    @ROOT_PASSWORD_HASH,
    'Root User',
    NULL,
    'ROLE_ADMIN',
    TRUE
);

SELECT 'Usuário root criado ou atualizado com sucesso.' AS Status;