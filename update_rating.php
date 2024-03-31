<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: PUT, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    exit;
}

include_once 'database.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->id) && isset($data->yourRating)) {
    $sql = "UPDATE movies SET yourRating = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    
    if ($stmt) {
        $stmt->bind_param("si", $data->yourRating, $data->id);
        
        if ($stmt->execute()) {
            echo json_encode(array("message" => "Rating updated successfully."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to update rating."));
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
