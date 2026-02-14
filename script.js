// script.js

let buttonVisible = true;

function checkResponse(response) {
    if (response === 'yes') {
        alert('Thank you for the affirmation!');
        buttonVisible = false;
    } else {
        showFunnyResponse();
    }
    updateButtonVisibility();
}

function updateButtonVisibility() {
    const button = document.getElementById('responseButton');
    if (buttonVisible) {
        button.style.display = 'block';
    } else {
        button.style.display = 'none';
    }
}

function showFunnyResponse() {
    const responses = [
        "No way, José!",
        "Not today!",
        "I'd rather hug a cactus!",
        "Nope, not happening!",
        "Try again tomorrow!",
        "Not in this lifetime!"
    ];
    const randomIndex = Math.floor(Math.random() * responses.length);
    alert(responses[randomIndex]);
}

const responseButton = document.getElementById('responseButton');
responseButton.addEventListener('click', () => checkResponse('yes')); // Simulate a 'yes' response
