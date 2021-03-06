import { Enemy } from './entities/enemies';
import { PowerUp } from './entities/powerup';
import { ControlHandler } from './controller';
import { Player } from './entities/player';
import { Config } from './config';
import { Camera } from './camera';
import { Map } from './maps';
import { BulletHandler } from './entities/bullet';
import { Particelle } from './entities/particelle';
import { Blood } from './entities/blood';
import { Waypoints } from './entities/waypoints';

import * as EasyStar from 'easystarjs'

window.onload = function () {
    let app = new Game();
    app.loadMenuScreen(app);
};

export default class Game {

    // CANVAS
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    lastRender: number;
    fps: number;

    // GAME ENTITIES
    player: Player;
    enemy: Enemy;
    bullet: BulletHandler;
    camera: Camera;
    control: ControlHandler;
    powerup: PowerUp;
    waypoints: Waypoints;
    particelle: Particelle;
    blood: Blood;
    currentMap: Map;
    c: Config;
    state: string;
    timeleft: number;

    // GAME PARAMETERS
    start: boolean;     // flags that you want the countdown to start
    stopTime: number;      // used to hold the stop time
    stop: boolean;     // flag to indicate that stop time has been reached
    timeTillStop: number;      // holds the display time
    killsToWin: number;
    matchDuration: number;
    numberOfBots: number;
    gameType: string;           // TODO: sarà in seguito anche Team Deathmatch, Capture the flag, Skirmish
    data: any;

    actors: any[];

    fragMessage: string;
    durationfragMessage: number;

    // A* PATHFINDING
    easystar: any;

    // UI
    fontFamily: string;
    paused: boolean = false;
    debug: boolean = false;

    constructor() {
        this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        this.canvas.height = 600; // window.innerHeight
        this.canvas.width = 800; // window.innerWidth
        this.ctx = this.canvas.getContext("2d");
        this.player = new Player();  // PLAYER
        this.enemy = new Enemy();    // ENEMY
        this.bullet = new BulletHandler();
        this.camera = new Camera();
        this.control = new ControlHandler(this);
        this.currentMap = new Map();
        this.particelle = new Particelle();
        this.powerup = new PowerUp();
        this.waypoints = new Waypoints();
        this.blood = new Blood();
        this.state = 'loading';

        this.scaleToWindow();
        // window.addEventListener("resize", this.resize.bind(this));
    }

    resize() {
        this.scaleToWindow();
    }

    // fa partire il gameloop
    startGame(gametype: string = 'deathmatch') {
        this.c = new Config();
        this.canvas.height = this.c.CANVAS_HEIGHT; // window.innerHeight
        this.canvas.width = this.c.CANVAS_WIDTH; // window.innerWidth
        this.state = 'game';
        this.start = true;      // flags that you want the countdown to start
        this.lastRender = 0;         // ultimo timestamp
        this.fps = 0;
        this.stopTime = 0;         // used to hold the stop time
        this.stop = false;     // flag to indicate that stop time has been reached
        this.timeTillStop = 0;         // holds the display time
        this.killsToWin = this.c.GAME_KILLS_TO_WIN;
        this.matchDuration = this.c.GAME_MATCH_DURATION;
        this.numberOfBots = this.c.GAME_BOTS_PER_MATCH;
        this.gameType = gametype;
        this.canvas.style.cursor = 'crosshair';
        this.fontFamily = this.c.FONT_FAMILY;
        this.actors = [];
        this.easystar = {};

        this.fragMessage = '';
        this.durationfragMessage = 0;


        // bots names
        let botsArray = Array(this.numberOfBots).fill(null).map((e, i) => i);

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
            .map((e: any, i: number) => {
                e.index = i;
                return e;
            })  // si mette un indice
            .forEach((e: any, index: number) => {
                this.powerup.create(e.x, e.y, e.type, index);
            });

        // waypoint
        this.data.waypoints
            .map((e: any, i: number) => {
                e.index = i;
                return e;
            })  // si mette un indice
            .forEach((e: any, index: number) => {
                this.waypoints.create(e.x, e.y, index);
            });

        // si inizializza il player
        this.player.createPlayer();
        this.actors[0] = this.player;

        // si crea i bots
        botsArray.forEach((elem: any, index: number) => {
            let e = this.data.spawn[index];
            let bot = this.enemy.create(e.x, e.y, index, this.defineTeams(index)); // si crea un nemico
            this.actors[this.actors.length] = bot;
        });

        this.waypoints.linkToActors();

        this.easystar = new EasyStar.js();
        this.easystar.setGrid(this.currentMap.map);
        // Get the walkable tile indexes
        this.easystar.setAcceptableTiles([0, 2, 10, 11, 12, 13, 14, 15, 16, 23, 24, 25, 27, 29, 34, 35, 37, 39, 40]);
        this.easystar.enableDiagonals();
        this.easystar.enableCornerCutting();

        requestAnimationFrame(this.gameLoop.bind(this));
    }

