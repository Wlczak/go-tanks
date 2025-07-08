import { Client } from "./client.js";
import { startGame } from "./main.js";

const skipLogin = false;

const singleplayerButton = document.getElementById("play-button-single") as HTMLButtonElement;
const multiplayerButton = document.getElementById("play-button-multi") as HTMLButtonElement;
const gameMenu = document.getElementById("game-menu") as HTMLDivElement;
const loginMenu = document.getElementById("login-menu") as HTMLDivElement;
const gameScreen = document.getElementById("game-screen") as HTMLDivElement;
const loginForm = document.getElementById("login-form") as HTMLFormElement;

function loadGame() {
    import("./main.js").then(() => {
        startGame();
        gameScreen.style.display = "flex";
    });
}

function loadGameMenu() {
    singleplayerButton.addEventListener("click", () => {
        loadGame();
        gameMenu.style.display = "none";
    });
    multiplayerButton.addEventListener("click", () => {
        Client.openRoom();
    });

    loginMenu.style.display = "none";
    gameMenu.style.display = "inline";
}

function login(username: string /*, password: string*/): boolean {
    sessionStorage.setItem("username", username);
    return true;
}
if (skipLogin) {
    loginMenu.style.display = "none";
    loadGame();
} else {
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData.entries()) as {
            username: string;
            // password: string;
        };

        if (login(data.username /*, data.password*/)) {
            loadGameMenu();
        }
    });
}

if (sessionStorage.getItem("username")) {
    loadGameMenu();
}
