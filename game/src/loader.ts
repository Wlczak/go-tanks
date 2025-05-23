import { startGame } from "./main.js";

const skipLogin = true;

const playButton = document.getElementById("play-button") as HTMLButtonElement;
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
    playButton.addEventListener("click", () => {
        loadGame();
        gameMenu.style.display = "none";
    });

    loginMenu.style.display = "none";
    gameMenu.style.display = "inline";
}

function login(username: string /*, password: string*/): boolean {
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
