//SEMI UPDATED CODE.JS FILE
const urlBase = 'https://cop4331-team-9.com'; 
const extension = 'php'; 

let userId = 0; 
let firstName = "";
let lastName = ""; 

function doLogin() {
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	
	document.getElementById("loginResult").innerHTML = "";
	
	if (login === "" || password === "") {
		document.getElementById("loginResult").innerHTML = "Please enter both username and password";
		return;
	}
	
	let tmp = {login:login,password:password};
	let jsonPayload = JSON.stringify(tmp);
	
	let url = 'LAMPAPI/Login.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				
				if (jsonObject.error === "" || jsonObject.error === null) {
					userId = jsonObject.id;
					firstName = jsonObject.firstName || "";
					lastName = jsonObject.lastName || "";
					
					localStorage.setItem("userId", jsonObject.id);
					localStorage.setItem("firstName", jsonObject.firstName || "");
					localStorage.setItem("lastName", jsonObject.lastName || "");
					
					saveCookie();
					
					window.location.href = "contact.html";
				} else {
					document.getElementById("loginResult").innerHTML = jsonObject.error;
				}
			}
			else if (this.readyState == 4) {
				document.getElementById("loginResult").innerHTML = "Server error: " + this.status;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err) {
		document.getElementById("loginResult").innerHTML = "Connection error: " + err.message;
	}
}

function doRegister() {
	let login = document.getElementById("registerLogin").value;
	let password = document.getElementById("registerPassword").value;
	
	document.getElementById("registerResult").innerHTML = "";
	
	if (login === "" || password === "") {
		document.getElementById("registerResult").innerHTML = "Please enter both username and password";
		return;
	}
	
	if (password.length < 6) {
		document.getElementById("registerResult").innerHTML = "Password must be at least 6 characters long";
		return;
	}
	
	let tmp = {login:login,password:password};
	let jsonPayload = JSON.stringify(tmp);
	
	let url = 'LAMPAPI/Register.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	try {
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				
				if (jsonObject.error === "" || jsonObject.error === null) {
					document.getElementById("registerResult").innerHTML = "Registration successful! You can now log in.";
					document.getElementById("registerResult").style.color = "green";
					
					document.getElementById("registerLogin").value = "";
					document.getElementById("registerPassword").value = "";
					
					setTimeout(() => {
						let loginTab = document.querySelector('[onclick*="login"]');
						if (loginTab) {
							loginTab.click();
						}
					}, 2000);
				} else {
					document.getElementById("registerResult").innerHTML = jsonObject.error;
					document.getElementById("registerResult").style.color = "red";
				}
			}
			else if (this.readyState == 4) {
				document.getElementById("registerResult").innerHTML = "Server error: " + this.status;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err) {
		document.getElementById("registerResult").innerHTML = "Connection error: " + err.message;
	}
}

