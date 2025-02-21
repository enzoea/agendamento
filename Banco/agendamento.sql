CREATE database agendamento;

use agendamento;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

-- Criar tabela de eventos (opcional, se ainda quiser manter eventos separados)
CREATE TABLE IF NOT EXISTS eventos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuarios_id INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    data_evento DATE NOT NULL,
    FOREIGN KEY (usuarios_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Criar tabela de calendário (agendamentos)
CREATE TABLE IF NOT EXISTS calendario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuarios_id INT NOT NULL,
    data_agendamento DATE NOT NULL, -- Nome atualizado
    hora TIME NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELED') DEFAULT 'PENDING',
    FOREIGN KEY (usuarios_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

SELECT * FROM calendario;