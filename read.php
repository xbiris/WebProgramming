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

$query = "SELECT id, director, title, year, userRating, yourRating FROM movies";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    $movies = array();
    while($row = $result->fetch_assoc()) {
        $movies[] = $row;
    }
    echo json_encode($movies);
} else {
    echo json_encode([]);
}
