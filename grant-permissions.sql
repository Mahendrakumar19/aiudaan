-- Run this SQL in phpMyAdmin to grant permissions to u739130981_user
-- Go to phpMyAdmin → SQL tab → Copy & Paste this → Click "Go"

GRANT ALL PRIVILEGES ON `u739130981_aiudaanbootcamp`.* TO 'u739130981_user'@'%' WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON `u739130981_aiudaanbootcamp`.* TO 'u739130981_user'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;

-- Verify permissions
SHOW GRANTS FOR 'u739130981_user'@'%';
