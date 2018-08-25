import { BrainFSM } from './brain';
import { Helper } from './helper'

import * as EasyStar from 'easystarjs'

    
export class Enemy {

    // entities
    canvas: any;
    ctx:    any;
    camera: any;
    main:   any;
    c:      any;
    player: any;
    map:    any
    bullet: any;

    list: any;

    constructor() { }

    init(main: any) {
        this.list   = [];
        this.main   = main;
        this.c      = main.c;
        this.player = main.player;
        this.canvas = main.canvas;
        this.camera = main.camera;
        this.map    = main.currentMap;
        this.bullet = main.bullet;
        this.ctx    = main.ctx;
    }

    create(x: number, y: number, num: number) {
        let bot:any         = new Object();
        bot.brain           = new BrainFSM();
        bot.index           = num;
        bot.name            = Helper.getBotsName(this.c.ENEMY_NAMES);
        bot.x               = x || 75;
        bot.y               = y || 50;
        bot.r               = this.c.ENEMY_RADIUS;
        bot.old_x           = x;
        bot.old_y           = y;
        bot.velX            = 0;
        bot.velY            = 0;
        bot.alive           = true;
        bot.speed           = this.c.ENEMY_SPEED;
        bot.angleWithTarget = 0;
        bot.hp              = this.c.ENEMY_HP;
        bot.ap              = this.c.ENEMY_AP;
        bot.attackCounter   = 0;
        bot.shootRate       = 200;
        bot.damage          = 1;		// è per il moltiplicatore del danno (quad = 4)
        bot.kills           = 0;
        bot.numberOfDeaths  = 0;
        bot.target          = {};
        bot.aggression      = Math.random()*1/3 +2/3;
        bot.targetItem      = {};
        bot.trails          = [];
        this.list[this.list.length] = bot;
        bot.brain.pushState(this.spawn.bind(this));
        bot.status='spawn';
        bot.path =[];
        return bot;
    };

    respawn(bot: any) {
        const spawn = Helper.getSpawnPoint(this.main.data.spawn);
        console.log(`BOT ${bot.index} is swawning at ${spawn.x-this.camera.x} - ${spawn.y-this.camera.y}`);
        bot.x = spawn.x;
        bot.y = spawn.y;
        bot.r = this.c.ENEMY_RADIUS;
        bot.velX = 0;
        bot.velY = 0;
        bot.speed = this.c.ENEMY_SPEED;	// è uguale in tutte le direzioni
        bot.damage = 1;					// è il moltiplicatore del danno (quad = 4)
        bot.angleWithTarget = 0;		// angolo tra asse x e precedente target
        bot.hp = this.c.PLAYER_HP;		// punti vita
        bot.ap = this.c.PLAYER_AP;		// punti armatura
        bot.alive = true;			    // il bot è nuovamente presente in gioco
        // this.kills = 0;				// si mantengono...
        // this.numberOfDeaths = 0;	    // si mantengono...
        bot.target                  = {};
        bot.targetItem              = {};
        bot.trails                  = [];
        bot.path                    = [];
        bot.attackCounter = 0;
        bot.status='spawn';
        bot.currentWeapon = this.c.PLAYER_STARTING_WEAPON;		// arma corrente
        bot.brain.pushState(this.spawn.bind(this));
    }

    private getBotColour(bot:any){
		if(bot.speed>5){
			return 'yellow';
		}
		if(bot.damage>1){
			return 'violet';
		}
		return this.c.ENEMY_COLOUR_INSIDE;
	}

