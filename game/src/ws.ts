var ws = new WebSocket("ws://localhost:8080/server");
ws.onerror = function (event) {
    console.error(event);
};
