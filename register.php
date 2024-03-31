<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    exit;
}

include 'database.php';

$data = json_decode(file_get_contents("php://input"));

$username = $data->username;
$email = $data->email;
$password = password_hash($data->password, PASSWORD_DEFAULT); 
$role = $data->role;
$country = $data->country;
$city = $data->city;
$movie_genre = $data->genre;

$sql = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    http_response_code(400);
    echo json_encode(array('message' => 'Email already in use'));
} else {
    $sql = "INSERT INTO users (username, email, password, role, country, city, movie_genre) VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt= $conn->prepare($sql);
    $stmt->bind_param("sssssss", $username, $email, $password, $role, $country, $city, $movie_genre);

    if($stmt->execute()){
        echo json_encode(array('message' => 'User registered successfully'));
    } else {
        http_response_code(500);
        echo json_encode(array('message' => 'User registration failed due to an internal error'));
    }
}
?>