    defineTeams(index: number) {
        if (this.gameType == 'deathmatch') {   // tutti i bot hanno un team diverso...
            return `team${index + 2}`;
        } else {    // per teamDeathMatch e CTF
            if (index < Math.floor(this.c.GAME_BOTS_PER_MATCH / 2) + 1) {
                return `team2`;
            } else {
                return `team1`;
            }
        }
    }

    private gameLoop(timestamp: number): void {

        this.canvas.style.cursor = 'crosshair';

        let dt = timestamp - this.lastRender;
        this.fps = Math.floor(1000 / dt);

        if (this.start) {                                     // do we need to start the timer
            this.stopTime = timestamp + this.matchDuration; // yes the set the stoptime
            this.start = false;                             // clear the start flag
        } else {                                              // waiting for stop
            if (timestamp >= this.stopTime) {                 // has stop time been reached?
                this.stop = true;                           // yes the flag to stop
            }
        }
        this.timeTillStop = Math.floor(this.stopTime - timestamp) / 1000;      // for display of time till stop

        if (this.state != 'game') {
            return
        }

        if (this.fragMessage) {
            this.durationfragMessage += dt;
        }

        if (this.durationfragMessage > 1500) {
            this.fragMessage = '';
            this.durationfragMessage = 0;
        }

        for (let i = 0; i < this.enemy.list.length; i++) {
            const bot = this.enemy.list[i];
            if (this.player.kills == this.killsToWin || bot.kills == this.killsToWin) {
                this.loadStatsScreen(this);
                return;
            }
        }

        if (!this.paused) {
            this.updateAll(dt, timestamp);
            this.renderAll();
        }

        this.lastRender = timestamp;

        if (!this.stop) {
            requestAnimationFrame(this.gameLoop.bind(this));
        } else {
            this.loadStatsScreen(this);
            return;
        }
    }

    updateAll(dt: number, timestamp: number) {
        this.player.update(dt, timestamp);
        this.enemy.update(dt, timestamp);
        this.camera.update(dt, timestamp);
        this.bullet.update(dt, timestamp);
        this.powerup.update(dt, timestamp);
        this.waypoints.update(dt, timestamp);    // waypoints
        this.particelle.update(dt, timestamp);
        this.blood.update(dt, timestamp);
        // particles:esplosioni
    }

    renderAll(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);  // svuota il canvas
        this.currentMap.render();
        this.player.render();
        this.enemy.render();
        this.bullet.render();
        this.powerup.render();
        this.waypoints.render();    // waypoints
        this.particelle.render();
        this.blood.render();
        // particles:esplosioni

