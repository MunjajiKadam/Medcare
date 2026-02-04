-- Add theme preference column to users table
USE medcare_db;

ALTER TABLE users 
ADD COLUMN theme_preference ENUM('light', 'dark', 'auto') DEFAULT 'light' 
AFTER profile_image;

-- Update existing users to have default theme
UPDATE users SET theme_preference = 'light' WHERE theme_preference IS NULL;
