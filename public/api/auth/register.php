<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get database connection
global $mysqli;
require_once './../../../conn.php';

// Get token from cookie first
$token = $_COOKIE['session_token'] ?? null;

// If not in cookie, try Authorization header
if (!$token) {
    $headers = getallheaders();
    $auth_header = $headers['Authorization'] ?? '';

    // Check for Bearer token format
    if (preg_match('/Bearer\s+(.*)$/i', $auth_header, $matches)) {
        $token = $matches[1];
    }
}

// If still no token, check if it's in the request data
if (!$token && isset($_POST['token'])) {
    $token = $_POST['token'];
} else if (!$token && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (isset($data['token'])) {
        $token = $data['token'];
    }
}

// If no token found anywhere, still consider it a successful logout
if (!$token) {
    // Still clear any cookies
    cookie_conf();
    echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
    exit;
}

// Invalidate the session in the database
$stmt = $mysqli->prepare("UPDATE user_sessions SET is_valid = 0 WHERE token = ?");
$stmt->bind_param("s", $token);
$stmt->execute();
$affected_rows = $stmt->affected_rows;
$stmt->close();

// Clear cookies regardless of whether token was found in the database
/**
 * @return void
 */
function cookie_conf(): void
{
    setcookie('session_token', '', [
        'expires' => time() - 3600,
        'path' => '/',
        'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on',
        'httponly' => true,
        'samesite' => 'Lax'
    ]);

    setcookie('user_info', '', [
        'expires' => time() - 3600,
        'path' => '/',
        'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on',
        'httponly' => false,
        'samesite' => 'Lax'
    ]);

// Return success
    http_response_code(200);
}


cookie_conf();
echo json_encode([
    'success' => true,
    'message' => 'Logged out successfully',
    'data' => [
        'session_invalidated' => $affected_rows > 0
    ]
]);