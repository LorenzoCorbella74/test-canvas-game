import { Player } from './player';
import { conf as c } from './config';

export default class Game {

    canvas: HTMLCanvasElement;
    ctx:    CanvasRenderingContext2D;
    width:  number = c.CANVAS_WIDTH; // window.innerWidth;
    height: number = c.CANVAS_HEIGHT; // window.innerHeight;
    player: any    = {};

    constructor() {
        this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext("2d");
        this.player = new Player(this.canvas, this.ctx);
    }

    updateAll(){
        // backgroud (map)
        // telecamera
        this.player.update();
        // enemies
        // bullets
        // particles:sangue
        // particles:detriti
        // particles:esplosioni
    }

    renderAll(): void {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.player.render();
    }

}