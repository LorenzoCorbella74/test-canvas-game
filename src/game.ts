import { Enemy } from './enemies';
import { PowerUp } from './powerup';
import { ControlHandler } from './controller';
import { Player } from './player';
import { conf as c } from './config';
import { Camera } from './camera';
import { Map } from './maps';
import {Helper} from'./helper';

import {BulletHandler} from './bullet';
import { Particelle } from './particelle';
import { Blood } from './blood';

window.onload = function () {
    let app = new Game();
    app.loadMenuScreen(app);
};

export default class Game {

    // CANVAS
    canvas:            HTMLCanvasElement;
    ctx:               CanvasRenderingContext2D;
    width:             number = c.CANVAS_WIDTH; // window.innerWidth;
    height:            number = c.CANVAS_HEIGHT; // window.innerHeight;

    lastRender:number =0;
    fps:number =0;

    // GAME ENTITIES
    player:            Player;
    enemy:             Enemy;
    bullet:            BulletHandler;
    camera:            Camera;
    control:           ControlHandler;
    powerup:           PowerUp;
    particelle:        Particelle;
    blood:             Blood;
    currentMap:        Map;
    state:             string;
    timeleft:          number;

    // GAME PARAMETERS
    start:         boolean = true;      // flags that you want the countdown to start
    stopTime:      number  = 0;         // used to hold the stop time
    stop:          boolean = false;     // flag to indicate that stop time has been reached
    timeTillStop:  number  = 0;         // holds the display time
    killsToWin:    number  = c.GAME_KILLS_TO_WIN;
    matchDuration: number  = c.GAME_MATCH_DURATION;
    numberOfBots:  number  = c.GAME_BOTS_PER_MATCH;
    gameType:      string  = 'Deathmatch';           // TODO: sarà in seguito anche Team Deathmatch, Capture the flag, Skirmish
    data:          any;

    // UI
    fontFamily:        string = c.FONT_FAMILY;
    paused:boolean = false;

    constructor() {
        this.canvas        = <HTMLCanvasElement>document.getElementById('canvas');
        this.canvas.width  = this.width;
        this.canvas.height = this.height;
        this.ctx           = this.canvas.getContext("2d");
        
        this.player        = new Player(this);  // PLAYER
        this.enemy         = new Enemy(this);    // ENEMY
        this.bullet        = new BulletHandler(this);
        this.player.setShotHandler(this.bullet);
        this.enemy.setShotHandler(this.bullet);

        this.camera        = new Camera(0, 0, c.CANVAS_WIDTH, c.CANVAS_HEIGHT, this);
        this.control       = new ControlHandler(this);
        this.currentMap    = new Map(this);
        this.particelle    = new Particelle(this);
        this.powerup       = new PowerUp(this);
        this.blood         = new Blood(this);
        this.state         = 'loading';
        // si lega gli handler dei controlli al player
        this.player.setControlHandler(this.control);
        this.player.isFollowedBY(this.camera, this.currentMap);
        this.enemy.isFollowedBY(this.camera, this.currentMap);
        
        this.bullet.useIstance(this.currentMap, this.blood);
        
        // Camera is set to the player and on the default map
        this.camera.setCurrentMap(this.currentMap);
        this.camera.setCurrentPlayer(this.player);
    }

    // fa partire il gameloop
    startGame(restart:boolean = false) {
        this.state         = 'game';
        this.start         = true;      // flags that you want the countdown to start
        this.stopTime      = 0;         // used to hold the stop time
        this.stop          = false;     // flag to indicate that stop time has been reached
        this.timeTillStop  = 0;         // holds the display time
        this.killsToWin    = c.GAME_KILLS_TO_WIN;
        this.matchDuration = c.GAME_MATCH_DURATION;
        this.numberOfBots  = c.GAME_BOTS_PER_MATCH;
        this.canvas.style.cursor='crosshair';
        
        let botsArray = Array(this.numberOfBots).fill(null).map((e,i)=> i);
        this.data = this.currentMap.loadSpawnPointsAndPowerUps();
        
        botsArray.forEach((elem:any, index:number) => {
            let e = this.data.spawn[index];
            this.enemy.create(e.x,e.y, index); // si crea un nemico
        });
        
        // POWERUP
        this.data.powerup.forEach((e:any) => {
            this.powerup.create(e.x, e.y, e.type); // si crea il powerup
        });

        if(restart){
            this.player.respawn();
        }else{
            this.player.loadDefault();      // si inizializza il player
        }

        this.gameLoop(0);
    }

