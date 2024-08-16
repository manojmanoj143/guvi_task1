<?php
header('Content-Type: application/json'); // Ensure response is JSON

include 'db_config.php'; // Include your database configuration

header('Access-Control-Allow-Origin: *'); // Allow all origins or specify a particular origin
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$response = array(); // Initialize response array

// Connect to Redis
try {
    $redis = new Redis();
    $redis->connect('127.0.0.1', 6379); // Connect to Redis server
} catch (Exception $e) {
    $response = ['status' => 'error', 'message' => 'Redis connection failed.'];
    echo json_encode($response);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    // Check if email and password are provided
    if (empty($email) || empty($password)) {
        $response = ['status' => 'error', 'message' => 'Email and password are required.'];
    } else {
        // Prepare and execute SQL statement
        if ($stmt = $conn->prepare("SELECT id, password FROM users WHERE email = ?")) {
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $stmt->store_result();
            $stmt->bind_result($id, $hashed_password);

            if ($stmt->fetch() && password_verify($password, $hashed_password)) {
                // Authentication successful
                $token = bin2hex(random_bytes(16)); // Generate a secure token
                $redis->set("session:$token", $id, 3600); // Store token in Redis for 1 hour

                $response = [
                    'status' => 'success',
                    'token' => $token,
                    'user_id' => $id
                ];
            } else {
                // Invalid credentials
                $response = ['status' => 'error', 'message' => 'Invalid email or password.'];
            }

            $stmt->close();
        } else {
            $response = ['status' => 'error', 'message' => 'Database query failed.'];
        }
    }

    $conn->close();
} else {
    $response = ['status' => 'error', 'message' => 'Invalid request method.'];
}

// Output JSON response
echo json_encode($response);
?>
