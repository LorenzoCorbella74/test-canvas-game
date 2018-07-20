import { Player } from './player';
import { conf as c } from './config';
import { Camera } from './camera';
import { Map} from './maps';

export default class Game {

    canvas:     HTMLCanvasElement;
    ctx:        CanvasRenderingContext2D;
    width:      number = c.CANVAS_WIDTH; // window.innerWidth;
    height:     number = c.CANVAS_HEIGHT; // window.innerHeight;
    player:     any;
    camera:     Camera;
    currentMap: Map;

    constructor() {
        this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext("2d");
        this.player = new Player(this);
        this.camera = new Camera(0, 0, 800, 600, this);
        this.currentMap = new Map(this);
        this.camera.setCurrentMap(this.currentMap);
        this.player.isFollowedBY(this.camera, this.currentMap);
    }

    updateAll(){
        this.player.update();
         this.camera.update();
        // enemies
        // bullets
        // particles:sangue
        // particles:detriti
        // particles:esplosioni
    }

    renderAll(): void {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.currentMap.render();
        this.player.render();
        // HUD
    }

}