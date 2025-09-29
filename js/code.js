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
					document.getElementById("registerResult").style.color = "#880D1E";
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

function addContact() {
	let firstNameElement = document.getElementById("addFirstName");
	let lastNameElement = document.getElementById("addLastName");

	if (firstNameElement && lastNameElement) {
		addContactMultiField();
	} else {
		addContactSingleField();
	}
}

function addContactMultiField() {
	let firstName = document.getElementById("addFirstName").value.trim();
	let lastName = document.getElementById("addLastName").value.trim();
	let emailAddress = document.getElementById("addEmail").value.trim();
	let phoneNumber = document.getElementById("addPhone").value.trim();
	
	let resultElement = document.getElementById("registerContact");
	if (resultElement) {
		resultElement.innerHTML = "";
	}

	// VALIDATION 1: Check if both first and last name are provided
	if(!firstName || !lastName) {
		if (resultElement) {
			resultElement.innerHTML = "Please enter both a First and Last name!";
			resultElement.style.color = "#880D1E";
		}
		return;
	}

	// VALIDATION 2: Checks if either a email address or phone number is put in
	if(!emailAddress && !phoneNumber){
		if(resultElement) {
			resultElement.innerHTML = "Please enter either an Email address OR phone number or both!"
			resultElement.style.color = "#880D1E"; 
		}
		return; 
	}

	// Check if user is logged in
	if (!userId || userId === 0) {
		if (resultElement) {
			resultElement.innerHTML = "Error: User not logged in properly!";
			resultElement.style.color = "#880D1E";
		}
		return;
	}

	// VALIDATION 3: Check for duplicates (name, email, phone)
	checkIfContactExists(firstName, lastName, emailAddress, phoneNumber, function(duplicateInfo) {
		if (duplicateInfo.nameExists) {
			if (resultElement) {
				resultElement.innerHTML = "Contact with name '" + firstName + " " + lastName + "' already exists!";
				resultElement.style.color = "#880D1E";
			}
			return;
		}

		//VALIDATION 4: Checks to make sure that the phone number is a valid number of digits
		if(phoneNumber && phoneNumber.length !==10){
			if (resultElement) {
				resultElement.innerHTML = "Phone number invalid! MUST be exactly 10 digits!"; 
				resultElement.style.color = "#880D1E"; 
			}
			return;
		}

		//VALIDATION 5: Checks to ensure a valid email is going in 
		if(emailAddress){
			let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if(!emailPattern.test(emailAddress)) {
				if(resultElement) {
					resultElement.innerHTML = "Please enter a valid email address!"
					resultElement.style.color = "#880D1E";
				}
				return; 
			}
		} 
		
		if (duplicateInfo.emailExists && emailAddress) {
			if (resultElement) {
				resultElement.innerHTML = "A contact with email '" + emailAddress + "' already exists!";
				resultElement.style.color = "#880D1E";
			}
			return;
		}
		
		if (duplicateInfo.phoneExists && phoneNumber) {
			if (resultElement) {
				resultElement.innerHTML = "A contact with phone number '" + phoneNumber + "' already exists!";
				resultElement.style.color = "#880D1E";
			}
			return;
		}

		// If no duplicates found, proceed with creation
		createContactRecord(firstName, lastName, emailAddress, phoneNumber);
		closeAddModal();
		searchContact(); // refresh list
	});
}

