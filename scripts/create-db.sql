-- Execute isso conectando como superusuário no PostgreSQL:
-- sudo -u postgres psql

-- Cria o banco de dados
CREATE DATABASE deriva_pwa;

-- Cria o usuário com uma senha forte
-- ATENÇÃO: TROQUE_POR_SENHA_FORTE por uma senha segura real antes de executar!
CREATE USER deriva_user WITH ENCRYPTED PASSWORD 'TROQUE_POR_SENHA_FORTE';

-- Concede privilégios básicos
GRANT ALL PRIVILEGES ON DATABASE deriva_pwa TO deriva_user;

-- Altera o dono do banco para o usuário recém criado
ALTER DATABASE deriva_pwa OWNER TO deriva_user;

-- Conecta no novo banco
\c deriva_pwa

-- Garante que o usuário tem acesso ao schema public
GRANT ALL ON SCHEMA public TO deriva_user;
