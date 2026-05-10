ALTER TABLE password_reset_requests MODIFY status ENUM('pending', 'approved', 'rejected', 'used', 'cancelled') DEFAULT 'pending';