function addContactSingleField() {
    let newContact = document.getElementById("contactText").value;
    let resultElement = document.getElementById("contactAddResult");
    
    if (resultElement) {
    	resultElement.innerHTML = "";
    }

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
                resultElement.style.color = "#880D1E";
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

function checkIfContactExists(firstName, lastName, email, phone, callback) {
	// Search for any existing contacts for this user
	let tmp = {
		search: "", // Empty search to get all contacts
		userId: userId
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
					
					// Check for exact name match
					let nameMatch = results.find(contact => 
						contact.FirstName && contact.LastName &&
						contact.FirstName.toLowerCase() === firstName.toLowerCase() && 
						contact.LastName.toLowerCase() === lastName.toLowerCase()
					);
					
					// Check for email match (if email is provided)
					let emailMatch = null;
					if (email && email.trim() !== "") {
						emailMatch = results.find(contact => 
							contact.Email && 
							contact.Email.toLowerCase() === email.toLowerCase()
						);
					}
					
					// Check for phone match (if phone is provided)
					let phoneMatch = null;
					if (phone && phone.trim() !== "") {
						phoneMatch = results.find(contact => 
							contact.Phone && 
							contact.Phone.replace(/\D/g, '') === phone.replace(/\D/g, '') // Remove non-digits for comparison
						);
					}
					
					// Return detailed match information
					callback({
						nameExists: !!nameMatch,
						emailExists: !!emailMatch,
						phoneExists: !!phoneMatch,
						nameMatch: nameMatch,
						emailMatch: emailMatch,
						phoneMatch: phoneMatch
					});
				} else {
					// If search fails, assume contact doesn't exist and proceed
					console.error("Error checking for existing contact:", jsonObject.error);
					callback({ nameExists: false, emailExists: false, phoneExists: false });
				}
			} else if (this.readyState == 4) {
				console.error("HTTP error checking for existing contact:", this.status);
				callback({ nameExists: false, emailExists: false, phoneExists: false });
			}
		};
		xhr.send(jsonPayload);
	} catch(err) {
		console.error("Exception checking for existing contact:", err.message);
		callback({ nameExists: false, emailExists: false, phoneExists: false });
	}
}

