//Handle Registration
const registerform = document.getElementById('registerForm');
const loginform = document.getElementById('loginForm');
if(loginform) {
    loginform.addEventListener('submit', async (e) => {
        e.preventDefault();
        const credential = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('password').value;
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credential, password })
        });
        const result = await response.json();
        if (response.ok) {
            localStorage.setItem('authToken', result.token);
            alert("Login successful!");
            window.location.href = 'index.html'; //telling the page where to redirect - after login, go to dashboard page
            //window - putting the function in public space - global scope.
            /* JavaScript likes t okeep things private and secure. If a function is defined inside a if() block, JS will will lock that funciton inside that if().
            window.function is like telling JavaScript that likes to keep function inside {...} private - "I know you want to keep this private,
            but i need HTML buttons to be able to find it. Tape this to the front door so the whole browser can see it. "*/
        } else {
            alert(result.error);
        }
    });
}
if (registerform) {
    registerform.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const deviceLocation = Intl.DateTimeFormat().resolvedOptions().timeZone;



        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password, deviceLocation })
        });
        const result = await response.json();
        if (response.ok) {
            localStorage.setItem('authToken', result.token);
            alert(result.message);
            window.location.href = 'index.html'; //telling the page where to redirect - after registering, go to dashboard page
        } else {
            alert(result.error);
        }
    });
}

//Handle loading users
const userTableBody = document.getElementById('userTableBody');
if (userTableBody) {
    async function loadDashboard() {
        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('You must be logged in to view the dashboard.');
            window.location.href = 'login.html'; //telling the page where to redirect - if no token, go to login page to login
            return;
        }

        const response = await fetch('/api/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            alert('Session Expired. Log in again.');
            localStorage.removeItem('authToken');
            window.location.href = 'login.html'; //telling the page where to redirect - session expired - go to login page to login
            return;
        }

        const data = await response.json();
        const currentUserId = data.currentUserId;
        const currentUser = data.users.find(u => u.id === currentUserId);

        if (currentUser) {
            document.getElementById('userCount').innerText = `Welcome Back, ${currentUser.username}!`;
        } else {
            document.getElementById('userCount').innerText = 'Welcome to the Dashboard';
        }

        userTableBody.innerHTML = data.users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.loginCount || 1}</td>
                <td>${user.timestamp}</td>
                <td>${user.deviceLocation}</td>
                <td>
                    ${user.id === currentUserId ? `<button class="edit-btn" onclick="updateUser(${user.id})">Update</button><button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>` : ''}
                </td>
            </tr>`).join('');
    }
    window.loadDashboard = loadDashboard;
    loadDashboard();
}

window.logout = function() {
    localStorage.removeItem('authToken');
    window.location.href = 'login.html';
};

//Handle Delete & Edit User
/*
async function deleteUser(id) {
    const response = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: 'DELETE'
    });
    const result = await response.json();
    if (response.ok) {
        alert(result.message);
        loadDashboard();
    } else {
        alert(result.error);
    }
}

async function updateUser(id) {
    const newUsername = prompt("Enter new username:");
    const newEmail = prompt("Enter new email:");
    const response = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: newUsername, email: newEmail })
    });
    const result = await response.json();
    if (response.ok) {
        alert(result.message);
        loadDashboard();
    } else {
        alert(result.error);
    }
}*/
window.deleteUser = async function(id) {
    if(confirm("Are you sure you want to delete this user?")) {
        const token = localStorage.getItem('authToken'); //getting the token
        const response = await fetch(`/api/users/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization':`Bearer ${token}` 
            }//sending token to bouncer            }
        });
        const result = await response.json();
        alert(result.message || result.error);
        window.location.reload();
    }
};

window.updateUser = async function(id) {
    const newEmail = prompt("Enter new email:");
    if(newEmail) {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`/api/users/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${token}`
            },
            body: JSON.stringify({ email: newEmail })
        });
        const result = await response.json();
        alert(result.message || result.error);
        window.location.reload();
    }
}