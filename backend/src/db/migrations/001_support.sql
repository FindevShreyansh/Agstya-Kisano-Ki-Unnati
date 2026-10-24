-- Persistent support conversations and escalated admin tickets.
CREATE TABLE IF NOT EXISTS support_conversations (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  owner_user_id BIGINT NOT NULL,
  owner_role ENUM('FARMER','BUYER') NOT NULL,
  category VARCHAR(40) NOT NULL DEFAULT 'OTHER',
  subject VARCHAR(180) NOT NULL,
  state ENUM('UNESCALATED','ESCALATED') NOT NULL DEFAULT 'UNESCALATED',
  last_user_read_at DATETIME NULL,
  last_admin_read_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_support_conversation_owner (owner_user_id, updated_at),
  FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS support_messages (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  conversation_id BIGINT NOT NULL,
  sender_type ENUM('USER','AI','ADMIN') NOT NULL,
  sender_user_id BIGINT NULL,
  body TEXT NOT NULL,
  client_message_id VARCHAR(80) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_support_client_message (conversation_id, client_message_id),
  INDEX idx_support_message_history (conversation_id, id),
  FOREIGN KEY (conversation_id) REFERENCES support_conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS support_tickets (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  ticket_code VARCHAR(32) NOT NULL UNIQUE,
  conversation_id BIGINT NOT NULL UNIQUE,
  summary TEXT NULL,
  summary_is_ai TINYINT(1) NOT NULL DEFAULT 0,
  escalation_reason VARCHAR(255) NOT NULL,
  priority ENUM('LOW','NORMAL','HIGH','URGENT') NOT NULL DEFAULT 'NORMAL',
  status ENUM('OPEN','IN_PROGRESS','WAITING_FOR_USER','RESOLVED','CLOSED') NOT NULL DEFAULT 'OPEN',
  assigned_admin_id BIGINT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_support_ticket_queue (status, priority, updated_at),
  FOREIGN KEY (conversation_id) REFERENCES support_conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_admin_id) REFERENCES users(id) ON DELETE SET NULL
);
