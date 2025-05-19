export class Controlls {
    public up: boolean = false;
    public down: boolean = false;
    public left: boolean = false;
    public right: boolean = false;

    private debug: boolean = false;
    constructor() {
        this.setupControlls();
    }

    private setupControlls() {
        // up
        document.addEventListener("keyup", (event) => {
            if (event.key === "ArrowUp") {
                this.up = false;
                console.log("up off");
            }
        });
        document.addEventListener("keydown", (event) => {
            if (event.key === "ArrowUp") {
                this.up = true;
                console.log("up on");
            }
        });

        // down
        document.addEventListener("keyup", (event) => {
            if (event.key === "ArrowDown") {
                this.down = false;
                console.log("down off");
            }
        });
        document.addEventListener("keydown", (event) => {
            if (event.key === "ArrowDown") {
                this.down = true;
                console.log("down on");
            }
        });

        // left
        document.addEventListener("keyup", (event) => {
            if (event.key === "ArrowLeft") {
                this.left = false;
                console.log("left off");
            }
        });
        document.addEventListener("keydown", (event) => {
            if (event.key === "ArrowLeft") {
                this.left = true;
                console.log("left on");
            }
        });

        // right
        document.addEventListener("keyup", (event) => {
            if (event.key === "ArrowRight") {
                this.right = false;
                console.log("right off");
            }
        });
        document.addEventListener("keydown", (event) => {
            if (event.key === "ArrowRight") {
                this.right = true;
                console.log("right on");
            }
        });
    }
}