    render(dt: number) {
        for (let i = this.list.length - 1; i >= 0; i--) {
            const bot = this.list[i];
            if (bot.alive) {
                // trails
                for (let i = 0; i < bot.trails.length; i++) {
                    let ratio = (i + 1) / bot.trails.length;
                    this.ctx.beginPath();
                    this.ctx.arc(bot.trails[i].x - this.camera.x, bot.trails[i].y - this.camera.y, ratio * bot.r *(3/ 5) + bot.r *(2/ 5), 0, 2 * Math.PI, true);
                    this.ctx.fillStyle = this.ctx.fillStyle = `rgb(127, 134, 135,${ratio/2})`;
                    this.ctx.fill();
                }

                // draw the colored region
                this.ctx.beginPath();
                this.ctx.arc(bot.x - this.camera.x, bot.y - this.camera.y, bot.r, 0, 2 * Math.PI, true);
                this.ctx.fillStyle = this.getBotColour(bot);;
                this.ctx.fill();

                // draw the stroke
                this.ctx.lineWidth = 2;
                this.ctx.strokeStyle = this.c.ENEMY_COLOUR_OUTSIDE;
                this.ctx.stroke();

                // beccuccio arma
                this.ctx.strokeStyle = this.c.ENEMY_COLOUR_OUTSIDE;
                this.ctx.beginPath();
                this.ctx.moveTo(bot.x - this.camera.x, bot.y - this.camera.y);
                var pointerLength = this.c.ENEMY_RADIUS;
                this.ctx.lineTo(
                    bot.x - this.camera.x + pointerLength * Math.cos(bot.angleWithTarget),
                    bot.y - this.camera.y + pointerLength * Math.sin(bot.angleWithTarget)
                );
                this.ctx.stroke();

                //if (this.main.debug) {
                    this.ctx.font = 'bold 8px/1 Arial';
                    this.ctx.fillStyle = 'white';
                    this.ctx.fillText(bot.hp.toString(), bot.x - this.camera.x - 5, bot.y - this.camera.y);
                    this.ctx.fillStyle = 'black';
                    this.ctx.fillText(bot.index.toString(), bot.x - this.camera.x - 25, bot.y - this.camera.y -16);
                    this.ctx.fillText(bot.target && bot.target.index? bot.target.index.toString():'', bot.x - this.camera.x + 6, bot.y - this.camera.y +20);
                    this.ctx.fillText(bot.target && bot.target.dist? bot.target.dist.toString():'', bot.x - this.camera.x + 22, bot.y - this.camera.y +36);
                    this.ctx.fillText(bot && bot.aggression? bot.aggression.toFixed(2).toString():'', bot.x - this.camera.x + 22, bot.y - this.camera.y +20);
                    this.ctx.fillText(bot.targetItem && bot.targetItem.index? bot.targetItem.index.toString():'', bot.x - this.camera.x + 10, bot.y - this.camera.y -20);
                    this.ctx.fillText(bot.status, bot.x - this.camera.x -25, bot.y - this.camera.y +20);
                //}
            }
        }
    }

    // collisione tra elementi della stessa dimensione (tile e player)
    // SOURCE: https://codereview.stackexchange.com/questions/60439/2d-tilemap-collision-method
    checkmove(x: number, y: number): boolean {
        if (this.map.map[Math.floor(y / this.c.TILE_SIZE)][Math.floor(x / this.c.TILE_SIZE)] == 1
            || this.map.map[Math.floor(y / this.c.TILE_SIZE)][Math.ceil(x / this.c.TILE_SIZE)] == 1
            || this.map.map[Math.ceil(y / this.c.TILE_SIZE)][Math.floor(x / this.c.TILE_SIZE)] == 1 
            || this.map.map[Math.ceil(y / this.c.TILE_SIZE)][Math.ceil(x / this.c.TILE_SIZE)] == 1) {
            return false;
        } else {
            return true;
        }
    }

    

    getRandomDirection(bot:any){
        return Helper.randomElementInArray([bot.velX, -bot.velY, bot.velY, -bot.velX]);
    }

