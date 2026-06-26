-- 1. users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. wallets Table
CREATE TABLE wallets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    wallet_type VARCHAR(50) NOT NULL, -- CASH, BANK, ELECTRONIC_WALLET, SAVINGS
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) NOT NULL DEFAULT 'VND',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    CONSTRAINT fk_wallets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. categories Table
CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NULL, -- NULL means system-defined default categories
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL, -- INCOME, EXPENSE
    icon_key VARCHAR(100) NULL,
    color_code VARCHAR(10) NULL,
    parent_id BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_categories_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. transactions Table
CREATE TABLE transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    wallet_id BIGINT NOT NULL,
    to_wallet_id BIGINT NULL, -- Used only for TRANSFER type
    category_id BIGINT NULL, -- Can be null for transfers
    amount DECIMAL(15, 2) NOT NULL,
    transaction_type VARCHAR(20) NOT NULL, -- INCOME, EXPENSE, TRANSFER
    note TEXT NULL,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_transactions_wallet FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
    CONSTRAINT fk_transactions_to_wallet FOREIGN KEY (to_wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
    CONSTRAINT fk_transactions_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. budgets Table
CREATE TABLE budgets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    month INT NOT NULL, -- 1 to 12
    year INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_budgets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_budgets_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    CONSTRAINT uq_user_category_month_year UNIQUE (user_id, category_id, month, year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Insert Default System Categories (user_id IS NULL)
-- Expense categories
INSERT INTO categories (name, type, icon_key, color_code) VALUES 
('Ăn uống', 'EXPENSE', 'utensils', '#FF5733'),
('Di chuyển', 'EXPENSE', 'car', '#3357FF'),
('Mua sắm', 'EXPENSE', 'shopping-bag', '#F333FF'),
('Nhà cửa & Hóa đơn', 'EXPENSE', 'home', '#33FF57'),
('Giải trí', 'EXPENSE', 'film', '#FFC733'),
('Sức khỏe', 'EXPENSE', 'heart-pulse', '#33FFF0'),
('Giáo dục', 'EXPENSE', 'graduation-cap', '#A833FF'),
('Khác', 'EXPENSE', 'archive', '#8D8D8D');

-- Income categories
INSERT INTO categories (name, type, icon_key, color_code) VALUES 
('Lương', 'INCOME', 'banknote', '#2ECC71'),
('Thưởng', 'INCOME', 'award', '#F1C40F'),
('Đầu tư', 'INCOME', 'trending-up', '#3498DB'),
('Quà tặng', 'INCOME', 'gift', '#E74C3C'),
('Khoản thu khác', 'INCOME', 'coins', '#9B59B6');