<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Ensure request method is GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get database connection
global $mysqli;
require_once './../../../conn.php';

// Parse query parameters
$status = $_GET['status'] ?? null;
$search = $_GET['search'] ?? null;
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;
$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;

// Validate limit
if ($limit <= 0 || $limit > 100) {
    $limit = 50; // Default to 50 if invalid
}

// Build query
$query = "
    SELECT e.*, 
           u.username as creator_name
    FROM experiments e
    JOIN users u ON e.created_by = u.user_id
    WHERE 1=1
";

$params = [];
$types = "";

// Add status filter if provided
if ($status !== null) {
    $query .= " AND e.status = ?";
    $params[] = $status;
    $types .= "s";
}

// Add search filter if provided
if ($search !== null) {
    $query .= " AND (e.title LIKE ? OR e.description LIKE ?)";
    $searchParam = "%$search%";
    $params[] = $searchParam;
    $params[] = $searchParam;
    $types .= "ss";
}

// Add ordering and pagination
$query .= " ORDER BY e.created_at DESC LIMIT ? OFFSET ?";
$params[] = $limit;
$params[] = $offset;
$types .= "ii";

// Prepare and execute statement
$stmt = $mysqli->prepare($query);

if ($types && !empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();
$experiments = [];

while ($row = $result->fetch_assoc()) {
    // Format dates for consistent output
    if ($row['start_date']) {
        $row['start_date'] = date('Y-m-d', strtotime($row['start_date']));
    }
    if ($row['end_date']) {
        $row['end_date'] = date('Y-m-d', strtotime($row['end_date']));
    }

    $experiments[] = $row;
}

$stmt->close();

// Get total count for pagination
$countQuery = "
    SELECT COUNT(*) as total 
    FROM experiments e
    WHERE 1=1
";

$countParams = [];
$countTypes = "";

// Add the same filters for consistency
if ($status !== null) {
    $countQuery .= " AND e.status = ?";
    $countParams[] = $status;
    $countTypes .= "s";
}

if ($search !== null) {
    $countQuery .= " AND (e.title LIKE ? OR e.description LIKE ?)";
    $searchParam = "%$search%";
    $countParams[] = $searchParam;
    $countParams[] = $searchParam;
    $countTypes .= "ss";
}

$countStmt = $mysqli->prepare($countQuery);

if ($countTypes && !empty($countParams)) {
    $countStmt->bind_param($countTypes, ...$countParams);
}

$countStmt->execute();
$countResult = $countStmt->get_result();
$totalCount = $countResult->fetch_assoc()['total'];
$countStmt->close();

// Return success with experiments data
http_response_code(200);
echo json_encode([
    'success' => true,
    'data' => [
        'experiments' => $experiments,
        'pagination' => [
            'total' => (int)$totalCount,
            'limit' => $limit,
            'offset' => $offset
        ]
    ]
]);