<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    exit;
}

include_once 'database.php';

$data = json_decode(file_get_contents("php://input"));
$dataString = print_r($data, true);
error_log("Received data: " . $dataString);


if (!empty($data->director) && !empty($data->title) && isset($data->year) && isset($data->userRating)) {
    $sql = "INSERT INTO movies (director, title, year, userRating, yourRating) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bind_param("ssiis", $data->director, $data->title, $data->year, $data->userRating, $data->yourRating);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(array("message" => "Movie added successfully."));
        } else {
            http_response_code(503); 
            echo json_encode(array("message" => "Unable to add movie."));
        }
    } else {
        http_response_code(400); 
        echo json_encode(array("message" => "Unable to prepare statement."));
    }
} else {
    http_response_code(400); 
    echo json_encode(array("message" => "Incomplete data."));
}
?>
