var ws = new WebSocket("ws://localhost:8080/server");
ws.onerror = function (event) {
    console.error(event);
};
ws.onopen = function (event) {
    console.log(event);
};
ws.onmessage = function (event) {
    var d = JSON.parse(event.data) as { roomId: string };
    console.log(event);
    ws.send(JSON.stringify({ roomId: "room" }));
    console.log(d.roomId);
};
