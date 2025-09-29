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
  $firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	
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
			
			// Insert new user with firstName and lastName, plain text password
			$stmt = $conn->prepare("INSERT into Users (firstName,lastName,login,password) VALUES(?,?,?,?)");
  		$stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
			
			if( !$stmt->execute() )
			{
				returnWithError("Failed to create user: " . $stmt->error);
			}
      else{
        returnWithError("");
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
