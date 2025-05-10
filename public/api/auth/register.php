<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Ensure request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get database connection
global $mysqli;
require_once './../../../conn.php';

// Get and sanitize input data
$data = json_decode(file_get_contents('php://input'), true);

// Check if the required fields are present
if (!isset($data['username']) || !isset($data['email']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

$username = trim($data['username']);
$email = trim($data['email']);
$password = $data['password'];
$role_id = 3; // Default viewer role

// Validate username (at least 2 characters)
if (strlen($username) < 2) {
    http_response_code(400);
    echo json_encode(['error' => 'Username must be at least 2 characters long']);
    exit;
}

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address']);
    exit;
}

// Validate password (at least 5 characters)
if (strlen($password) < 5) {
    http_response_code(400);
    echo json_encode(['error' => 'Password must be at least 5 characters long']);
    exit;
}

// Check if email already exists
$stmt = $mysqli->prepare("SELECT user_id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    http_response_code(409); // Conflict
    echo json_encode(['error' => 'Email address already registered']);
    exit;
}
$stmt->close();

// Check if username already exists
$stmt = $mysqli->prepare("SELECT user_id FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    http_response_code(409); // Conflict
    echo json_encode(['error' => 'Username already taken']);
    exit;
}
$stmt->close();

// Hash the password
$password_hash = password_hash($password, PASSWORD_DEFAULT);

// Insert new user
$stmt = $mysqli->prepare("INSERT INTO users (username, email, password_hash, role_id, is_active) VALUES (?, ?, ?, ?, 1)");
$stmt->bind_param("sssi", $username, $email, $password_hash, $role_id);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to register user: ' . $mysqli->error]);
    exit;
}

$user_id = $mysqli->insert_id;
$stmt->close();

// Create session token
$token = bin2hex(random_bytes(32)); // 64 characters
$expires_at = date('Y-m-d H:i:s', strtotime('+7 days'));
$ip_address = $_SERVER['REMOTE_ADDR'] ?? null;
$user_agent = $_SERVER['HTTP_USER_AGENT'] ?? null;

// Insert session
$stmt = $mysqli->prepare("INSERT INTO user_sessions (user_id, token, expires_at, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("issss", $user_id, $token, $expires_at, $ip_address, $user_agent);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to create session: ' . $mysqli->error]);
    exit;
}

$stmt->close();

// Set session cookie
$secure = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on'; // Set secure flag if using HTTPS
$http_only = true; // Prevent JavaScript access to the cookie (recommended for security)
$same_site = 'Lax'; // Helps prevent CSRF, use 'None' if you need cross-origin cookies (requires secure=true)
$domain = ''; // Leave empty to use current domain, or specify for subdomains

// Calculate expiration timestamp
$cookie_expiry = time() + (7 * 24 * 60 * 60); // 7 days in seconds

// Set the cookie
setcookie(
    'session_token',       // Cookie name
    $token,                // Cookie value
    [
        'expires' => $cookie_expiry,
        'path' => '/',     // Available on all paths
        'domain' => $domain,
        'secure' => $secure,
        'httponly' => $http_only,
        'samesite' => $same_site
    ]
);

// Set a separate cookie with user info (non-http-only so JavaScript can read it)
setcookie(
    'user_info',
    json_encode([
        'user_id' => $user_id,
        'username' => $username,
        'role_id' => $role_id
    ]),
    [
        'expires' => $cookie_expiry,
        'path' => '/',
        'domain' => $domain,
        'secure' => $secure,
        'httponly' => false, // JavaScript can read this
        'samesite' => $same_site
    ]
);

// Return success with session token
http_response_code(201); // Created
echo json_encode([
    'success' => true,
    'message' => 'User registered successfully',
    'data' => [
        'user_id' => $user_id,
        'username' => $username,
        'token' => $token,
        'expires_at' => $expires_at
    ]
]);