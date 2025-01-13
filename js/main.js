import { Sequence } from "./modules/sequence.js";
import { UI } from "./modules/ui.js";

let difficulty = "Easy";
let lastDifficulty = "Easy";
let currentRound = 1;
let sequence;
let userSequence = [];
let repeatUsed = false;
let incorrectAttempts = 0;
let isInputEnabled = true;

function startGame() {
    sequence = new Sequence(difficulty);
    startRound();
}

function startRound() {
    userSequence = [];
    repeatUsed = false;
    incorrectAttempts = 0;
    const sequenceLength = 2 + (currentRound - 1) * 2;
    sequence.generateSequence(sequenceLength);
    UI.renderGameScreen(
        sequence,
        currentRound,
        difficulty,
        handleUserInput,
        repeatSequence,
        restartGame,
        repeatUsed
    );
    simulateTyping(sequence.getSequence());
}

function handleUserInput(input) {
    if (
        !isInputValid(input) ||
        document.querySelector("#next") ||
        !isInputEnabled
    )
        return;

    const inputField = document.querySelector(".game__input");
    userSequence.push(input);
    inputField.value += input;

    const keyElement = Array.from(
        document.querySelectorAll(".keyboard__key")
    ).find((key) => key.textContent === input);

    if (sequence.getSequence()[userSequence.length - 1] === input) {
        if (keyElement) UI.highlightKey(keyElement);

        if (userSequence.join("") === sequence.getSequence().join("")) {
            handleCorrectSequence();
        }
    } else {
        if (keyElement) UI.highlightKey(keyElement, false);
        handleIncorrectSequence();
    }
}

function handleCorrectSequence() {
    if (currentRound === 5) {
        UI.addModalWindow(
            "You won the game!",
            openModalWindow,
            closeModalWindow
        );
        restartGame();
    } else {
        const repeatButton = document.querySelector("#repeat");
        repeatButton.disabled = true;

        const nextButton = UI.createElement(
            "button",
            { id: "next", class: "game__button" },
            "Next"
        );
        nextButton.addEventListener("click", () => {
            currentRound++;
            startRound();
        });

        repeatButton.replaceWith(nextButton);
    }
}

function openModalWindow() {
    isInputEnabled = false;
    const allButtons = document.querySelectorAll(".game__button, .keyboard__key");
    allButtons.forEach((button) => button.setAttribute("disabled", ""));
}

function closeModalWindow() {
    isInputEnabled = true;
	const allButtons = document.querySelectorAll(".game__button, .keyboard__key");
    allButtons.forEach((button) => button.removeAttribute("disabled"));

    if (repeatUsed) {
        document.querySelector("#repeat").setAttribute("disabled", "");
    }
}

function handleIncorrectSequence() {
    incorrectAttempts++;
    if (incorrectAttempts === 1) {
        const inputField = document.querySelector(".game__input");
        inputField.value = "";
        userSequence = [];
        UI.addModalWindow(
            "Incorrect sequence. Try again.",
            openModalWindow,
            closeModalWindow
        );
    } else {
        UI.addModalWindow(
            "Incorrect sequence. You cannot continue.",
            openModalWindow,
            closeModalWindow
        );
        const repeatButton = document.querySelector("#repeat");
        repeatButton.disabled = true;
        isInputEnabled = false;
    }
}

function repeatSequence() {
    if (repeatUsed) return;
    repeatUsed = true;

    simulateTyping(sequence.getSequence());
    userSequence = [];
    document.querySelector(".game__input").value = "";

    const repeatButton = document.querySelector("#repeat");
    repeatButton.disabled = true;
}

function simulateTyping(sequence) {
    isInputEnabled = false;
    const keys = document.querySelectorAll(".keyboard__key");
    const allButtons = document.querySelectorAll(".game__button, .keyboard__key");
    const inputField = document.querySelector(".game__input");

    allButtons.forEach((button) => button.setAttribute("disabled", ""));
    inputField.value = "";

    sequence.forEach((char, index) => {
        setTimeout(() => {
            const key = Array.from(keys).find(
                (key) => key.textContent === char
            );
            UI.highlightKey(key);

            if (index === sequence.length - 1) {
                isInputEnabled = true;
                allButtons.forEach((button) =>
                    button.removeAttribute("disabled")
                );

                if (repeatUsed) {
                    document
                        .querySelector("#repeat")
                        .setAttribute("disabled", "");
                }
            }
        }, index * 500);
    });
}

function isInputValid(input) {
    const validKeys = sequence?.getCharacters() || [];
    return validKeys.includes(input);
}

function restartGame() {
    currentRound = 1;
    userSequence = [];
    isInputEnabled = true;
    lastDifficulty = difficulty;
    UI.renderInitialScreen(startGame, changeDifficulty, lastDifficulty);
}

function changeDifficulty(newDifficulty) {
    difficulty = newDifficulty;
}

function handlePhysicalKeyboard(e) {
    if (!isInputEnabled) return;

    const key = e.key.toUpperCase();
    isInputEnabled = false;

    setTimeout(() => {
        isInputEnabled = true;
    }, 200);

    handleUserInput(key);
}

document.addEventListener("DOMContentLoaded", () => {
    UI.renderInitialScreen(startGame, changeDifficulty, lastDifficulty);
    document.addEventListener("keydown", handlePhysicalKeyboard);
});
