import {Helper} from'./helper';
/* import Game from './game'; */

export class ControlHandler {

    a:          boolean = false;
    d:          boolean = false;
    w:          boolean = false;
    s:          boolean = false;
    mouseLeft:  boolean = false;
    mouseRight: boolean = false;
    mouseX:     number  = 0;
    mouseY:     number = 0;

    main:   any;
    canvas: any;
    camera: any;
    player: any;

    back2Player:boolean = true;

    constructor(main: any){
        this.main   = main;
        this.canvas = main.canvas;
        this.camera = main.camera;
        this.player = main.player;

        this.canvas.addEventListener('keydown', this.keyDownEvent.bind(this));
        this.canvas.addEventListener('keyup', this.keyUpEvent.bind(this));
        this.canvas.addEventListener('mousedown', this.mouseDownEvent.bind(this));
        this.canvas.addEventListener('mouseup', this.mouseUpEvent.bind(this));
        this.canvas.addEventListener('mousemove', this.mouseMoveEvent.bind(this));
        this.canvas.addEventListener('contextmenu', this.contextMenuEvent.bind(this))
        window.addEventListener('mousewheel', this.mouseWheelEvent.bind(this));
        window.addEventListener('DOMMouseScroll', this.mouseWheelEvent.bind(this));
    }

    keyDownEvent(e:any) {
        if (e.keyCode == 87) {
            this.w = true
        } else if (e.keyCode == 83) {
            this.s = true
        } else if (e.keyCode == 65) {
            this.a = true
        } else if (e.keyCode == 68) {
            this.d = true
        } else if ((e.keyCode >= 48 || e.keyCode <= 57) && this.main.state == 'game') {
            this.player.hotKey(e.keyCode)
        }
        if (this.mouseX > 0 && this.mouseX < this.canvas.width && this.mouseY > 0 && this.mouseY < this.canvas.height) {
            e.preventDefault();
            return false
        }
    }
    
    keyUpEvent(e: any) {
        if (e.keyCode == 87 || e.keyCode == 38) {
            this.w = false
        } else if (e.keyCode == 83) {
            this.s = false
        } else if (e.keyCode == 65) {
            this.a = false
        } else if (e.keyCode == 66) {
            this.back2Player =!this.back2Player;
            this.followBot(this.back2Player);
        }else if (e.keyCode == 68) {
            this.d = false
        } else if (e.keyCode == 71) {   // g
            this.main.player.godMode = !this.main.player.godMode;
        } else if(e.keyCode == 73){     // i per debug
            this.main.debug = !this.main.debug;
        }else if (e.keyCode == 80) {
            if (!this.main.paused) {    // se non è già in pausa...
                this.main.paused = !this.main.paused;
                if(this.main.paused){
                    this.main.loadPauseScreen(this.main);
             }
            }
        } else if (this.mouseX > 0 && this.mouseX < this.canvas.width && this.mouseY > 0 && this.mouseY < this.canvas.height) {
            e.preventDefault();
            return false
        }
    }

    // permette di ciclare tra i bot
    followBot(back:boolean){
        const botIndex = Helper.getBotsName(this.main.enemy.list.map(e=>e.index));  // FIXME: è usato sia per i nomi che per l'index
        let currentActorInCamera = back?this.player: this.main.enemy.list[botIndex];
		this.main.camera.setCurrentPlayer(currentActorInCamera);
		this.main.camera.adjustCamera(currentActorInCamera);
    }
    
    mouseDownEvent(e:any) {
        if (e.button == 0) {
            this.mouseLeft = true
        } else if (e.button == 2) {
            this.mouseRight = true
        }
    }
    
    mouseUpEvent(e:any) {
        if (this.mouseLeft) {
            if (this.main.state == 'menuScreen') {
                // this.main.startGame();
                console.log(e);

            }
            if (this.main.paused) {
                this.main.paused= false;
            }
            if (this.main.state == 'statsScreen') {
                this.main.startGame();
            }
        }

        if (e.button == 0) {
            this.mouseLeft = false;
        } else if (e.button == 2) {
            this.mouseRight = false;
        }
    }

    mouseMoveEvent(e:any) {
        var rect = this.canvas.getBoundingClientRect();
        this.mouseX = (e.clientX - rect.left)/this.main.scale;    // tra 0 e 800
        this.mouseY = (e.clientY - rect.top)/this.main.scale;     // tra 0 e 600
        // angolo tra il player e il mirino
        this.player.angle = Helper.calculateAngle(this.player.x - this.camera.x, this.player.y -this.camera.y, this.mouseX, this.mouseY);
    }

    mouseWheelEvent(e:any) {
         if (this.main.state == 'game') {
            this.player.wheel(e.wheelDelta ? e.wheelDelta : -e.detail);
            return true;
        }
        if (this.mouseX > 0 && this.mouseX < this.canvas.width && this.mouseY > 0 && this.mouseY < this.canvas.height) {
            e.preventDefault();
            return false
        }
    }
    
    contextMenuEvent(e:any) {
        e.preventDefault()
    }

}

