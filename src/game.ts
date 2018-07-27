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
    player:     Player;
    camera:     Camera;
    control:    ControlHandler;
    currentMap: Map;
    state:      string;

    constructor() {
        this.canvas        = <HTMLCanvasElement>document.getElementById('canvas');
        this.canvas.width  = this.width;
        this.canvas.height = this.height;
        this.ctx           = this.canvas.getContext("2d");
        this.player        = new Player(this);
        this.camera        = new Camera(0, 0, 800, 600, this);
        this.control       = new ControlHandler(this);
        this.currentMap    = new Map(this);
        this.state         = 'loading data';
        // si lega gli handler dei controlli al player
        this.player.setControlHandler(this.control);
        this.player.isFollowedBY(this.camera, this.currentMap);
        // Camera is set to the player and on the default map
        this.camera.setCurrentMap(this.currentMap);
        this.camera.setCurrentPlayer(this.player);
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
           // enemies
        // bullets
        // particles:sangue
        // particles:detriti
        // particles:esplosioni

        // HUD
        this.renderHUD();
    }

    private renderHUD() {
        this.ctx.fillStyle = c.HUD_BACKGROUND;
        this.ctx.fillRect(0, 0, c.CANVAS_WIDTH, c.TILE_SIZE);
        this.ctx.textAlign = 'LEFT';
        this.ctx.font = 'bold 14px/1 Arial';
        this.ctx.fillStyle = '#565454';
        this.ctx.fillText('HP ', 5, c.TILE_SIZE / 2);
        this.ctx.fillText('AP ', 85, c.TILE_SIZE / 2);
        this.ctx.fillText('Kills ', 165, c.TILE_SIZE / 2);
        this.ctx.font = 'bold 14px/1 Arial';
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillText(Math.round(this.player.hp).toString(), 30, c.TILE_SIZE / 2);
        this.ctx.fillText(Math.round(this.player.ap).toString(), 110, c.TILE_SIZE / 2);
        this.ctx.fillText(Math.round(this.player.kills).toString(), 200, c.TILE_SIZE / 2);
    }

    textONCanvas(context, text, x, y, font, style, align?, baseline?) {
        context.font = typeof font === 'undefined' ? 'normal 16px/1 Arial' : font;
        context.fillStyle = typeof style === 'undefined' ? '#000000' : style;
        context.textAlign = typeof align === 'undefined' ? 'center' : align;
        context.textBaseline = typeof baseline === 'undefined' ? 'middle' : baseline;
        context.fillText(text, x, y)
    }

    MenuScreen(main) {
        main.state = 'menuScreen';
        main.controlHandler.mouseLeft = false;
        main.context.clearRect(0, 0, main.canvas.width, main.canvas.height);
        var hW = main.canvas.width * 0.5;
        var hH = main.canvas.height * 0.5;
        var dark = 'rgba(0,0,0,0.9)';
        var medium = 'rgba(0,0,0,0.5)';
        var light = 'rgba(0,0,0,0.3)';
        this.textONCanvas(main.context, 'Platformer 2', 9, 18, 'normal 21px/1 ' + main.fontFamily, light, 'left');
        this.textONCanvas(main.context, 'Click to Start', hW, hH - 70, 'normal 17px/1 ' + main.fontFamily, dark);
        this.textONCanvas(main.context, 'Use "A" and "D" to move and "Space" to jump.', hW, hH - 30, 'normal 15px/1 ' + main.fontFamily, medium);
        this.textONCanvas(main.context, 'Use mouse wheel to change action and left click to perform action.', hW, hH - 10, 'normal 15px/1 ' + main.fontFamily, medium);
        this.textONCanvas(main.context, 'You can build and destroy terrain.', hW, hH + 10, 'normal 15px/1 ' + main.fontFamily, medium);
        this.textONCanvas(main.context, 'Enemies come out at night.', hW, hH + 30, 'normal 15px/1 ' + main.fontFamily, medium);
        this.textONCanvas(main.context, 'www.H3XED.com', 9, main.canvas.height - 14, 'normal 13px/1 ' + main.fontFamily, light, 'left')
    }

    gameOverScreen(main) {
        main.state = 'gameOverScreen';
        main.controlHandler.mouseLeft = false;
        main.context.clearRect(0, 0, main.canvas.width, main.canvas.height);
        var hW = main.canvas.width * 0.5;
        var hH = main.canvas.height * 0.5;
        var dark = 'rgba(0,0,0,0.9)';
        var medium = 'rgba(0,0,0,0.5)';
        var light = 'rgba(0,0,0,0.3)';
        this.textONCanvas(main.context, 'Platformer 2', 9, 18, 'normal 21px/1 ' + main.fontFamily, light, 'left');
        this.textONCanvas(main.context, 'Game Over!', hW, hH - 70, 'normal 22px/1 ' + main.fontFamily, dark);
        this.textONCanvas(main.context, 'Kills:' + main.playerHandler.kills, hW, hH - 30, 'normal 16px/1 ' + main.fontFamily, medium);
        this.textONCanvas(main.context, 'Click to Restart', hW, hH + 10, 'normal 17px/1 ' + main.fontFamily, dark);
        this.textONCanvas(main.context, 'www.H3XED.com', 9, main.canvas.height - 14, 'normal 13px/1 ' + main.fontFamily, light, 'left')
    }
}