    isLavaOrToxic(bot:any, x: number, y: number): void {
		if (this.map.map[Math.floor(y / this.c.TILE_SIZE)][Math.floor(x / this.c.TILE_SIZE)] == 3
			|| this.map.map[Math.floor(y / this.c.TILE_SIZE)][Math.ceil(x / this.c.TILE_SIZE)] == 3
			|| this.map.map[Math.ceil(y / this.c.TILE_SIZE)][Math.floor(x / this.c.TILE_SIZE)] == 3
			|| this.map.map[Math.ceil(y / this.c.TILE_SIZE)][Math.ceil(x / this.c.TILE_SIZE)] == 3
			|| this.map.map[Math.floor(y / this.c.TILE_SIZE)][Math.floor(x / this.c.TILE_SIZE)] == 4
			|| this.map.map[Math.floor(y / this.c.TILE_SIZE)][Math.ceil(x / this.c.TILE_SIZE)] == 4
			|| this.map.map[Math.ceil(y / this.c.TILE_SIZE)][Math.floor(x / this.c.TILE_SIZE)] == 4
			|| this.map.map[Math.ceil(y / this.c.TILE_SIZE)][Math.ceil(x / this.c.TILE_SIZE)] == 4
		) {
            bot.hp -=0.5;
            for (var j = 0; j < 24; j++) {
				this.main.particelle.create(bot.x + Helper.randBetween(-bot.r,bot.r), bot.y + Helper.randBetween(-bot.r,bot.r), Math.random() * 2 - 2, Math.random() * 2 - 2, 2 , '#FFA500')
            }
            if (bot.hp <= 0) {
				bot.alive = false;
				bot.numberOfDeaths++;
				for (let b = 0; b < 36; b++) {
					this.main.blood.create(bot.x, bot.y, Math.random() * 2 - 2, Math.random() * 2 - 2, this.c.BLOOD_RADIUS) // crea il sangue
				}
                console.log(`Bot killed by lava.`);
                setTimeout(() => {
                    this.respawn(bot);
                }, this.c.GAME_RESPAWN_TIME);
			}
		}
    }
    
    storePosForTrail(bot:any) {
		// push an item
		bot.trails.push({ x:bot.x, y:bot.y });
		//get rid of first item
		if (bot.trails.length > this.c.MOTION_TRAILS_LENGTH) {
			bot.trails.shift();
		}
	}

    checkCollision(bot:any){
        if (bot.velY<0) { // W 
            if (this.checkmove(bot.x - bot.r, bot.y - bot.r - bot.speed) ) {
                //bot.y -= bot.speed;
                if (bot.y - bot.r < this.camera.y) {
                    bot.y = this.camera.y + bot.r;
                }
                // collisione con il player
                // if (Helper.circleCollision(bot, bot.target)) {
                //     bot.target.y -= 4 * bot.speed;
                //     bot.y += 2 * bot.target.speed;
                // }
            } else {
                //bot.target = null;
                bot.y =bot.old_y +0.01;
            }
        }
        if (bot.velY>0) {	// S
            if (this.checkmove(bot.x - bot.r, bot.y - bot.r + bot.speed) ){
                //bot.y += bot.speed;
                if (bot.y + bot.r >= this.camera.y + this.camera.h) {
                    bot.y = this.camera.y + this.camera.h - bot.r;
                }
                // collisione con il player
                // if (Helper.circleCollision(bot, bot.target)) {
                //     bot.target.y += 4 * bot.speed;
                //     bot.y -= 2 * bot.target.speed;
                // }
            } else {
                //bot.target = null;
                bot.y =bot.old_y -0.01;
            }
        }
        if (bot.velX<0) {	// a
            if (this.checkmove(bot.x - bot.r - bot.speed, bot.y - bot.r)){
               //bot.x -= bot.speed;
                if (bot.x - bot.r < this.camera.x) {
                    bot.x = this.camera.x + bot.r;
                }
                // collisione con il player
                // if (Helper.circleCollision(bot, bot.target)) {
                //     bot.target.x -= 4 * bot.speed;
                //     bot.x += 2 * bot.target.speed;
                // }
            } else {
                //bot.target = null;
            bot.x = bot.old_x +0.01;
            }
        }
        if (bot.velX>0) {	// d    
            if (this.checkmove(bot.x - bot.r + bot.speed, bot.y - bot.r) ){
                //bot.x += bot.speed;
                if (bot.x + bot.r >= this.map.mapSize.w) {
                    bot.x = this.camera.x + this.camera.w - bot.r;
                }
                // collisione con il player 
                // if (Helper.circleCollision(bot, bot.target)) {
                //     bot.target.x += 4 * bot.speed;
                //     bot.x -= 2 * bot.target.speed;
                // }
            } else {
               // bot.target = null;
                bot.x = bot.old_x -0.01;
            }
        }
         this.storePosForTrail(bot);
    }