    private gameLoop(timestamp:number): void {

        this.canvas.style.cursor='crosshair';
        
        let progress = timestamp - this.lastRender;
        this.fps = Math.floor(1000/progress);

        if(this.start){                                     // do we need to start the timer
            this.stopTime = timestamp + this.matchDuration; // yes the set the stoptime
            this.start = false;                             // clear the start flag
        }else{                                              // waiting for stop
            if(timestamp >= this.stopTime){                 // has stop time been reached?
                this.stop = true;                           // yes the flag to stop
            }
        }
        this.timeTillStop = Math.floor(this.stopTime - timestamp)/1000;      // for display of time till stop

        if (this.state != 'game') {
            return
        }

        for (let i = 0; i < this.enemy.list.length; i++) {
            const bot = this.enemy.list[i];
            if (this.player.kills == this.killsToWin || bot.kills == this.killsToWin) {
                this.loadStatsScreen(this);
                return; 
            }
        }

        if(!this.paused){
            this.updateAll(progress);
            this.renderAll(progress);
        }
        
        this.lastRender = timestamp;
      
        if (!this.stop) {
            requestAnimationFrame(this.gameLoop.bind(this));
        } else {
            this.loadStatsScreen(this);
        }
    }

    updateAll(progress:number) {
        this.player.update(progress);
        this.camera.update(progress);
        this.enemy.update(progress);
        this.bullet.update(progress); 
        this.powerup.update(progress);
        this.particelle.update(progress);
        this.blood.update(progress);
        // particles:esplosioni
    }

    renderAll(progress:number): void {
        this.ctx.clearRect(0, 0, this.width, this.height);  // svuota il canvas
        this.currentMap.render(progress);
        this.player.render(progress);
        this.enemy.render(progress);
        this.bullet.render(progress); 
        this.powerup.render(progress);
        this.particelle.render(progress);
        this.blood.render(progress);
        // particles:esplosioni

        this.renderHUD(progress);   // HUD
    }

    private renderHUD(progress:number) {
        this.ctx.fillStyle = c.HUD_BACKGROUND;
        this.ctx.fillRect(0, 0, c.CANVAS_WIDTH, c.TILE_SIZE);
        this.ctx.textAlign = 'LEFT';
        this.ctx.font = 'bold 14px/1 Arial';
        this.ctx.fillStyle = '#565454';
        this.ctx.fillText('HP ', 5, c.TILE_SIZE / 2);
        this.ctx.fillText('AP ', 85, c.TILE_SIZE / 2);
        this.ctx.fillText('Kills ', 165, c.TILE_SIZE / 2);
        this.ctx.fillText('TIME ', 600, c.TILE_SIZE / 2);
        this.ctx.fillText('FPS ', 700, c.TILE_SIZE / 2);
        if(!this.player.alive){
            this.ctx.fillText('Respawn in ', 400, c.TILE_SIZE / 2);
        }
        this.ctx.font = 'bold 14px/1 Arial';
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillText(this.player.hp.toString(), 30, c.TILE_SIZE / 2);
        this.ctx.fillText(this.player.ap.toString(), 110, c.TILE_SIZE / 2);
        this.ctx.fillText(this.player.kills.toString(), 200, c.TILE_SIZE / 2);
        this.ctx.fillText(this.timeTillStop.toString(), 640, c.TILE_SIZE / 2);
        this.ctx.fillText(this.fps.toString(), 740, c.TILE_SIZE / 2);
        if (!this.player.alive) {
            this.timeleft = c.GAME_RESPAWN_TIME;
            /* let countDownTimer = setInterval(() => {
                this.timeleft--;
                if (this.timeleft < 0){
                    clearInterval(countDownTimer);
                }
            }, progress); */
            this.ctx.fillText(Math.round(this.timeleft/1000).toString(), 500, c.TILE_SIZE / 2);
        }
    }

