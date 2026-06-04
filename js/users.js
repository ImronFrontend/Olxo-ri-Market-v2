var userList = document.getElementById("user-list");
var addUserForm = document.getElementById("add-user-form");
var API_URL = "https://fakestoreapi.com/users/";

var allUsers = [];

var token = localStorage.getItem("token");
if (!token) {
  window.location.href = "index.html";
}

function fetchUsers() {
  userList.innerHTML = "<tr><td colspan='6' style='text-align:center;'>Loading...</td></tr>";

  fetch("https://fakestoreapi.com/users")
    .then(function(response) {
      return response.json();
    })
    .then(function(users) {
      allUsers = users;
      renderUsers(allUsers);
    });
}

function createUserRow(user) {
  var tr = document.createElement("tr");
  
  var name = user.name;
  var fullName = name.firstname + " " + name.lastname;
  
  var html = "<td>" + user.id + "</td>";
  html = html + "<td>" + fullName + "</td>";
  html = html + "<td>" + user.email + "</td>";
  html = html + "<td>" + user.phone + "</td>";
  html = html + "<td>" + user.username + "</td>";
  html = html + "<td>";
  html = html + "<button onclick='viewUser(" + user.id + ")'>View</button>";
  html = html + "<button onclick='deleteUser(" + user.id + ")'>Delete</button>";
  html = html + "</td>";
  
  tr.innerHTML = html;
  return tr;
}

function renderUsers(users) {
  if (!userList) {
    return;
  }
  userList.innerHTML = "";
  
  for (var i = 0; i < users.length; i++) {
    var user = users[i];
    var tr = createUserRow(user);
    userList.appendChild(tr);
  }
}

function viewUser(id) {
  var foundUser = null;
  for (var i = 0; i < allUsers.length; i++) {
    if (allUsers[i].id == id) {
      foundUser = allUsers[i];
    }
  }

  if (foundUser) {
    var name = foundUser.name;
    var fullName = name.firstname + " " + name.lastname;
    alert("ID: " + foundUser.id + " Name: " + fullName + " Email: " + foundUser.email);
  } else {
    alert("User not found");
  }
}

if (addUserForm) {
  addUserForm.addEventListener("submit", function(e) {
    e.preventDefault();

    var newUser = {
      name: {
        firstname: addUserForm.name.value,
        lastname: "New"
      },
      email: addUserForm.email.value,
      phone: addUserForm.phone.value,
      username: addUserForm.username.value,
      address: {
        city: "City"
      }
    };

    fetch("https://fakestoreapi.com/users", {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(result) {
      newUser.id = result.id;
      
      var newArray = [];
      newArray.push(newUser);
      for (var i = 0; i < allUsers.length; i++) {
        newArray.push(allUsers[i]);
      }
      allUsers = newArray;
      
      renderUsers(allUsers);
      addUserForm.reset();
      alert("User added");
    });
  });
}

function deleteUser(id) {
  if (confirm("Delete?")) {
    fetch(API_URL + id, {
      method: "DELETE"
    })
    .then(function(response) {
      if (response.ok) {
        alert("Deleted");
        
        var filteredUsers = [];
        for (var i = 0; i < allUsers.length; i++) {
          if (allUsers[i].id != id) {
            filteredUsers.push(allUsers[i]);
          }
        }
        allUsers = filteredUsers;
        renderUsers(allUsers);
      }
    });
  }
}

fetchUsers();
