<?php

	$inData = getRequestInfo();
	
	// Add null checks to prevent warnings
	if ($inData === null) {
		returnWithError("No data received");
		exit();
	}
	
	if (!isset($inData["login"]) || !isset($inData["password"])) {
		returnWithError("Missing login or password");
		exit();
	}
	
	$login = $inData["login"];
	$password = $inData["password"];
	
	// Basic validation
	if (empty($login) || empty($password)) {
		returnWithError("Login and password cannot be empty");
		exit();
	}

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		// First check if username already exists
		$stmt = $conn->prepare("SELECT ID FROM Users WHERE Login=?");
		$stmt->bind_param("s", $login);
		$stmt->execute();
		$result = $stmt->get_result();

		if( $result->fetch_assoc() )
		{
			returnWithError("Username already exists");
		}
		else
		{
			$stmt->close(); // Close the SELECT statement first
			
			// Insert new user with empty firstName and lastName, plain text password
			$stmt = $conn->prepare("INSERT INTO Users (firstName, lastName, Login, Password) VALUES ('', '', ?, ?)");
			$stmt->bind_param("ss", $login, $password); // Store password as plain text
			
			if( $stmt->execute() )
			{
				$newUserId = $conn->insert_id;
				returnWithInfo( "", "", $newUserId );
			}
			else
			{
				returnWithError("Failed to create user: " . $stmt->error);
			}
		}

		$stmt->close();
		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