    // SOURCE: https://www.redblobgames.com/grids/line-drawing.html (walk_grid ) 
    checkIfIsSeen2(p0:any, p1:any) {
        var dx = p1.x-p0.x, dy = p1.y-p0.y;
        var nx = Math.abs(dx), 
            ny = Math.abs(dy);
        var sign_x = dx > 0? 1 : -1, sign_y = dy > 0? 1 : -1;
        var p = {x: p0.x, y :p0.y};
        var points = [{x:p.x, y: p.y}];
        for (var ix = 0, iy = 0; ix < nx || iy < ny;) {
            if ((0.5+ix) / nx < (0.5+iy) / ny) {
                // next step is horizontal
                p.x += sign_x;
                ix++;
            } else {
                // next step is vertical
                p.y += sign_y;
                iy++;
            }
            points.push({x: p.x, y: p.y});
        }
        //console.log(points);
        //return points;
        let output = true;
        for (let i = 0; i < points.length; i++) {
            const ele = points[i];
            if (this.map.map[Math.floor(ele.y / this.c.TILE_SIZE)][Math.floor(ele.x / this.c.TILE_SIZE)] == 1) {
                output = false;
                break;
            }
        }
        return output;
    }

    /* -------------------------------------------------------------------------------------- */

    update(dt: number) {
        for (let i = this.list.length - 1; i >= 0; i--) {
            const bot = this.list[i];
            if(bot.alive){
                bot.brain.update(bot, dt);
                this.isLavaOrToxic(bot, bot.x, bot.y);
                this.checkCollision(bot);
            }
        }
    }

    spawn(bot: any, dt: number) {
        bot.status ='spawn';
        let opponentData = this.getNearestVisibleEnemy(bot, this.main.actors);
        bot.target = opponentData.elem;
        bot.distanceWIthTarget = opponentData.dist;
        if (bot.target && bot.target.alive /* && bot.distanceWIthTarget < 350 */) {
            bot.brain.pushState(this.chaseTarget.bind(this));
        } else {
            bot.brain.pushState(this.wander.bind(this));
        }
    }
    
    chaseTarget(bot: any, dt: number) {
        bot.status ='chasing';
        bot.angleWithTarget = Helper.calculateAngle(bot.x, bot.y, bot.target.x, bot.target.y);

        if (bot.target && bot.target.alive) {

            // We need to get the distance
            var tx = bot.target.x - bot.x,
                ty = bot.target.y - bot.y,
                dist = Math.sqrt(tx * tx + ty * ty);
                bot.old_x = bot.x;
                bot.old_y = bot.y;

            // da 350 a 225 ci si avvicina al target
            if (dist > 225 /* && bot.aggression>0.55 || dist > 225 && bot.hp>40 */) {
                bot.velX = (tx / dist);
                bot.velY = (ty / dist);
            }
            if (dist > 125 && dist < 225) { // comportamento random
                bot.velX = Math.random()<0.95? bot.velX: this.getRandomDirection(bot); //(ty / dist) *Math.cos(bot.angleWithTarget);
                bot.velY = Math.random()<0.95? bot.velY:this.getRandomDirection(bot); // Math.sin(bot.angleWithTarget);
            }
            if (dist < 125 && bot.aggression<0.90) { // retreat
                bot.velX = -(tx / dist);
                bot.velY = -(ty / dist);
            }else{
                bot.velX = Math.random()<0.5? bot.velX: this.getRandomDirection(bot); //(ty / dist) *Math.cos(bot.angleWithTarget);
                bot.velY = Math.random()<0.5? bot.velY:this.getRandomDirection(bot); // Math.sin(bot.angleWithTarget);
            }
            bot.x += bot.velX * bot.speed;
            bot.y += bot.velY * bot.speed;
            
            this.shot(bot, dist);
        } else{
            bot.brain.pushState(this.wander.bind(this));
        }
    }

