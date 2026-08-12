export class Client {
    public static async getLoggedInServerConnection(username: string): Promise<WebSocket | null> {
        let conn;
        if (window.location.protocol === "https:") {
            conn = new WebSocket("wss://" + window.location.host + "/server");
        } else {
            conn = new WebSocket("ws://" + window.location.host + "/server");
        }
        return new Promise((resolve) => {
            conn.onmessage = async function (event) {
                const msg = JSON.parse(event.data) as { uid: string; username: string };
                if (msg.username != "") {
                    resolve(null);
                }
                msg.username = username;
                conn.send(JSON.stringify(msg));
                const uid = msg.uid;
                sessionStorage.setItem("uid", uid);
                conn.onmessage = function () {};
                resolve(conn);
            };
            setTimeout(() => {
                resolve(null);
            }, 10000);
        });
    }

    public static async openRoom(): Promise<string> {
        const response = await fetch("/api/openRoom", {
            method: "GET",
        });
        const fetchData = (await response.json()) as { roomId: string };
        const roomId = fetchData.roomId;
        //console.log(roomId);
        return roomId;
    }

    public static async joinRoom(uid: string, roomId: string): Promise<boolean> {
        const result = await fetch("/api/joinRoom", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ uid: uid, roomId: roomId }),
        });
        return result.ok;
    }
}