function saveCookie() {
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function checkLogin() {
	let storedUserId = localStorage.getItem("userId");
	if (!storedUserId || storedUserId === "0") {
		window.location.href = "index.html";
	} else {
		userId = parseInt(storedUserId);
		firstName = localStorage.getItem("firstName") || "";
		lastName = localStorage.getItem("lastName") || "";
		
		// Display user name
		let userNameElement = document.getElementById("userName");
		if (userNameElement) {
			userNameElement.innerHTML = "Welcome, " + firstName + " " + lastName;
		}
		
		// Load contacts when page loads
		searchContact();
	}
}

function readCookie() {
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for(var i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if(tokens[0] == "firstName") {
            firstName = tokens[1];
        }
        else if(tokens[0] == "lastName") {
            lastName = tokens[1];
        }
        else if(tokens[0] == "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }
    
    if(userId < 0) {
        window.location.href = "index.html";
    } else {
        document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
        // Load contacts when page loads
        searchContact(); // This loads all contacts initially
    }
}

function doLogout() {
	userId = 0;
	firstName = "";
	lastName = "";
	
	// Clear localStorage
	localStorage.removeItem("userId");
	localStorage.removeItem("firstName");
	localStorage.removeItem("lastName");
	
	// Clear cookie
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	
	window.location.href = "index.html";
}

function openTab(evt, tabName) {
	let tabPanels = document.getElementsByClassName("tab-panel");
	for(let i = 0; i < tabPanels.length; i++) {
		tabPanels[i].classList.remove("active");
	}
	
	let tabButtons = document.getElementsByClassName("tab-button");
	for(let i = 0; i < tabButtons.length; i++) {
		tabButtons[i].classList.remove("active");
	}
	
	document.getElementById(tabName).classList.add("active");
	evt.currentTarget.classList.add("active");
	
	if (document.getElementById("loginResult")) {
		document.getElementById("loginResult").innerHTML = "";
	}
	if (document.getElementById("registerResult")) {
		document.getElementById("registerResult").innerHTML = "";
	}
}

// ENHANCED addContact function with validation for multi-field form
function addContact() {
	// Check if we're using the multi-field form or single field form
	let firstNameElement = document.getElementById("firstNameText");
	let lastNameElement = document.getElementById("lastNameText");
	
	if (firstNameElement && lastNameElement) {
		// Multi-field form version
		addContactMultiField();
	} else {
		// Single field form version
		addContactSingleField();
	}
}

function addContactMultiField() {
	let firstName = document.getElementById("firstNameText").value.trim();
	let lastName = document.getElementById("lastNameText").value.trim();
	let emailAddress = document.getElementById("emailText").value.trim();
	let phoneNumber = document.getElementById("phoneNumber").value.trim();
	
	let resultElement = document.getElementById("registerContact");
	if (resultElement) {
		resultElement.innerHTML = "";
	}

	// VALIDATION 1: Check if both first and last name are provided
	if(!firstName || !lastName) {
		if (resultElement) {
			resultElement.innerHTML = "Please enter both a First and Last name!";
			resultElement.style.color = "red";
		}
		return;
	}

	// Check if user is logged in
	if (!userId || userId === 0) {
		if (resultElement) {
			resultElement.innerHTML = "Error: User not logged in properly!";
			resultElement.style.color = "red";
		}
		return;
	}

	// VALIDATION 2: Check if contact already exists
	checkIfContactExists(firstName, lastName, function(exists) {
		if (exists) {
			if (resultElement) {
				resultElement.innerHTML = "Contact with name '" + firstName + " " + lastName + "' already exists!";
				resultElement.style.color = "red";
			}
			return;
		}
		
		// If contact doesn't exist, proceed with creation
		createContactRecord(firstName, lastName, emailAddress, phoneNumber);
	});
}

function addContactSingleField() {
    let newContact = document.getElementById("contactText").value;
    let resultElement = document.getElementById("contactAddResult");
    
    if (resultElement) {
    	resultElement.innerHTML = "";
    }

    // Simple validation - you might want to parse this differently
    let parts = newContact.split(' ');
    if (parts.length < 2) {
        if (resultElement) {
        	resultElement.innerHTML = "Please enter first and last name";
        }
        return;
    }

    let firstName = parts[0];
    let lastName = parts.slice(1).join(' '); // Everything after first word

    // Check if contact already exists
    checkIfContactExists(firstName, lastName, function(exists) {
        if (exists) {
            if (resultElement) {
                resultElement.innerHTML = "Contact '" + firstName + " " + lastName + "' already exists!";
                resultElement.style.color = "red";
            }
            return;
        }
        
        // If contact doesn't exist, create it
        let tmp = {
            firstName: firstName,
            lastName: lastName,
            phone: "",
            email: "",
            userID: userId
        };
        let jsonPayload = JSON.stringify(tmp);

        let url = 'LAMPAPI/CreateContact.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try {
            xhr.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    if (resultElement) {
                    	resultElement.innerHTML = "Contact has been added";
                    	resultElement.style.color = "green";
                    }
                    document.getElementById("contactText").value = "";
                    searchContact(); // Refresh the list
                }
            };
            xhr.send(jsonPayload);
        }
        catch(err) {
            if (resultElement) {
            	resultElement.innerHTML = err.message;
            }
        }
    });
}

function checkIfContactExists(firstName, lastName, callback) {
	let tmp = {
		search: firstName + " " + lastName,
		userID: userId
	};

	let jsonPayload = JSON.stringify(tmp);
	let url = 'LAMPAPI/SearchContacts.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				
				if (jsonObject.error === "" || jsonObject.error === null) {
					let results = jsonObject.results || [];
					
					// Check if any result has exact match for first and last name
					let exactMatch = results.some(contact => 
						contact.firstName && contact.lastName &&
						contact.firstName.toLowerCase() === firstName.toLowerCase() && 
						contact.lastName.toLowerCase() === lastName.toLowerCase()
					);
					
					callback(exactMatch);
				} else {
					// If search fails, assume contact doesn't exist and proceed
					console.error("Error checking for existing contact:", jsonObject.error);
					callback(false);
				}
			} else if (this.readyState == 4) {
				// If search fails, assume contact doesn't exist and proceed
				console.error("HTTP error checking for existing contact:", this.status);
				callback(false);
			}
		};
		xhr.send(jsonPayload);
	} catch(err) {
		// If search fails, assume contact doesn't exist and proceed
		console.error("Exception checking for existing contact:", err.message);
		callback(false);
	}
}