    // TODO: https://stackoverflow.com/questions/24378155/random-moving-position-for-sprite-image

    wander(bot: any, dt: number) {

        bot.status = 'wander';
        let opponentData = this.getNearestVisibleEnemy(bot, this.main.actors);
        bot.target = opponentData.elem;
        bot.distanceWIthTarget = opponentData.dist;

        if (bot.target && bot.target.alive /* && bot.distanceWIthTarget < 350 */) {
            bot.brain.pushState(this.chaseTarget.bind(this));
        } else {
            bot.attackCounter = 0;
            bot.angleWithTarget = 0;

            // se non si ha un target si va alla ricerca dei powerup
            bot.targetItem = this.getNearestPowerup(bot, this.main.powerup.list) || this.getNearestWaypoint(bot, this.main.waypoints.list); // il targetItem sono sia i powerUp che i waypoints

            // EASYSTAR*.js
            if (bot.alive && bot.targetItem) {

                // Create a path finding thing
                const easystar = new EasyStar.js();
                easystar.setGrid(this.main.currentMap.map);

                // Get the walkable tile indexes
                easystar.setAcceptableTiles([0, 2, 10, 11, 12, 13, 14, 15, 16, 40]);
                easystar.enableDiagonals();
                // easystar.enableCornerCutting();
                bot.pathAStar = easystar;
                this.collectPowerUps(bot, dt);
            }
        }
    }

    // trova quello con la distanza minore
    // TODO: si deve filtrare su quelli VICINI e VISIBILI non su tutti !!!!
    getNearestPowerup(origin: any, data: any) {
        let output: any = { dist: 10000 }; // elemento + vicino ad origin
        data
        .filter((elem:any)=> elem.visible==true)            // si esclude quelli non visibili
        // .filter((e:any)=>this.checkIfIsSeen2(origin, e))   // se non sono visibili si va con i waypoint...
        .forEach((e: any) => {
            let distanza = Helper.calculateDistance(origin, e);
            if (output.dist > distanza && distanza < 400) {
                output = { dist: distanza, elem: e };
            }
        })
        return output.elem;
    }

    getNearestWaypoint(bot: any, data: any) {
        let output: any = { dist: 10000 }; // elemento + vicino ad bot
        data
        .filter((elem:any)=> elem[bot.index].visible==true) // solo quelli non ancora attraversati dallo specifico bot
        .filter((e:any)=>this.checkIfIsSeen2(bot, e))
        .forEach((e: any) => {
            let distanza = Helper.calculateDistance(bot, e);
            if (output.dist > distanza && distanza < 500) {
                output = { dist: distanza, elem: e };
            }
        })
        return output.elem;
    }

    getNearestVisibleEnemy(origin: any, actors: any) {
        let output: any = { dist: 10000 }; // elemento + vicino ad origin
        actors
        .filter((elem:any)=> elem.index!==origin.index && elem.alive)   // si esclude se stessi e quelli morti...
        .filter((e:any)=>this.checkIfIsSeen2(origin, e))                // si esclude quelli non visibili
        .forEach((e: any) => {
            let distanza = Helper.calculateDistance(origin, e);
            if (output.dist > distanza && distanza < 350) {
                output = { dist: distanza, elem: e };
            }
        });
        return output;
    }

