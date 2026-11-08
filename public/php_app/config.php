<?php
/**
 * config.php — PP-SDOMS cPanel configuration
 * ---------------------------------------------------------------
 * Edit the four database constants below to match the MySQL
 * database you create in cPanel (MySQL Databases / phpMyAdmin).
 * Everything else can stay as-is.
 */

define('DB_HOST', getenv('PP_DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('PP_DB_NAME') ?: 'moh_sdoms_db');
define('DB_USER', getenv('PP_DB_USER') ?: 'root');
define('DB_PASS', getenv('PP_DB_PASS') ?: '');

define('APP_NAME', 'PP-SDOMS');
define('APP_ORG', 'STATE DEPARTMENT FOR MEDICAL SERVICES');
define('APP_TZ', 'Africa/Nairobi');
define('APP_DEMO_PASSWORD', 'Password@2026');

date_default_timezone_set(APP_TZ);
