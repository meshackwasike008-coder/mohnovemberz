<?php
// db.php - Database Connection for PP-SDOMS (Standalone PHP / cPanel)
$host = 'localhost';
$dbname = 'moh_sdoms_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    // Fallback error message if database is not yet created
    $db_error = "Database Connection Error: " . $e->getMessage() . ". Please import schema.sql via phpMyAdmin.";
}
?>
