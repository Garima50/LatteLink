console.log("Login Script");

document.getElementById('login').addEventListener('click', function(event) {
    event.preventDefault();
    console.log("Function Called");

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Login successful!');
            window.location.href = '/api/index';
        } else {
            messageDiv.textContent = data.message || "Login failed";
            messageDiv.style.color = 'red';
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        messageDiv.textContent = "An error occurred";
        messageDiv.style.color = 'red';
    });
});
