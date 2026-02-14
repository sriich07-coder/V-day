// script.js

let noButton = document.getElementById('noBtn');
let yesButton = document.getElementById('yesBtn');

// Array of funny no responses
let noResponses = [
    "Are you sure you want to say that?",
    "Nah, let's not do that.",
    "No way, José!",
    "Not in a million years!",
    "I think I'll pass on that one!",
    "You've got to be kidding me!",
    "How about a big NO instead?"
];

function moveNoButton(e) {
    noButton.style.position = 'absolute';
    noButton.style.left = e.pageX + 'px';
    noButton.style.top = e.pageY + 'px';
}

noButton.addEventListener('mousemove', moveNoButton);

yesButton.addEventListener('click', function() {
    noButton.style.display = 'none';
});

// Keep the No button always visible and follow the cursor
document.addEventListener('mousemove', moveNoButton);
