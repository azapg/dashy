<?php

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Método inválido! Esta ruta solo permite peticiones POST.']);
    exit;
}


$username = isset($_POST['username']) ? trim($_POST['username']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

$errors = [];

if (empty($username)) {
    $errors[] = "Username is required.";
} elseif (strlen($username) < 2) {
    $errors[] = "Username must be at least 2 characters long.";
} elseif (strlen($username) > 50) {
    $errors[] = "Username cannot exceed 50 characters.";
}

if (empty($email)) {
    $errors[] = "Email is required.";
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Invalid email format.";
} elseif (strlen($email) > 100) {
    $errors[] = "Email cannot exceed 100 characters.";
}

if (empty($password)) {
    $errors[] = "Password is required.";
} elseif (strlen($password) < 5) {
    $errors[] = "Password must be at least 5 characters long.";
}

if (!empty($errors)) {
    http_response_code(400); // Bad Request
    echo json_encode(['status' => 'error', 'message' => 'Validation failed.', 'errors' => $errors]);
    exit;
}

// ID de los viewers
$role_id = 3;

require_once './../../conn.php';

if ($mysqli->connect_error) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed (checked after include). Please try again later.']);
    exit;
}


$password_hash = password_hash($password, PASSWORD_DEFAULT);
if ($password_hash === false) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to hash password.']);
    $mysqli->close();
    exit;
}

$stmt_check = $mysqli->prepare("SELECT user_id FROM users WHERE username = ? OR email = ?");
if ($stmt_check === false) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to prepare statement (check existing user). Error: ' . $mysqli->error]);
    $mysqli->close();
    exit;
}
$stmt_check->bind_param("ss", $username, $email);
$stmt_check->execute();
$stmt_check->store_result();

if ($stmt_check->num_rows > 0) {
    http_response_code(409); // Conflict
    echo json_encode(['status' => 'error', 'message' => 'Username or email already exists.']);
    $stmt_check->close();
    $mysqli->close();
    exit;
}
$stmt_check->close();


$stmt_insert = $mysqli->prepare("INSERT INTO users (username, email, password_hash, role_id) VALUES (?, ?, ?, ?)");
if ($stmt_insert === false) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to prepare statement (insert user). Error: ' . $mysqli->error]);
    $mysqli->close();
    exit;
}

$stmt_insert->bind_param("sssi", $username, $email, $password_hash, $role_id);

if ($stmt_insert->execute()) {
    $new_user_id = $stmt_insert->insert_id;
    http_response_code(201); // Created
    echo json_encode([
        'status' => 'success',
        'message' => 'User created successfully with default role.',
        'user_id' => $new_user_id
    ]);
} else {
    http_response_code(500);
    if ($mysqli->errno == 1452) {
         echo json_encode(['status' => 'error', 'message' => 'Default Role ID (3) is invalid or does not exist in the roles table.']);
    } else {
         echo json_encode(['status' => 'error', 'message' => 'Failed to create user. Error: ' . $stmt_insert->error]);
    }
}

$stmt_insert->close();
$mysqli->close();
?>
