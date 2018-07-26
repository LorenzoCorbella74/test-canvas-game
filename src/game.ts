import { ControlHandler } from './controller';
import { Player } from './player';
import { conf as c } from './config';
import { Camera } from './camera';
import { Map } from './maps';

export default class Game {

    canvas:     HTMLCanvasElement;
    ctx:        CanvasRenderingContext2D;
    width:      number = c.CANVAS_WIDTH; // window.innerWidth;
    height:     number = c.CANVAS_HEIGHT; // window.innerHeight;
    player:     any;
    camera:     Camera;
    control:    ControlHandler;
    currentMap: Map;

    constructor() {
        this.canvas        = <HTMLCanvasElement>document.getElementById('canvas');
        this.canvas.width  = this.width;
        this.canvas.height = this.height;
        this.ctx           = this.canvas.getContext("2d");
        this.player        = new Player(this);
        this.camera        = new Camera(0, 0, 800, 600, this);
        this.control       = new ControlHandler(this);
        this.currentMap    = new Map(this);
        this.player.setControlHandler(this.control);
        this.camera.setCurrentMap(this.currentMap);
        this.player.isFollowedBY(this.camera, this.currentMap);
    }

    updateAll() {
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
        this.ctx.fillStyle = c.HUD_BACKGROUND;
        this.ctx.fillRect(0, 0, c.CANVAS_WIDTH, c.TILE_SIZE);
        this.ctx.textAlign = 'LEFT';
        this.ctx.font = 'bold 14px/1 Arial';
        this.ctx.fillStyle = '#565454';
        this.ctx.fillText('HP ', 5, c.TILE_SIZE/2);
        this.ctx.fillText('AP ', 85, c.TILE_SIZE/2);
        this.ctx.fillText('Kills ', 165, c.TILE_SIZE/2);
        this.ctx.font = 'bold 14px/1 Arial';
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillText(Math.round(this.player.hp).toString(), 30, c.TILE_SIZE/2);
        this.ctx.fillText(Math.round(this.player.ap).toString(), 110, c.TILE_SIZE/2);
        this.ctx.fillText(Math.round(this.player.kills).toString(), 200, c.TILE_SIZE/2)
    }

}