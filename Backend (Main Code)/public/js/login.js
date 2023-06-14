const loginForm = document.querySelector('#login-form');

console.log("Im here")

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);
    const username = formData.get('username');
    const password = formData.get('password');

    const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
        // The login was successful - redirect to the user's dashboard
        window.location.href = '/dashboard';
    } else {
        // The login was unsuccessful - display an error message
        const errorMessage = await response.text();
        const errorDiv = document.querySelector('#error');
        errorDiv.textContent = errorMessage;
    }
});