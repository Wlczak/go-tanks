import { Client } from "./client.js";
import { startGame } from "./main.js";

const skipLogin = false;

const singleplayerButton = document.getElementById("play-button-single") as HTMLButtonElement;
const multiplayerButton = document.getElementById("play-button-multi") as HTMLButtonElement;
const gameMenu = document.getElementById("game-menu") as HTMLDivElement;
const loginMenu = document.getElementById("login-menu") as HTMLDivElement;
const multiplayerMenu = document.getElementById("multiplayer-menu") as HTMLDivElement;
const gameScreen = document.getElementById("game-screen") as HTMLDivElement;
const loginForm = document.getElementById("login-form") as HTMLFormElement;
const multiplayerHostButton = document.getElementById("multiplayer-host-button") as HTMLButtonElement;
const multiplayerJoinButton = document.getElementById("multiplayer-join-button") as HTMLButtonElement;
const roomIdInput = document.getElementById("multiplayer-roomId-input") as HTMLInputElement;

function loadGame() {
    import("./main.js").then(() => {
        startGame();
        gameScreen.style.display = "flex";
    });
}
function loadMuntiplayerGame(conn: WebSocket) {}

function loadGameMenu() {
    singleplayerButton.addEventListener("click", () => {
        loadGame();
        gameMenu.style.display = "none";
    });
    multiplayerButton.addEventListener("click", () => {
        loadMultiplayerMenu();
    });

    loginMenu.style.display = "none";
    gameMenu.style.display = "inline";
}

function loadMultiplayerMenu() {
    gameMenu.style.display = "none";
    multiplayerMenu.style.display = "inline";

    multiplayerHostButton.addEventListener("click", async () => {
        const roomId = await Client.openRoom();
        sessionStorage.setItem("roomId", roomId);
        const username = sessionStorage.getItem("username");
        if (username == null) {
            return;
        }
        // also sets the uid
        const conn = await Client.getLoggedInServerConnection(username);
        if (conn == null) {
            return;
        }

        const uid = sessionStorage.getItem("uid");
        if (uid == null) {
            return;
        }
        Client.joinRoom(uid, roomId);
        loadMuntiplayerGame(conn);
    });
    multiplayerJoinButton.addEventListener("click", () => {
        const roomId = roomIdInput.value;
        console.log(roomId);
    });
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
