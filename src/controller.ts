import {Helper} from'./helper';

export class ControlHandler {

    a: boolean;
    d: boolean;
    w: boolean;
    s: boolean;
    mouseLeft: boolean;
    mouseX: number;
    mouseY: number;
    main: any;
    canvas: any;
    camera:any;
    player:any;

    constructor(main: any){
        this.a = false;
        this.d = false;
        this.w = false;
        this.s = false;
        this.mouseLeft = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.main = main;
        this.canvas = main.canvas;
        this.camera = main.camera;
        this.player = main.player;
        this.canvas.addEventListener('keydown', this.keyDownEvent.bind(this));
        this.canvas.addEventListener('keyup', this.keyUpEvent.bind(this));
        this.canvas.addEventListener('mousedown', this.mouseDownEvent.bind(this));
        this.canvas.addEventListener('mouseup', this.mouseUpEvent.bind(this));
        this.canvas.addEventListener('mousemove', this.mouseMoveEvent.bind(this));
        this.canvas.addEventListener('contextmenu', this.contextMenuEvent.bind(this))
    }

    keyDownEvent(e) {
        if (e.keyCode == 87) {
            this.w = true
        } else if (e.keyCode == 83) {
            this.s = true
        } else if (e.keyCode == 65) {
            this.a = true
        } else if (e.keyCode == 68) {
            this.d = true
        } else {
            e.preventDefault();
        }
    }
    
    keyUpEvent(e) {
        if (e.keyCode == 87 || e.keyCode == 38) {
            this.w = false
        } else if (e.keyCode == 83) {
            this.s = false
        } else if (e.keyCode == 65) {
            this.a = false
        } else if (e.keyCode == 68) {
            this.d = false
        } else {
            e.preventDefault();
        }
    }
    
    mouseDownEvent(e) {
        if (e.button == 0) {
            this.mouseLeft = true
        }
    }
    
    mouseUpEvent(e) {
        if (this.mouseLeft) {
            /* if (this.main.state == 'menuScreen' || this.main.state == 'gameOverScreen') {
                this.main.startGame()
            } */
        }
        if (e.button == 0) {
            this.mouseLeft = false
        }
    };
    mouseMoveEvent(e) {
        var rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top
        this.player.angle = Helper.calculateAngle(this.player.x- this.camera.x, this.player.y - this.camera.y, this.mouseX - this.camera.x, this.mouseY- this.camera.y); // FIXME: devono essere relative alla camera?
    };
    
    contextMenuEvent(e) {
        e.preventDefault()
    };

}