        this.renderHUD();   // HUD
    }

    countDown() {
        let minutes, seconds;
        minutes = Math.floor(this.timeTillStop / 60);
        seconds = Math.floor(this.timeTillStop % 60);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        return `${minutes}:${seconds}`;
    }

    private renderHUD() {
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
        this.ctx.fillText(this.player.currentWeapon.shotNumber.toString(), 310, this.c.TILE_SIZE / 2);
        this.ctx.fillText(this.countDown(), 640, this.c.TILE_SIZE / 2);
        this.ctx.fillText(this.fps.toString(), 750, this.c.TILE_SIZE / 2);

        // RESPAWN MESSAGE
        if (!this.player.alive) {
            this.ctx.fillStyle = '#565454';
            this.ctx.font = 'bold 28px/1 Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`Respawn in ${Math.ceil((this.c.GAME_RESPAWN_TIME - this.player.respawnTime) / 1000).toString()}`, 400, 120);
        }

        // FRAG MESSAGE
        if (this.fragMessage) {
            this.ctx.fillStyle = '#565454';
            this.ctx.font = 'bold 20px/1 Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(this.fragMessage, 400, 120);
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

        let gameType: string;

        main.canvas.addEventListener('click', (e: any) => {
            const rect = this.canvas.getBoundingClientRect();
            const pos = {
                x: (e.clientX - rect.left) / this.scale,
                y: (e.clientY - rect.top) / this.scale
            };
            if (deathBtn.contains(pos.x, pos.y)) {
                gameType = 'deathmatch'
            }
            if (teamBtn.contains(pos.x, pos.y)) {
                gameType = 'team';
            }
            if (playBtn.contains(pos.x, pos.y)) {
                this.startGame(gameType);
            }
        })

        main.canvas.style.cursor = 'pointer';
        main.state = 'menuScreen';
        main.control.mouseLeft = false;
        main.ctx.clearRect(0, 0, main.canvas.width, main.canvas.height);
        var hW = main.canvas.width * 0.5;
        var hH = main.canvas.height * 0.5;
        var dark = 'rgba(0,0,0)';
        var medium = 'rgba(0,0,0)';
        var light = 'rgba(0,0,0)';
        this.textONCanvas(main.ctx, 'Arena Shooter 2D', hW, hH - 100, 'normal 36px/1 ' + main.fontFamily, light,);
        this.textONCanvas(main.ctx, 'Use "WASD" to move and "Left Click" to shoot.', hW, hH - 30, 'normal 15px/1 ' + main.fontFamily, medium);
        this.textONCanvas(main.ctx, 'Use mouse wheel to change weapons.', hW, hH - 10, 'normal 15px/1 ' + main.fontFamily, medium);
        this.textONCanvas(main.ctx, 'P or ESC for pause screen (i for debug, g for godmode, b to cycle camera).', hW, hH + 10, 'normal 15px/1 ' + main.fontFamily, medium);
        // this.textONCanvas(main.ctx, 'Click to Start', hW, hH + 80, 'normal 18px/1 ' + main.fontFamily, dark);

        this.textONCanvas(main.ctx, 'L.Corbella © 2018', 9, main.canvas.height - 14, 'normal 12px/1 ' + main.fontFamily, light, 'left');

        let deathBtn = new MyBTN(150, 350, 200, 100);
        deathBtn.draw(main.ctx);
        this.textONCanvas(main.ctx, 'DeathMatch', 250, 375, 'normal 15px/1 ' + main.fontFamily, medium);

        let teamBtn = new MyBTN(450, 350, 200, 100);
        teamBtn.draw(main.ctx);
        this.textONCanvas(main.ctx, 'Team DeathMatch', 550, 375, 'normal 15px/1 ' + main.fontFamily, medium);
        let playBtn = new MyBTN(300, 475, 200, 100);
        playBtn.draw(main.ctx);

        this.textONCanvas(main.ctx, 'Click to start', 400, 525, 'normal 15px/1 ' + main.fontFamily, medium);
    }

    loadStatsScreen(main: any) {
        main.canvas.style.cursor = 'pointer';
        main.state = 'statsScreen';
        main.control.mouseLeft = false;
        main.ctx.clearRect(0, 0, main.canvas.width, main.canvas.height);
        var hW = main.canvas.width * 0.5;
        var hH = main.canvas.height * 0.5;
        var dark = 'rgba(0,0,0)';
        var medium = 'rgba(0,0,0)';
        var light = 'rgba(0,0,0)';
        this.textONCanvas(main.ctx, 'Corbe Shooter 2D', hW, hH - 150, 'normal 42px/1 ' + main.fontFamily, light);
        this.textONCanvas(main.ctx, 'Partita completata!', hW, hH - 70, 'normal 22px/1 ' + main.fontFamily, dark);
        // this.textONCanvas(main.ctx, `${main.player.name} - ${main.player.kills} - ${main.player.numberOfDeaths}`, hW, hH - 30, 'normal 16px/1 ' + main.fontFamily, medium);
        // for (let i = 0; i < this.enemy.list.length; i++) {
        //     const bot = this.enemy.list[i];
        //     this.textONCanvas(main.ctx, `${bot.name} - ${bot.kills} - ${bot.numberOfDeaths}`, hW, hH - 30 +(20*(i+1)), 'normal 16px/1 ' + main.fontFamily, medium);
        // }
        this.actors = this.actors.sort((obj1, obj2) => obj2.kills - obj1.kills);
        for (let i = 0; i < this.actors.length; i++) {
            const actor = this.actors[i];
            this.textONCanvas(main.ctx, `${actor.name} - ${actor.kills} - ${actor.numberOfDeaths}`, hW, hH - 30 + (20 * (i + 1)), 'normal 16px/1 ' + main.fontFamily, medium);
        }
        this.textONCanvas(main.ctx, 'Click to Restart', hW, main.canvas.height - 120, 'normal 18px/1 ' + main.fontFamily, dark);
        this.textONCanvas(main.ctx, 'L.Corbella © 2018', 9, main.canvas.height - 14, 'normal 12px/1 ' + main.fontFamily, light, 'left')
    }

    // screen di pausa
    loadPauseScreen(main: any) {
        main.canvas.style.cursor = 'pointer';
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
        // this.textONCanvas(main.ctx, `${main.player.name} - ${main.player.kills} - ${main.player.numberOfDeaths}`, hW, hH - 30, 'normal 16px/1 ' + main.fontFamily, medium);
        // for (let i = 0; i < this.enemy.list.length; i++) {
        //     const bot = this.enemy.list[i];
        //     this.textONCanvas(main.ctx, `${bot.name} - ${bot.kills} - ${bot.numberOfDeaths}`, hW, hH - 30 +(20*(i+1)), 'normal 16px/1 ' + main.fontFamily, medium);
        // }
        this.actors = this.actors.sort((obj1, obj2) => obj2.kills - obj1.kills);
        for (let i = 0; i < this.actors.length; i++) {
            const actor = this.actors[i];
            this.textONCanvas(main.ctx, `${actor.name} - ${actor.kills} - ${actor.numberOfDeaths}`, hW, hH - 30 + (20 * (i + 1)), 'normal 16px/1 ' + main.fontFamily, medium);
        }
        this.textONCanvas(main.ctx, 'Click to Continue', hW, hH + 150, 'normal 17px/1 ' + main.fontFamily, dark)
    }

    scaleToWindow() {

        let scaleX, scaleY, scale, center;

        //1. Scale the canvas to the correct size
        //Figure out the scale amount on each axis
        scaleX = window.innerWidth / this.canvas.width;
        scaleY = window.innerHeight / this.canvas.height;

        //Scale the canvas based on whichever value is less: `scaleX` or `scaleY`
        scale = Math.min(scaleX, scaleY);
        this.canvas.style.transformOrigin = "0 0";
        this.canvas.style.transform = "scale(" + scale + ")";

        //2. Center the canvas.
        //Decide whether to center the canvas vertically or horizontally.
        //Wide canvases should be centered vertically, and 
        //square or tall canvases should be centered horizontally
        /* 
                if (this.canvas.width > this.canvas.height) {
                    center = "vertically";
                } else {
                    center = "horizontally";
                }
        
                //Center horizontally (for square or tall canvases)
                if (center === "horizontally") {
                    let margin = (window.innerWidth - this.canvas.width * scaleY) / 2;
                    this.canvas.style.marginLeft = margin + "px";
                    this.canvas.style.marginRight = margin + "px";
                }
        
                //Center vertically (for wide canvases) 
                if (center === "vertically") {
                    let margin = (window.innerHeight - this.canvas.height * scaleX) / 2;
                    this.canvas.style.marginTop = margin + "px";
                    this.canvas.style.marginBottom = margin + "px";
                } */

        //3. Remove any padding from the canvas and set the canvas
        //display style to "block"
        this.canvas.style.paddingLeft = '0';
        this.canvas.style.paddingRight = '0';
        this.canvas.style.display = "block";

        //4. Set the color of the HTML body background
        /* document.body.style.backgroundColor = backgroundColor; */

        //5. Set the game engine and pointer to the correct scale. 
        //This is important for correct hit testing between the pointer and sprites
        /* this.pointer.scale = scale;*/
        this.scale = scale;

        //Fix some quirkiness in scaling for Safari
        /*
        let ua = navigator.userAgent.toLowerCase(); 
        if (ua.indexOf('safari') != -1) { 
          if (ua.indexOf('chrome') > -1) {
            // Chrome
          } else {
            // Safari
            this.canvas.style.maxHeight = "100%";
            this.canvas.style.minHeight = "100%";
          }
        }
        */
    }

}

export class MyBTN {

    x: number;
    y: number;
    width: number;
    height: number;


    constructor(x: number, y: number, w: number, h: number) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }

    contains(x: number, y: number) {
        return this.x <= x && x <= this.x + this.width &&
            this.y <= y && y <= this.y + this.height;
    }

    draw(ctx: any) {
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
    }
}