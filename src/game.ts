import { Enemy } from './enemies';
import { PowerUp } from './powerup';
import { ControlHandler } from './controller';
import { Player } from './player';
import { Config } from './config';
import { Camera } from './camera';
import { Map } from './maps';
/* import {Helper} from'./helper'; */

import {BulletHandler} from './bullet';
import { Particelle } from './particelle';
import { Blood } from './blood';
import { Waypoints } from './waypoints';

window.onload = function () {
    let app = new Game();
    app.loadMenuScreen(app);
};

export default class Game {

    // CANVAS
    canvas:            HTMLCanvasElement;
    ctx:               CanvasRenderingContext2D;

    lastRender:number;
    fps:number;

    // GAME ENTITIES
    player:     Player;
    enemy:      Enemy;
    bullet:     BulletHandler;
    camera:     Camera;
    control:    ControlHandler;
    powerup:    PowerUp;
    waypoints:  Waypoints;
    particelle: Particelle;
    blood:      Blood;
    currentMap: Map;
    c:          Config;
    state:             string;
    timeleft:          number;

    // GAME PARAMETERS
    start:         boolean;     // flags that you want the countdown to start
    stopTime:      number;      // used to hold the stop time
    stop:          boolean;     // flag to indicate that stop time has been reached
    timeTillStop:  number;      // holds the display time
    killsToWin:    number;
    matchDuration: number;
    numberOfBots:  number;
    gameType:      string;           // TODO: sarà in seguito anche Team Deathmatch, Capture the flag, Skirmish
    data:          any;

    actors:any[];

    // UI
    fontFamily:        string;
    paused:boolean = false;
    debug:boolean = false;

    constructor() {
        this.canvas        = <HTMLCanvasElement>document.getElementById('canvas');
        this.canvas.height = 600; // window.innerHeight
        this.canvas.width  = 800; // window.innerWidth
        this.ctx           = this.canvas.getContext("2d");
        this.player        = new Player();  // PLAYER
        this.enemy         = new Enemy();    // ENEMY
        this.bullet        = new BulletHandler();
        this.camera        = new Camera();
        this.control       = new ControlHandler(this);
        this.currentMap    = new Map();
        this.particelle    = new Particelle();
        this.powerup       = new PowerUp();
        this.waypoints     = new Waypoints();
        this.blood         = new Blood();
        this.state         = 'loading';
    }
    
    // fa partire il gameloop
    startGame() {
        this.c                   = new Config();
        this.canvas.height       = this.c.CANVAS_HEIGHT; // window.innerHeight
        this.canvas.width        = this.c.CANVAS_WIDTH; // window.innerWidth
        this.state               = 'game';
        this.start               = true;      // flags that you want the countdown to start
        this.lastRender          = 0;         // ultimo timestamp
        this.fps                 = 0;
        this.stopTime            = 0;         // used to hold the stop time
        this.stop                = false;     // flag to indicate that stop time has been reached
        this.timeTillStop        = 0;         // holds the display time
        this.killsToWin          = this.c.GAME_KILLS_TO_WIN;
        this.matchDuration       = this.c.GAME_MATCH_DURATION;
        this.numberOfBots        = this.c.GAME_BOTS_PER_MATCH;
        this.gameType            = 'Deathmatch'
        this.canvas.style.cursor = 'crosshair';
        this.fontFamily          = this.c.FONT_FAMILY;
        this.actors              = [];
        
        
        // bots names
        let botsArray = Array(this.numberOfBots).fill(null).map((e,i)=> i);
        
        // init entities
        this.currentMap.init(this);
        this.player.init(this);
        this.camera.init(0, 0, this.c.CANVAS_WIDTH, this.c.CANVAS_HEIGHT, this);
        this.enemy.init(this);
        this.bullet.init(this);
        this.blood.init(this);
        this.particelle.init(this);
        this.powerup.init(this);
        this.waypoints.init(this);

        // loading spawnPoint + powerups + weapons
        this.data = this.currentMap.loadSpawnPointsAndPowerUps();

         // POWERUP & WEAPONS
         this.data.powerup
         .map((e:any,i:number)=>{
             e.index=i;
            return e;})  // si mette un indice
         .forEach((e:any, index:number) => {
            this.powerup.create(e.x, e.y, e.type, index); 
        });

         // waypoint
         this.data.waypoints
         .map((e:any,i:number)=>{
             e.index=i;
            return e;})  // si mette un indice
         .forEach((e:any, index:number) => {
            this.waypoints.create(e.x, e.y, index); 
        });

        // si inizializza il player
        this.player.createPlayer();      
        this.actors.push(this.player);
        
        // si crea i bots
        botsArray.forEach((elem:any, index:number) => {
            let e = this.data.spawn[index];
            let bot = this.enemy.create(e.x,e.y, index); // si crea un nemico
            this.actors.push(bot);
        });



        this.waypoints.linkToActors();

        

        requestAnimationFrame(this.gameLoop.bind(this));
    }