function createContactRecord(firstName, lastName, emailAddress, phoneNumber) {
    let tmp = {
        firstName: firstName,    
        lastName: lastName,      
        phone: phoneNumber,      
        email: emailAddress,    
        userID: userId          
    };

    let jsonPayload = JSON.stringify(tmp);
    console.log("Sending payload:", jsonPayload); 
    
    let url = 'LAMPAPI/CreateContact.' + extension;
    
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Server response:", xhr.responseText); 
                
                let jsonObject = JSON.parse(xhr.responseText);
                
                if (jsonObject.error === "" || jsonObject.error === null) {
                    let resultElement = document.getElementById("registerContact");
                    if (resultElement) {
                        resultElement.innerHTML = "Contact created successfully!";
                        resultElement.style.color = "green";
                    }

                    // Clear the form fields
                    document.getElementById("firstNameText").value = "";
                    document.getElementById("lastNameText").value = "";
                    document.getElementById("emailText").value = "";
                    document.getElementById("phoneNumber").value = "";

                    console.log("Contact created with ID:", jsonObject.id);
                    searchContact(); // Refresh table from database

                } else {
                    console.error("Server returned error:", jsonObject.error);
                    let resultElement = document.getElementById("registerContact");
                    if (resultElement) {
                        resultElement.innerHTML = "Error: " + jsonObject.error;
                        resultElement.style.color = "#880D1E";
                    }
                }
            }
            else if (this.readyState == 4) {
                console.error("HTTP Error:", this.status, xhr.responseText);
                let resultElement = document.getElementById("registerContact");
                if (resultElement) {
                    resultElement.innerHTML = "Server error: " + this.status;
                    resultElement.style.color = "#880D1E";
                }
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err) {
        console.error("Exception:", err);
        let resultElement = document.getElementById("registerContact");
        if (resultElement) {
            resultElement.innerHTML = "Connection error: " + err.message;
            resultElement.style.color = "#880D1E";
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
    
    let contactList = document.getElementById("contactList");
    let tableBody = document.getElementById("contactsTableBody");
    
    if (contactList) {
        contactList.innerHTML = "";
    }

    let tmp = {
        search: searchTerm,
        userId: userId 
    };
	
    let jsonPayload = JSON.stringify(tmp);
    console.log("Search payload:", jsonPayload); 

    let url = 'LAMPAPI/SearchContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Search response:", xhr.responseText);
                
                if (searchResultElement) {
                    searchResultElement.innerHTML = "Contacts retrieved";
                    searchResultElement.style.color = "green";
                }
                
                let jsonObject = JSON.parse(xhr.responseText);
                console.log("Parsed search results:", jsonObject);

                if (tableBody) {
                    populateContactsTable(jsonObject.results || []);
                } else if (contactList) {
                    let text = "<table><tr><th>First Name</th><th>Last Name</th><th>Phone</th><th>Email</th></tr>";
                    
                    if (jsonObject.results && jsonObject.results.length > 0) {
                        for(let i = 0; i < jsonObject.results.length; i++) {
                            text += "<tr>";
                            text += "<td>" + (jsonObject.results[i].firstName || jsonObject.results[i].FirstName || '') + "</td>";
                            text += "<td>" + (jsonObject.results[i].lastName || jsonObject.results[i].LastName || '') + "</td>";
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
            } else if (this.readyState == 4) {
                console.error("HTTP Error:", this.status, xhr.responseText); 
                if (searchResultElement) {
                    searchResultElement.innerHTML = "Server error: " + this.status;
                    searchResultElement.style.color = "#880D1E";
                }
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err) {
        console.error("Search exception:", err);
        if (searchResultElement) {
            searchResultElement.innerHTML = err.message;
            searchResultElement.style.color = "#880D1E";
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


// Open the edit modal and pre-fill with contact info
function editContact(contactId) {
    let button = document.querySelector(`button[onclick="editContact(${contactId})"]`);
    if (!button) return;

    let row = button.closest("tr");

    // Grab current values from table row
    let firstName = row.cells[0].innerText;
    let lastName = row.cells[1].innerText;
    let email = row.cells[2].innerText;
    let phone = row.cells[3].innerText;

    // Fill modal inputs
    document.getElementById("editContactId").value = contactId;
    document.getElementById("editFirstName").value = firstName;
    document.getElementById("editLastName").value = lastName;
    document.getElementById("editEmail").value = email;
    document.getElementById("editPhone").value = phone;

    // Show modal
    document.getElementById("editModal").style.display = "block";
}

// Close the modal
function closeEditModal() {
    document.getElementById("editModal").style.display = "none";
}

// Save edits to the server
function saveContactEdits(event) {
    event.preventDefault(); // prevent page reload

    console.log("Saving edits…"); // debug

    let contactId = document.getElementById("editContactId").value;
    let newFirstName = document.getElementById("editFirstName").value.trim();
    let newLastName = document.getElementById("editLastName").value.trim();
    let newEmail = document.getElementById("editEmail").value.trim();
    let newPhone = document.getElementById("editPhone").value.trim();

    let tmp = {
        ID: contactId,
        firstName: newFirstName,
        lastName: newLastName,
        email: newEmail,
        phone: newPhone
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/LAMPAPI/UpdateContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
            console.log("Response:", this.responseText); // debug log
            if (this.status === 200) {
                let jsonObject = JSON.parse(this.responseText);

                if (!jsonObject.error || jsonObject.error === "") {
                    alert("Contact updated successfully!");
                    closeEditModal();
                    searchContact(); // refresh list
                } else {
                    alert("Update failed: " + jsonObject.error);
                }
            } else {
                alert("Server error: " + this.status);
            }
        }
    };

    xhr.send(jsonPayload);
}

// Close modal when clicking outside of it
window.onclick = function (event) {
    let modal = document.getElementById("editModal");
    if (event.target === modal) {
        closeEditModal();
    }
};



function deleteContact(contactId) {
	console.log("Attempting to delete contact with ID:", contactId); 
	
	if (!contactId || contactId === 'null') {
		alert("Error: Invalid contact ID");
		return;
	}
	
	if (!confirm("Are you sure you want to delete this contact?")) {
		return;
	}
	
	let tmp = {
		ID: contactId
	};
	
	let jsonPayload = JSON.stringify(tmp);
	console.log("Delete payload:", jsonPayload); 
	
	let url = 'LAMPAPI/DeleteContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	try {
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				console.log("Delete response:", xhr.responseText);
				
				let jsonObject = JSON.parse(xhr.responseText);
				
				if (jsonObject.error === "" || jsonObject.error === null) {
					console.log("Contact deleted successfully");
					searchContact(); 
				} else {
					console.error("Delete error:", jsonObject.error);
					alert("Error deleting contact: " + jsonObject.error);
				}
			}
			else if (this.readyState == 4) {
				console.error("HTTP error:", this.status, xhr.responseText);
				alert("Server error: " + this.status);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err) {
		console.error("Delete exception:", err);
		alert("Connection error: " + err.message);
	}
}

function closeAddModal() {
    document.getElementById("addModal").style.display = "none";
}

function openAddModal() {
    document.getElementById("addModal").style.display = "block";
}