    collectPowerUps(bot: any, dt:number){
        bot.angleWithTarget = Helper.calculateAngle(bot.x/*  - this.camera.x */, bot.y /* - this.camera.y */, bot.targetItem.x/*  - this.camera.x */, bot.targetItem.y /* - this.camera.y */);
        if (bot.brain.first) {
            console.log(`Passaggio di stato: ${bot.brain.state.name}`);
            // al 1° giro si calcola il percorso
            this.findPath(bot);
        }else {
            // dal 2° in poi si 
            this.followPath(bot, dt);

        }
    }

    findPath(bot:any) {
        // Calculate the path-finding path
        let map = this.main.currentMap;
        const s = map.pixelToMapPos(bot);
        const d = map.pixelToMapPos(bot.targetItem);
        const start = performance.now();
        //  const s2 = Date.now();
        bot.pathAStar.findPath(s.x, s.y, d.x, d.y, (path:any) => {
            if (path === null) {
                console.log("Path was not found.");
            } else {
                console.log(`Path of bot ${bot.index} was found. First Point is ${path[0].x} ${path[0].y} `);
                bot.path = path || [];
                const end = performance.now();
                // console.log(`Pathfinding took ${end - start} ms for bot ${bot.index}`, Date.now() - s2);
                this.followPath(bot,16)
            }
        });
        bot.pathAStar.calculate();
      }
    
    followPath(bot: any, dt: number) {
        let map = this.main.currentMap;
        // Move along the path
        if (!bot.path.length) {
            return;
        }
        // bot.path.slice(2)
        const cell = bot.path[0];
        // We need to get the distance
        var tx = ((cell.x * map.tileSize) + map.tileSize/2) - bot.x,
            ty = ((cell.y * map.tileSize) + map.tileSize/2) - bot.y,
            dist = Math.sqrt(tx * tx + ty * ty);
        if(dist!=0){
            bot.velX = (tx / dist);
            bot.velY = (ty / dist); 
            bot.old_x = bot.x;
            bot.old_y = bot.y;
           // bot.x += bot.velX * bot.speed;
           // bot.y += bot.velY * bot.speed;
         //const closeX = Math.abs( bot.velX ) <= 1;
         //const closeY = Math.abs( bot.velY) <= 1;
         /* if (!closeX) */ bot.x +=  bot.velX * bot.speed;
         /* if (!closeY) */ bot.y +=  bot.velY * bot.speed;
        }

    // If you made it, move to the next path element
        if (/* Helper.circleCollision(bot.targetItem, bot) *//* closeX || closeY */dist<3) {
            bot.path = bot.path.slice(1);
            if (bot.path.length === 0) {
                this.findPath(bot);
                //bot.brain.pushState(this.wander.bind(this));
            }
        }
    }

    shot(bot:any, dist:number){
        if (dist < 350 && this.checkIfIsSeen2(bot.target, bot)) {	// SE non troppo lontano e visibile SPARA!
            let now = Date.now();
            if (now - bot.attackCounter < bot.shootRate) return;
            bot.attackCounter = now;
            let vX = (bot.target.x/*  - this.camera.x */) - (bot.x/*  - this.camera.x */);
            let vY = (bot.target.y/*  - this.camera.y */) - (bot.y/*  - this.camera.y */);
            let dist = Math.sqrt(vX * vX + vY * vY);	// si calcola la distanza
            vX /= dist;									// si normalizza e si calcola la direzione
            vY /= dist;
            this.bullet.create(bot.x, bot.y, vX * 8, vY * 8, 'enemy', bot.index, bot.damage);  // 8 è la velocità del proiettile
        }
        else {
            bot.brain.pushState(this.wander.bind(this));
        }
    }

}
