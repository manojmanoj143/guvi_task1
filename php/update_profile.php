<?php
require_once __DIR__ . '/../vendor/autoload.php'; // MongoDB PHP library

header('Access-Control-Allow-Origin: *'); // Allow all origins or specify a particular origin
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Connect to Redis server
try {
    $redis = new Redis();
    $redis->connect('127.0.0.1', 6379); // Connect to Redis server
} catch (Exception $e) {
    $response = ['success' => false, 'message' => 'Redis connection failed.'];
    echo json_encode($response);
    exit();
}

// Get the token and fetch the user ID from Redis server
$token = $_POST['token'] ?? '';
$id = $redis->get("session:$token");

$response = array();
if ($id) {
    $dob = $_POST['dob'] ?? '';
    $fathername = $_POST['fathername'] ?? '';
    $mothername = $_POST['mothername'] ?? '';
    $contact = $_POST['contact'] ?? '';

    // Retrieve and update profile data in Redis server
    $profileData = json_decode($redis->get("user:$id:profile"), true);
    if ($profileData === null) {
        $profileData = [];
    }
    $profileData['dob'] = $dob;
    $profileData['fathername'] = $fathername;
    $profileData['mothername'] = $mothername;
    $profileData['contact'] = $contact;
    
    $redis->set("user:$id:profile", json_encode($profileData));

    // MongoDB connection
    $client = new MongoDB\Client("mongodb://localhost:27017");
    $collection = $client->guvi->profile;

    // Check if profile exists in MongoDB
    $profileDataMongo = $collection->findOne(['user_id' => $id]);
    if ($profileDataMongo) {
        // Update existing profile in MongoDB
        $collection->updateOne(
            ['user_id' => $id],
            ['$set' => [
                'dob' => $dob,
                'fathername' => $fathername,
                'mothername' => $mothername,
                'contact' => $contact,
            ]]
        );
    } else {
        // Insert new profile into MongoDB
        $collection->insertOne([
            'user_id' => $id,
            'dob' => $dob,
            'fathername' => $fathername,
            'mothername' => $mothername,
            'contact' => $contact,
        ]);
    }

    $response['success'] = true;
    $response['message'] = 'Profile updated successfully.';
} else {
    $response['success'] = false;
    $response['message'] = "Invalid or expired token.";
}

echo json_encode($response);
?>