    textONCanvas(context, text, x, y, font, style, align?, baseline?) {
        context.font = typeof font === 'undefined' ? 'normal 16px/1 Arial' : font;
        context.fillStyle = typeof style === 'undefined' ? '#000000' : style;
        context.textAlign = typeof align === 'undefined' ? 'center' : align;
        context.textBaseline = typeof baseline === 'undefined' ? 'middle' : baseline;
        context.fillText(text, x, y)
    }

    loadMenuScreen(main: any) {
        main.canvas.style.cursor='pointer';
        main.state = 'menuScreen';
        main.control.mouseLeft = false;
        main.ctx.clearRect(0, 0, main.canvas.width, main.canvas.height);
        var hW = main.canvas.width * 0.5;
        var hH = main.canvas.height * 0.5;
        var dark = 'rgba(0,0,0)';
        var medium = 'rgba(0,0,0)';
        var light = 'rgba(0,0,0)';
        this.textONCanvas(main.ctx, 'Corbe Shooter 2D', hW, hH - 100, 'normal 32px/1 ' + main.fontFamily, light, );
        this.textONCanvas(main.ctx, 'Use "WASD" to move and "Left Click" to shoot.', hW, hH - 30, 'normal 15px/1 ' + main.fontFamily, medium);
        this.textONCanvas(main.ctx, 'Use mouse wheel to change weapons.', hW, hH - 10, 'normal 15px/1 ' + main.fontFamily, medium);
        this.textONCanvas(main.ctx, 'Click to Start', hW, hH + 50, 'normal 17px/1 ' + main.fontFamily, dark);

        this.textONCanvas(main.ctx, 'L.Corbella © 2018', 9, main.canvas.height - 14, 'normal 13px/1 ' + main.fontFamily, light, 'left')
    }

    loadStatsScreen(main: any) {
        main.canvas.style.cursor='pointer';
        main.state = 'statsScreen';
        main.control.mouseLeft = false;
        main.ctx.clearRect(0, 0, main.canvas.width, main.canvas.height);
        var hW = main.canvas.width * 0.5;
        var hH = main.canvas.height * 0.5;
        var dark = 'rgba(0,0,0)';
        var medium = 'rgba(0,0,0)';
        var light = 'rgba(0,0,0)';
        this.textONCanvas(main.ctx, 'Corbe Shooter 2D',hW, hH - 100, 'normal 21px/1 ' + main.fontFamily, light);
        this.textONCanvas(main.ctx, 'Partita completata!', hW, hH - 70, 'normal 22px/1 ' + main.fontFamily, dark);
        this.textONCanvas(main.ctx, `${main.player.name} - ${main.player.kills} - ${main.player.numberOfDeaths}`, hW, hH - 30, 'normal 16px/1 ' + main.fontFamily, medium);
        for (let i = 0; i < this.enemy.list.length; i++) {
            const bot = this.enemy.list[i];
            this.textONCanvas(main.ctx, `${bot.name} - ${bot.kills} - ${bot.numberOfDeaths}`, hW, hH - 30 +(20*(i+1)), 'normal 16px/1 ' + main.fontFamily, medium);
        }
        this.textONCanvas(main.ctx, 'Click to Restart', hW, main.canvas.height - 44, 'normal 17px/1 ' + main.fontFamily, dark);
        this.textONCanvas(main.ctx, 'L.Corbella © 2018', 9, main.canvas.height - 14, 'normal 13px/1 ' + main.fontFamily, light, 'left')
    }
    
    // screen di pausa
    loadPauseScreen(main: any) {
        main.canvas.style.cursor='pointer';
        main.paused = true;
        main.control.mouseDown = false;
        main.ctx.fillStyle = 'rgba(255,255,255,0.65)';
        main.ctx.fillRect(0, 0, main.canvas.width, main.canvas.height);
        var hW = main.canvas.width * 0.5;
        var hH = main.canvas.height * 0.5;
        var dark = 'rgba(0,0,0,0.9)';
        var medium = 'rgba(0,0,0,0.5)';
        var light = 'rgba(0,0,0,0.3)';
        this.textONCanvas(main.ctx, 'Paused', hW, hH - 15, 'normal 22px/1 ' + main.fontFamily, dark);
        this.textONCanvas(main.ctx, 'Click to Continue', hW, hH + 15, 'normal 17px/1 ' + main.fontFamily, dark)
    }
}