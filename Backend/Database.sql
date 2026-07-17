-- KYC Status
CREATE TYPE kyc_enum AS ENUM ('unverified', 'verified');

-- Account Types
CREATE TYPE account_type_enum AS ENUM ('savings', 'checking', 'credit_card', 'loan', 'investment');

-- Transaction Types
CREATE TYPE txn_type_enum AS ENUM ('debit', 'credit');

-- Bill Status
CREATE TYPE bill_status_enum AS ENUM ('upcoming', 'paid', 'overdue');

-- Alert Types
CREATE TYPE alert_type_enum AS ENUM ('low_balance', 'bill_due', 'budget_exceeded');

-- Creating  Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    kyc_status kyc_enum DEFAULT 'unverified',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creating Accounts Table
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    bank_name VARCHAR(100) NOT NULL,
    account_type account_type_enum NOT NULL,
    masked_account VARCHAR(50),
    currency CHAR(3) DEFAULT 'INR',
    balance NUMERIC(14,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creating Transactions Table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    account_id INT REFERENCES accounts(id) ON DELETE CASCADE,
    description VARCHAR(255),
    category VARCHAR(100),
    amount NUMERIC(14,2) NOT NULL,
    currency CHAR(3) DEFAULT 'INR',
    txn_type txn_type_enum NOT NULL,
    merchant VARCHAR(150),
    txn_date TIMESTAMP NOT NULL,
    posted_date TIMESTAMP
);

-- Creating Budgets Table
CREATE TABLE budgets (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    month INT NOT NULL,
    year INT NOT NULL,
    category VARCHAR(100),
    limit_amount NUMERIC(14,2),
    spent_amount NUMERIC(14,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creating Bills table
CREATE TABLE bills (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    biller_name VARCHAR(100),
    due_date DATE NOT NULL,
    amount_due NUMERIC(14,2) NOT NULL,
    status bill_status_enum DEFAULT 'upcoming',
    auto_pay BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creating Rewards Table
CREATE TABLE rewards (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    program_name VARCHAR(100),
    points_balance INT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creating Alerts Table
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    type alert_type_enum NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creating AdminLogs Table
CREATE TABLE adminlogs (
    id SERIAL PRIMARY KEY,
    admin_id INT REFERENCES users(id) ON DELETE SET NULL,
    action TEXT,
    target_type VARCHAR(50),
    target_id INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


/*SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;*/