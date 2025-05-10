<?php
// This file can be included in other PHP endpoints to verify the user's session
// It returns the user's information if the session is valid, or ends the script with an error response if it's not

function verify_session($mysqli, $require_role_ids = null) {
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

    // If still no token, check if it's in the request body
    if (!$token && isset($_POST['token'])) {
        $token = $_POST['token'];
    } else if (!$token && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        if (isset($data['token'])) {
            $token = $data['token'];
        }
    }

    // If no token found anywhere, return error
    if (!$token) {
        http_response_code(401);
        echo json_encode(['error' => 'Authentication required']);
        exit;
    }

    // Verify token in database
    $stmt = $mysqli->prepare("
        SELECT s.user_id, s.expires_at, s.is_valid, 
               u.username, u.email, u.role_id, u.is_active
        FROM user_sessions s
        JOIN users u ON s.user_id = u.user_id
        WHERE s.token = ? AND s.is_valid = 1
    ");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid or expired session']);
        exit;
    }

    $session = $result->fetch_assoc();
    $stmt->close();

    // Check if session has expired
    if (strtotime($session['expires_at']) < time()) {
        // Invalidate the session
        $stmt = $mysqli->prepare("UPDATE user_sessions SET is_valid = 0 WHERE token = ?");
        $stmt->bind_param("s", $token);
        $stmt->execute();
        $stmt->close();

        http_response_code(401);
        echo json_encode(['error' => 'Session expired']);
        exit;
    }

    // Check if user account is active
    if (!$session['is_active']) {
        http_response_code(403);
        echo json_encode(['error' => 'Account is inactive']);
        exit;
    }

    // Check role if required
    if ($require_role_ids !== null) {
        // Convert to array if single role ID
        if (!is_array($require_role_ids)) {
            $require_role_ids = [$require_role_ids];
        }

        if (!in_array($session['role_id'], $require_role_ids)) {
            http_response_code(403);
            echo json_encode(['error' => 'Insufficient permissions']);
            exit;
        }
    }

    // Update last activity
    $stmt = $mysqli->prepare("UPDATE user_sessions SET last_activity = CURRENT_TIMESTAMP WHERE token = ?");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $stmt->close();

    // Return user data
    return [
        'user_id' => $session['user_id'],
        'username' => $session['username'],
        'email' => $session['email'],
        'role_id' => $session['role_id']
    ];
}

// Example usage for standalone verification endpoint
if (basename($_SERVER['SCRIPT_FILENAME']) === basename(__FILE__)) {
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
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

    $user = verify_session($mysqli);

    // If we got here, session is valid
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $user
    ]);
}