function createContactRecord(firstName, lastName, emailAddress, phoneNumber) {
	let tmp = {
		firstName: firstName,
		lastName: lastName, 
		email: emailAddress,
		phone: phoneNumber,
		userID: userId
	};

	let jsonPayload = JSON.stringify(tmp);
	let url = 'LAMPAPI/CreateContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	try {
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				
				if (jsonObject.error === "" || jsonObject.error === null) {
					let resultElement = document.getElementById("registerContact");
					if (resultElement) {
						resultElement.innerHTML = "Contact created successfully!";
						resultElement.style.color = "green";
					}
					
					// Clear the input fields
					document.getElementById("firstNameText").value = "";
					document.getElementById("lastNameText").value = "";
					document.getElementById("emailText").value = "";
					document.getElementById("phoneNumber").value = "";
					
					// Refresh the contact list
					searchContact();
				} else {
					let resultElement = document.getElementById("registerContact");
					if (resultElement) {
						resultElement.innerHTML = "Error: " + jsonObject.error;
						resultElement.style.color = "red";
					}
				}
			}
			else if (this.readyState == 4) {
				let resultElement = document.getElementById("registerContact");
				if (resultElement) {
					resultElement.innerHTML = "Server error: " + this.status;
					resultElement.style.color = "red";
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err) {
		let resultElement = document.getElementById("registerContact");
		if (resultElement) {
			resultElement.innerHTML = "Connection error: " + err.message;
			resultElement.style.color = "red";
		}
	}
}

function searchContact() {
    let searchTerm = "";
    let searchElement = document.getElementById("searchText");
    if (searchElement) {
        searchTerm = searchElement.value.trim();
    }
    
    let searchResultElement = document.getElementById("contactSearchResult");
    if (searchResultElement) {
        searchResultElement.innerHTML = "";
    }
    
    // Check if we have the new table structure or old contactList
    let contactList = document.getElementById("contactList");
    let tableBody = document.getElementById("contactsTableBody");
    
    if (contactList) {
        contactList.innerHTML = "";
    }

    let tmp = {
        search: searchTerm,
        userID: userId
    };
    let jsonPayload = JSON.stringify(tmp);

    let url = 'LAMPAPI/SearchContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                if (searchResultElement) {
                    searchResultElement.innerHTML = "Contacts retrieved";
                    searchResultElement.style.color = "green";
                }
                
                let jsonObject = JSON.parse(xhr.responseText);

                if (tableBody) {
                    // New table structure
                    populateContactsTable(jsonObject.results || []);
                } else if (contactList) {
                    // Old contactList structure
                    let text = "<table><tr><th>First Name</th><th>Last Name</th><th>Phone</th><th>Email</th></tr>";
                    
                    if (jsonObject.results && jsonObject.results.length > 0) {
                        for(let i = 0; i < jsonObject.results.length; i++) {
                            text += "<tr>";
                            text += "<td>" + (jsonObject.results[i].firstName || '') + "</td>";
                            text += "<td>" + (jsonObject.results[i].lastName || '') + "</td>";
                            text += "<td>" + (jsonObject.results[i].phone || jsonObject.results[i].Phone || '') + "</td>";
                            text += "<td>" + (jsonObject.results[i].email || jsonObject.results[i].Email || '') + "</td>";
                            text += "</tr>";
                        }
                    } else {
                        text += "<tr><td colspan='4'>No contacts found</td></tr>";
                    }
                    text += "</table>";

                    contactList.innerHTML = text;
                }
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err) {
        if (searchResultElement) {
            searchResultElement.innerHTML = err.message;
            searchResultElement.style.color = "red";
        }
    }
}

function populateContactsTable(contacts) {
    let tableBody = document.getElementById("contactsTableBody");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (!contacts || contacts.length === 0) {
        tableBody.innerHTML =
            '<tr><td colspan="5" style="text-align:center;font-style:italic;color:#666;">No contacts found</td></tr>';
        return;
    }

    contacts.forEach(contact => {
        // Use exactly what PHP returns
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${contact.FirstName || ''}</td>
            <td>${contact.LastName || ''}</td>
            <td>${contact.Email || ''}</td>
            <td>${contact.Phone || ''}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editContact(${contact.ID})">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteContact(${contact.ID})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}


function editContact(contactId) {
	// Placeholder for edit functionality
	alert("Edit contact with ID: " + contactId + "\nThis feature needs to be implemented.");
}

function deleteContact(contactId) {
	if (!confirm("Are you sure you want to delete this contact?")) {
		return;
	}
	
	let tmp = {
		id: contactId
	};
	
	let jsonPayload = JSON.stringify(tmp);
	let url = 'LAMPAPI/DeleteContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	try {
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				
				if (jsonObject.error === "" || jsonObject.error === null) {
					searchContact(); // Refresh the contacts list
				} else {
					alert("Error deleting contact: " + jsonObject.error);
				}
			}
			else if (this.readyState == 4) {
				alert("Server error: " + this.status);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err) {
		alert("Connection error: " + err.message);
	}
}
