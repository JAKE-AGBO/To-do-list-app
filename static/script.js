// Signup functionality
function signup(event) {
    event.preventDefault();

    const username = document.getElementById('signup-username').value.trim();
    const password = document.getElementById('signup-password').value.trim();

    if (!username || !password) {
        alert('Please enter both username and password.');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[username]) {
        alert('Username already exists!');
        return;
    }

    users[username] = { password: password };
    localStorage.setItem('users', JSON.stringify(users));

    alert('Signup successful! Please login.');
    window.location.href = '/';
}

// Login functionality
function login(event) {
    event.preventDefault();

    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();

    let users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[username] && users[username].password === password) {
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('currentUser', username);
        document.cookie = `currentUser=${username}; path=/;`;
        window.location.href = '/todo';
    } else {
        alert('Invalid credentials. Please try again.');
    }
}

// Logout functionality
function logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('currentUser');
    document.cookie = "currentUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '/';
}

// Get cookie by name
function getCookie(name) {
    const cookieArr = document.cookie.split(";");

    for (let i = 0; i < cookieArr.length; i++) {
        const cookiePair = cookieArr[i].split("=");

        if (name === cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}

// Display current user on To-Do page
function displayUsername() {
    const username = getCookie("currentUser");
    if (username) {
        const welcomeEl = document.getElementById('welcome-user');
        if (welcomeEl) {
            welcomeEl.textContent = `Welcome, ${username}!`;
        }
    }
}

// Protect the To-Do page
if (window.location.pathname === "/todo") {
    if (localStorage.getItem('loggedIn') !== 'true') {
        window.location.href = '/';
    } else {
        displayUsername();
    }
}
