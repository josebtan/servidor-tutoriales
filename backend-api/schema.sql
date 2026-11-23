-- =============================================================================
-- UNITYCRAFT NETWORK — ESQUEMA MYSQL DE PLATAFORMA WEB Y PUENTE IN-GAME
-- Compatible con MySQL 8.0+ / MariaDB 10.6+ (ElixirNode Server ID: 8b9cfa7f)
-- =============================================================================

CREATE TABLE IF NOT EXISTS web_users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  minecraft_uuid CHAR(36) NULL UNIQUE,
  minecraft_username VARCHAR(20) NULL,
  unity_tokens INT UNSIGNED NOT NULL DEFAULT 0,
  rank_badge VARCHAR(64) NOT NULL DEFAULT 'SURVIVOR',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_mc_username (minecraft_username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Códigos OTP de 1 solo uso para /vincular <CODIGO> dentro de Minecraft
CREATE TABLE IF NOT EXISTS web_link_codes (
  code VARCHAR(12) PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_link_user FOREIGN KEY (user_id) REFERENCES web_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Catálogo oficial de artículos sincronizado con CraftEngine, UltraCosmetics y LuckPerms
CREATE TABLE IF NOT EXISTS web_store_catalog (
  item_key VARCHAR(64) PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  category ENUM('chests', 'cosmetics', 'ranks') NOT NULL,
  token_cost INT UNSIGNED NOT NULL,
  server_command VARCHAR(255) NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO web_store_catalog (item_key, title, category, token_cost, server_command) VALUES
  ('normal_key_3x', 'Pack 3× Llave Normal', 'chests', 250, 'ce item give {player} chests:normal_key 3'),
  ('medium_key_3x', 'Pack 3× Llave Media', 'chests', 550, 'ce item give {player} chests:medium_key 3'),
  ('premium_key_3x', 'Pack 3× Llave Ultra Mítica', 'chests', 950, 'ce item give {player} chests:premium_key 3'),
  ('witch_hat', 'Sombrero de Bruja 3D', 'cosmetics', 600, 'ce item give {player} cosmetics:witch_hat_black 1'),
  ('barrel_armor', 'Armadura Caballero Barril 3D', 'cosmetics', 750, 'ce item give {player} cosmetics:barrel_chestplate 1'),
  ('wooden_wheel', 'Escudo Rueda de Madera 3D', 'cosmetics', 500, 'ce item give {player} cosmetics:wooden_wheel 1'),
  ('farmer_pack', 'Pack Cubeta y Horca 3D', 'cosmetics', 450, 'ce item give {player} cosmetics:wooden_bucket 1'),
  ('uc_gadgets', 'Pack Gadgets Cohete & Discoball', 'ranks', 800, 'lp user {player} permission set ultracosmetics.gadgets.*'),
  ('rank_legend_30d', 'Rango [LEGEND] (30 Días)', 'ranks', 1500, 'lp user {player} parent addtemp legend 30d')
ON DUPLICATE KEY UPDATE
  token_cost = VALUES(token_cost),
  server_command = VALUES(server_command);

-- Registro de recargas de dinero real (Idempotencia contra doble cobro / Webhooks)
CREATE TABLE IF NOT EXISTS web_token_topups (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  provider ENUM('stripe', 'paypal', 'mercadopago', 'tebex') NOT NULL,
  external_tx_id VARCHAR(128) NOT NULL UNIQUE,
  tokens_credited INT UNSIGNED NOT NULL,
  amount_usd DECIMAL(8,2) NOT NULL,
  status ENUM('COMPLETED', 'REFUNDED', 'DISPUTED') NOT NULL DEFAULT 'COMPLETED',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_topup_user FOREIGN KEY (user_id) REFERENCES web_users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cola de entrega automática in-game (procesada por API Pterodactyl o Plugin Poller)
CREATE TABLE IF NOT EXISTS web_reward_queue (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NULL,
  minecraft_username VARCHAR(20) NOT NULL,
  item_key VARCHAR(64) NOT NULL,
  token_cost INT UNSIGNED NOT NULL,
  command_to_run VARCHAR(255) NOT NULL,
  status ENUM('PENDING', 'DELIVERED', 'FAILED') NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  delivered_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
