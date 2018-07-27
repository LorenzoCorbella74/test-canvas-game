import { ControlHandler } from './controller';
import { Player } from './player';
import { conf as c } from './config';
import { Camera } from './camera';
import { Map } from './maps';

window.onload = function () {
    let app = new Game();
    app.loadMenuScreen(app);
};

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
    fontFamily: string = c.FONT_FAMILY;;

    constructor() {
        this.canvas        = <HTMLCanvasElement>document.getElementById('canvas');
        this.canvas.width  = this.width;
        this.canvas.height = this.height;
        this.ctx           = this.canvas.getContext("2d");
        this.player        = new Player(this);
        this.camera        = new Camera(0, 0, 800, 600, this);
        this.control       = new ControlHandler(this);
        this.currentMap    = new Map(this);
        this.state         = 'loading';
        // si lega gli handler dei controlli al player
        this.player.setControlHandler(this.control);
        this.player.isFollowedBY(this.camera, this.currentMap);
        // Camera is set to the player and on the default map
        this.camera.setCurrentMap(this.currentMap);
        this.camera.setCurrentPlayer(this.player);
    }

    // fa partire il gameloop
    startGame() {
        this.state = 'game';
        this.gameLoop();
    }

    private gameLoop(): void {
        if (this.state != 'game') {
            return
        }
        if (this.player.hp <= 0) {
            this.state = 'gameOverScreen';
            this.loadGameOverScreen(this);
            return
        }
        // need to bind the current this reference to the callback
        requestAnimationFrame(this.gameLoop.bind(this));
        this.updateAll();
        this.renderAll();
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
        // svuota il canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.currentMap.render();
        this.player.render();
        // enemies
        // bullets
        // particles:sangue
        // particles:detriti
        // particles:esplosioni

        this.renderHUD();   // HUD
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

    loadMenuScreen(main: any) {
        main.state = 'menuScreen';
        main.control.mouseLeft = false;
        main.ctx.clearRect(0, 0, main.canvas.width, main.canvas.height);
        var hW = main.canvas.width * 0.5;
        var hH = main.canvas.height * 0.5;
        var dark = 'rgba(0,0,0)';
        var medium = 'rgba(0,0,0)';
        var light = 'rgba(0,0,0)';
        this.textONCanvas(main.ctx, 'TEST 2D Shooter', hW, hH - 100, 'normal 32px/1 ' + main.fontFamily, light, );
        this.textONCanvas(main.ctx, 'Use "A" and "D" to move and mouse to target and fire enemies.', hW, hH - 30, 'normal 15px/1 ' + main.fontFamily, medium);
        this.textONCanvas(main.ctx, 'Use mouse wheel to change weapons.', hW, hH - 10, 'normal 15px/1 ' + main.fontFamily, medium);
        this.textONCanvas(main.ctx, 'Click to Start', hW, hH + 50, 'normal 17px/1 ' + main.fontFamily, dark);

        this.textONCanvas(main.ctx, 'L.Corbella © 2018', 9, main.canvas.height - 14, 'normal 13px/1 ' + main.fontFamily, light, 'left')
    }

    loadGameOverScreen(main: any) {
        main.state = 'gameOverScreen';
        main.control.mouseLeft = false;
        main.ctx.clearRect(0, 0, main.canvas.width, main.canvas.height);
        var hW = main.canvas.width * 0.5;
        var hH = main.canvas.height * 0.5;
        var dark = 'rgba(0,0,0)';
        var medium = 'rgba(0,0,0)';
        var light = 'rgba(0,0,0)';
        this.textONCanvas(main.ctx, '2D Shooter', 9, 18, 'normal 21px/1 ' + main.fontFamily, light, 'left');
        this.textONCanvas(main.ctx, 'Game Over!', hW, hH - 70, 'normal 22px/1 ' + main.fontFamily, dark);
        this.textONCanvas(main.ctx, 'Kills:' + main.player.kills, hW, hH - 30, 'normal 16px/1 ' + main.fontFamily, medium);
        this.textONCanvas(main.ctx, 'Click to Restart', hW, hH + 10, 'normal 17px/1 ' + main.fontFamily, dark);
        this.textONCanvas(main.ctx, 'L.Corbella © 2018', 9, main.canvas.height - 14, 'normal 13px/1 ' + main.fontFamily, light, 'left')
    }
}