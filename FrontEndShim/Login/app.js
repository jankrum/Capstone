const usernameInput = document.querySelector("#usernameInput");
const passwordInput = document.querySelector("#passwordInput");

const enterButton = document.querySelector("#enterButton");
const errorLabel = document.querySelector("#errorLabel");

function displayError() {
    errorLabel.innerHTML = "Invalid username or password"
}

async function enterClicked() {
    const usernameText = usernameInput.value;
    const passwordText = passwordInput.value;

    errorLabel.innerHTML = "";

    if (usernameText.length === 0 || passwordText.length === 0) {
        displayError();
        return;
    }

    console.log("We good")
}

enterButton.addEventListener("click", enterClicked);