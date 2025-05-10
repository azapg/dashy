<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
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

// Include session verification
require_once './../auth/verify_session.php';

// Verify the user is authenticated AND has role_id = 1 (administrator)
$user = verify_session($mysqli, 1); // This exits with error if not authenticated with proper role

// Get and validate input data
$data = json_decode(file_get_contents('php://input'), true);

// Required fields validation
$required_fields = ['title'];
$missing_fields = [];

foreach ($required_fields as $field) {
    if (!isset($data[$field]) || trim($data[$field]) === '') {
        $missing_fields[] = $field;
    }
}

if (!empty($missing_fields)) {
    http_response_code(400);
    echo json_encode([
        'error' => 'Missing required fields',
        'missing_fields' => $missing_fields
    ]);
    exit;
}

// Sanitize and prepare data
$title = trim($data['title']);
$description = isset($data['description']) ? trim($data['description']) : null;
$icon_name = isset($data['icon_name']) ? trim($data['icon_name']) : null;
$status = isset($data['status']) ? trim($data['status']) : 'active';
$start_date = !empty($data['start_date']) ? $data['start_date'] : null;
$end_date = !empty($data['end_date']) ? $data['end_date'] : null;
$created_by = $user['user_id']; // Get from authenticated user

// Validate title length
if (strlen($title) > 255) {
    http_response_code(400);
    echo json_encode(['error' => 'Title must be 255 characters or less']);
    exit;
}

// Validate status
$valid_statuses = ['active', 'completed', 'archived'];
if (!in_array($status, $valid_statuses)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid status value']);
    exit;
}

// Validate icon_name length if provided
if ($icon_name !== null && strlen($icon_name) > 100) {
    http_response_code(400);
    echo json_encode(['error' => 'Icon name must be 100 characters or less']);
    exit;
}

// Validate dates if provided
if ($start_date !== null) {
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $start_date)) {
        http_response_code(400);
        echo json_encode(['error' => 'Start date must be in YYYY-MM-DD format']);
        exit;
    }
}

if ($end_date !== null) {
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $end_date)) {
        http_response_code(400);
        echo json_encode(['error' => 'End date must be in YYYY-MM-DD format']);
        exit;
    }

    // Ensure end date is not before start date
    if ($start_date !== null && strtotime($end_date) < strtotime($start_date)) {
        http_response_code(400);
        echo json_encode(['error' => 'End date cannot be before start date']);
        exit;
    }
}

// Insert into database
$stmt = $mysqli->prepare("
    INSERT INTO experiments (
        title, description, icon_name, status, start_date, end_date, created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "ssssssi",
    $title,
    $description,
    $icon_name,
    $status,
    $start_date,
    $end_date,
    $created_by
);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to create experiment: ' . $mysqli->error]);
    exit;
}

$experiment_id = $mysqli->insert_id;
$stmt->close();

// Return success with experiment data
http_response_code(201); // Created
echo json_encode([
    'success' => true,
    'message' => 'Experiment created successfully',
    'data' => [
        'experiment_id' => $experiment_id,
        'title' => $title,
        'description' => $description,
        'icon_name' => $icon_name,
        'status' => $status,
        'start_date' => $start_date,
        'end_date' => $end_date,
        'created_by' => $created_by,
        'created_at' => date('Y-m-d H:i:s') // Current timestamp
    ]
]);