    private gameLoop(timestamp:number): void {

        this.canvas.style.cursor='crosshair';
        
        let dt = timestamp - this.lastRender;
        this.fps = Math.floor(1000/dt);

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
            this.updateAll(dt);
            this.renderAll(dt);
        }
        
        this.lastRender = timestamp;
      
        if (!this.stop) {
            requestAnimationFrame(this.gameLoop.bind(this));
        } else {
            this.loadStatsScreen(this);
            return;
        }
    }

    updateAll(dt:number) {
        this.player.update(dt);
        this.enemy.update(dt);
        this.camera.update(dt);
        this.bullet.update(dt); 
        this.powerup.update(dt);
        this.waypoints.update(dt);    // waypoints
        this.particelle.update(dt);
        this.blood.update(dt);
        // particles:esplosioni
    }

    renderAll(dt:number): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);  // svuota il canvas
        this.currentMap.render(dt);
        this.player.render(dt);
        this.enemy.render(dt);
        this.bullet.render(dt); 
        this.powerup.render(dt);
        this.waypoints.render(dt);    // waypoints
        this.particelle.render(dt);
        this.blood.render(dt);
        // particles:esplosioni

        this.renderHUD(dt);   // HUD
    }

    countDown(){
        let minutes, seconds;
        minutes = Math.floor(this.timeTillStop / 60);
        seconds = Math.floor(this.timeTillStop % 60);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        return  `${minutes}:${seconds}`;
    }

    private renderHUD(dt: number) {
        this.ctx.fillStyle = this.c.HUD_BACKGROUND;
        this.ctx.fillRect(0, 0, this.c.CANVAS_WIDTH, this.c.TILE_SIZE);
        this.ctx.textAlign = 'LEFT';
        this.ctx.font = 'bold 14px/1 Arial';
        this.ctx.fillStyle = '#565454';
        this.ctx.fillText('HP ', 5, this.c.TILE_SIZE / 2);
        this.ctx.fillText('AP ', 85, this.c.TILE_SIZE / 2);
        this.ctx.fillText('Kills ', 165, this.c.TILE_SIZE / 2);
        this.ctx.fillText(this.player.currentWeapon.name, 245, this.c.TILE_SIZE / 2);
        this.ctx.fillText('TIME ', 600, this.c.TILE_SIZE / 2);
        this.ctx.fillText('FPS ', 710, this.c.TILE_SIZE / 2);
        if (this.player.godMode) {
            this.ctx.fillText('god', 770, this.c.TILE_SIZE / 2);
        }
        this.ctx.font = 'bold 14px/1 Arial';
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillText(this.player.hp.toString(), 30, this.c.TILE_SIZE / 2);
        this.ctx.fillText(this.player.ap.toString(), 110, this.c.TILE_SIZE / 2);
        this.ctx.fillText(this.player.kills.toString(), 200, this.c.TILE_SIZE / 2);
        this.ctx.fillText(this.player.currentWeapon.shotNumber.toString(), 400, this.c.TILE_SIZE / 2);
        this.ctx.fillText(this.countDown(), 640, this.c.TILE_SIZE / 2);
        this.ctx.fillText(this.fps.toString(), 750, this.c.TILE_SIZE / 2);
        
        // RESPAWN MESSAGE
        if (!this.player.alive) {
            this.ctx.fillStyle = '#565454';
            this.ctx.font = 'bold 28px/1 Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`Respawn in ${Math.ceil((this.c.GAME_RESPAWN_TIME - this.player.respawnTime) / 1000).toString()}`, 400, 120);
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
        this.textONCanvas(main.ctx, 'Arena Shooter 2D', hW, hH - 100, 'normal 32px/1 ' + main.fontFamily, light, );
        this.textONCanvas(main.ctx, 'Use "WASD" to move and "Left Click" to shoot.', hW, hH - 30, 'normal 15px/1 ' + main.fontFamily, medium);
        this.textONCanvas(main.ctx, 'Use mouse wheel to change weapons.', hW, hH - 10, 'normal 15px/1 ' + main.fontFamily, medium);
        this.textONCanvas(main.ctx, 'P or ESC for pause screen (i for debug).', hW, hH + 10, 'normal 15px/1 ' + main.fontFamily, medium);
        this.textONCanvas(main.ctx, 'Click to Start', hW, hH + 80, 'normal 18px/1 ' + main.fontFamily, dark);

        this.textONCanvas(main.ctx, 'L.Corbella © 2018', 9, main.canvas.height - 14, 'normal 12px/1 ' + main.fontFamily, light, 'left')
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
        this.textONCanvas(main.ctx, 'Corbe Shooter 2D',hW, hH - 150, 'normal 42px/1 ' + main.fontFamily, light);
        this.textONCanvas(main.ctx, 'Partita completata!', hW, hH - 70, 'normal 22px/1 ' + main.fontFamily, dark);
        this.textONCanvas(main.ctx, `${main.player.name} - ${main.player.kills} - ${main.player.numberOfDeaths}`, hW, hH - 30, 'normal 16px/1 ' + main.fontFamily, medium);
        for (let i = 0; i < this.enemy.list.length; i++) {
            const bot = this.enemy.list[i];
            this.textONCanvas(main.ctx, `${bot.name} - ${bot.kills} - ${bot.numberOfDeaths}`, hW, hH - 30 +(20*(i+1)), 'normal 16px/1 ' + main.fontFamily, medium);
        }
        this.textONCanvas(main.ctx, 'Click to Restart', hW, main.canvas.height - 120, 'normal 18px/1 ' + main.fontFamily, dark);
        this.textONCanvas(main.ctx, 'L.Corbella © 2018', 9, main.canvas.height - 14, 'normal 12px/1 ' + main.fontFamily, light, 'left')
    }
    
    // screen di pausa
    loadPauseScreen(main: any) {
        main.canvas.style.cursor='pointer';
        main.paused = true;
        main.control.mouseDown = false;
        main.ctx.fillStyle = 'rgba(255,255,255,0.5)';
        main.ctx.fillRect(0, 0, main.canvas.width, main.canvas.height);
        var hW = main.canvas.width * 0.5;
        var hH = main.canvas.height * 0.5;
        var dark = 'rgba(0,0,0,0.9)';
        var medium = 'rgba(0,0,0,0.5)';
        var light = 'rgba(0,0,0,0.3)';
        this.textONCanvas(main.ctx, 'Paused', hW, hH - 60, 'normal 22px/1 ' + main.fontFamily, dark);
        this.textONCanvas(main.ctx, `${main.player.name} - ${main.player.kills} - ${main.player.numberOfDeaths}`, hW, hH - 30, 'normal 16px/1 ' + main.fontFamily, medium);
        for (let i = 0; i < this.enemy.list.length; i++) {
            const bot = this.enemy.list[i];
            this.textONCanvas(main.ctx, `${bot.name} - ${bot.kills} - ${bot.numberOfDeaths}`, hW, hH - 30 +(20*(i+1)), 'normal 16px/1 ' + main.fontFamily, medium);
        }
        this.textONCanvas(main.ctx, 'Click to Continue', hW, hH + 150   , 'normal 17px/1 ' + main.fontFamily, dark)
    }
}