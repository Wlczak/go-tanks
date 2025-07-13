// const ws = new WebSocket("ws://localhost:8080/server");
// ws.onerror = function (event) {
//     console.error(event);
// };
// ws.onopen = function () {
//     //console.log(event);
// };
// ws.onmessage = function (event) {
//     const d = JSON.parse(event.data) as { roomId: string };
//     //console.log(event);
//     ws.send(JSON.stringify({ roomId: "room" }));
//     //console.log(d.roomId);
// };
