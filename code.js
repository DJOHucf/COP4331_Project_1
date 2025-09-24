const urlBase = 'https://cop4331-team-9.com'; 
const extension = 'php'; 

let userId = 0; 
let firstName = "";
let lastName = ""; 

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	
	document.getElementById("loginResult").innerHTML = "";
	
	if (login === "" || password === "") 
	{
		document.getElementById("loginResult").innerHTML = "Please enter both username and password";
		return;
	}
	
	let tmp = {login:login,password:password};
	let jsonPayload = JSON.stringify(tmp);
	
	let url = 'LAMPAPI/Login.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse(xhr.responseText);
				
				if (jsonObject.error === "" || jsonObject.error === null) 
				{
					userId = jsonObject.id;
					firstName = jsonObject.firstName || "";
					lastName = jsonObject.lastName || "";
					
					localStorage.setItem("userId", jsonObject.id);
					localStorage.setItem("firstName", jsonObject.firstName || "");
					localStorage.setItem("lastName", jsonObject.lastName || "");
					
					saveCookie();
					
					window.location.href = "contact.html";
				} 
				else 
				{
					document.getElementById("loginResult").innerHTML = jsonObject.error;
				}
			}
			else if (this.readyState == 4)
			{
				document.getElementById("loginResult").innerHTML = "Server error: " + this.status;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = "Connection error: " + err.message;
	}
}

function doRegister() 
{
	let login = document.getElementById("registerLogin").value;
	let password = document.getElementById("registerPassword").value;
	
	document.getElementById("registerResult").innerHTML = "";
	
	if (login === "" || password === "") 
	{
		document.getElementById("registerResult").innerHTML = "Please enter both username and password";
		return;
	}
	
	if (password.length < 6) 
	{
		document.getElementById("registerResult").innerHTML = "Password must be at least 6 characters long";
		return;
	}
	
	let tmp = {login:login,password:password};
	let jsonPayload = JSON.stringify(tmp);
	
	let url = 'LAMPAPI/Register.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	try 
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse(xhr.responseText);
				
				if (jsonObject.error === "" || jsonObject.error === null) 
				{
					document.getElementById("registerResult").innerHTML = "Registration successful! You can now log in.";
					document.getElementById("registerResult").style.color = "green";
					
					document.getElementById("registerLogin").value = "";
					document.getElementById("registerPassword").value = "";
					
					setTimeout(() => {
						let loginTab = document.querySelector('[onclick*="login"]');
						if (loginTab) 
						{
							loginTab.click();
						}
					}, 2000);
				} 
				else 
				{
					document.getElementById("registerResult").innerHTML = jsonObject.error;
					document.getElementById("registerResult").style.color = "red";
				}
			}
			else if (this.readyState == 4)
			{
				document.getElementById("registerResult").innerHTML = "Server error: " + this.status;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = "Connection error: " + err.message;
	}
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function checkLogin()
{
	let storedUserId = localStorage.getItem("userId");
	if (!storedUserId || storedUserId === "0") 
	{
		window.location.href = "index.html";
	} 
	else 
	{
		userId = parseInt(storedUserId);
		firstName = localStorage.getItem("firstName") || "";
		lastName = localStorage.getItem("lastName") || "";
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function openTab(evt, tabName) 
{
	let tabPanels = document.getElementsByClassName("tab-panel");
	for(let i = 0; i < tabPanels.length; i++) 
	{
		tabPanels[i].classList.remove("active");
	}
	
	let tabButtons = document.getElementsByClassName("tab-button");
	for(let i = 0; i < tabButtons.length; i++) 
	{
		tabButtons[i].classList.remove("active");
	}
	
	document.getElementById(tabName).classList.add("active");
	evt.currentTarget.classList.add("active");
	
	if (document.getElementById("loginResult")) 
	{
		document.getElementById("loginResult").innerHTML = "";
	}
	if (document.getElementById("registerResult")) 
	{
		document.getElementById("registerResult").innerHTML = "";
	}
}