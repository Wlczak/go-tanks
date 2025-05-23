export class Controlls {
    public up: boolean = false;
    public down: boolean = false;
    public left: boolean = false;
    public right: boolean = false;
    public space: boolean = false;

    private debug: boolean = false;
    constructor() {
        this.setupControlls();
    }

    private setupControlls() {
        // up
        document.addEventListener("keyup", (event) => {
            if (event.key === "ArrowUp") {
                this.up = false;
                if (this.debug) console.log("up off");
            }
        });
        document.addEventListener("keydown", (event) => {
            if (event.key === "ArrowUp") {
                this.up = true;
                if (this.debug) console.log("up on");
            }
        });

        // down
        document.addEventListener("keyup", (event) => {
            if (event.key === "ArrowDown") {
                this.down = false;
                if (this.debug) console.log("down off");
            }
        });
        document.addEventListener("keydown", (event) => {
            if (event.key === "ArrowDown") {
                this.down = true;
                if (this.debug) console.log("down on");
            }
        });

        // left
        document.addEventListener("keyup", (event) => {
            if (event.key === "ArrowLeft") {
                this.left = false;
                if (this.debug) console.log("left off");
            }
        });
        document.addEventListener("keydown", (event) => {
            if (event.key === "ArrowLeft") {
                this.left = true;
                if (this.debug) console.log("left on");
            }
        });

        // right
        document.addEventListener("keyup", (event) => {
            if (event.key === "ArrowRight") {
                this.right = false;
                if (this.debug) console.log("right off");
            }
        });
        document.addEventListener("keydown", (event) => {
            if (event.key === "ArrowRight") {
                this.right = true;
                if (this.debug) console.log("right on");
            }
        });

        // space
        document.addEventListener("keyup", (event) => {
            if (event.key === " ") {
                this.space = false;
                if (this.debug) console.log("space off");
            }
        });
        document.addEventListener("keydown", (event) => {
            if (event.key === " ") {
                this.space = true;
                if (this.debug) console.log("space on");
            }
        });
    }
}
