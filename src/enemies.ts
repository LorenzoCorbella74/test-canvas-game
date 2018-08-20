import { BrainFSM } from './brain';
import { Helper } from './helper';

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
        bot.targetItem      = {};
        this.list[this.list.length] = bot;
        bot.brain.pushState(this.spawn.bind(this));
        bot.status='spawn';
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
        bot.target                = {};
        bot.targetItem            = {};
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

    render(progress: number) {
        for (let i = this.list.length - 1; i >= 0; i--) {
            const bot = this.list[i];
            if (bot.alive) {
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
                    this.ctx.fillText(bot.target && bot.target.index? bot.target.index.toString():'', bot.x - this.camera.x + 5, bot.y - this.camera.y +20);
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
        return Helper.randomElementInArray([bot.velX, -bot.velY,bot.velY, -bot.velX]);
    }

    checkCollision(bot:any){
        if (bot.velY<0) { // W 
            if (this.checkmove(bot.x - bot.r, bot.y - bot.r + bot.speed) ) {
                //bot.y = bot.velY *bot.speed;
                if (bot.y - bot.r < this.camera.y) {
                    bot.y = this.camera.y + bot.r;
                }
                // collisione con il player
                // if (Helper.circleCollision(bot, bot.target)) {
                //     bot.target.y -= 4 * bot.speed;
                //     bot.y += 2 * bot.target.speed;
                // }
            } else {
                bot.y =bot.old_y;
            }
        }
        if (bot.velY>0) {	// S
            if (this.checkmove(bot.x - bot.r, bot.y - bot.r + bot.speed) ){
                //bot.y += bot.velY *bot.speed;
                if (bot.y + bot.r >= this.camera.y + this.camera.h) {
                    bot.y = this.camera.y + this.camera.h - bot.r;
                }
                // collisione con il player
                // if (Helper.circleCollision(bot, bot.target)) {
                //     bot.target.y += 4 * bot.speed;
                //     bot.y -= 2 * bot.target.speed;
                // }
            } else {
                bot.y =bot.old_y;
            }
        }
        if (bot.velX<0) {	// a
            if (this.checkmove(bot.x - bot.r - bot.speed, bot.y - bot.r)){
                //bot.x += bot.velX *bot.speed;
                if (bot.x - bot.r < this.camera.x) {
                    bot.x = this.camera.x + bot.r;
                }
                // collisione con il player
                // if (Helper.circleCollision(bot, bot.target)) {
                //     bot.target.x -= 4 * bot.speed;
                //     bot.x += 2 * bot.target.speed;
                // }
            } else {
            bot.x = bot.old_x;
            }
        }
        if (bot.velX>0) {	// d    
            if (this.checkmove(bot.x - bot.r + bot.speed, bot.y - bot.r) ){
                // bot.x += bot.velX *bot.speed;
                if (bot.x + bot.r >= this.map.mapSize.w) {
                    bot.x = this.camera.x + this.camera.w - bot.r;
                }
                // collisione con il player 
                // if (Helper.circleCollision(bot, bot.target)) {
                //     bot.target.x += 4 * bot.speed;
                //     bot.x -= 2 * bot.target.speed;
                // }
            } else {
                bot.x = bot.old_x;
            }
        }
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

    update(progress: number) {
        for (let i = this.list.length - 1; i >= 0; i--) {
            const bot = this.list[i];
            if(bot.alive){
                bot.brain.update(bot, progress);
                this.checkCollision(bot);
            }
        }
    }

    spawn(bot: any, progress: number) {
        bot.status ='spawn';
        let opponentData = this.getNearestVisibleEnemy(bot, this.main.actors);
        bot.target = opponentData.elem;
        bot.distanceWIthTarget = opponentData.dist;
        if (bot.target && bot.target.alive && bot.distanceWIthTarget < 350) {
            
            bot.brain.pushState(this.chaseTarget.bind(this));
        } else {
            bot.brain.pushState(this.wander.bind(this));
        }
    }
    
    chaseTarget(bot: any, progress: number) {
        bot.status ='chasing';
        bot.angleWithTarget = Helper.calculateAngle(bot.x /* - this.camera.x */, bot.y /* - this.camera.y */, bot.target.x /* - this.camera.x */, bot.target.y /* - this.camera.y */);
        // let opponentData = this.getNearestVisibleEnemy(bot, this.main.actors);
        // bot.target = opponentData.elem;

        if (bot.target && bot.target.alive) {
            // si calcola l'angolo rispetto allo stesso sistema di riferimento (camera)
           // console.log(bot.angleWithTarget);
            //bot.angleWithTarget2 = Helper.calculateAngle(bot.target.x - this.camera.x, bot.target.y - this.camera.y, bot.x - this.camera.x, bot.y - this.camera.y);

            // We need to get the distance
            var tx = bot.target.x - bot.x,
                ty = bot.target.y - bot.y,
                dist = Math.sqrt(tx * tx + ty * ty);
                bot.old_x = bot.x;
                bot.old_y = bot.y;

            // si va verso il player fino a quando si è lontanissimi
            if (dist > 250) {
                bot.velX = (tx/ dist);
                bot.velY = (ty / dist);
                bot.x += bot.velX * bot.speed;
                bot.y += bot.velY * bot.speed;
            }


            if (dist > 150 && dist < 250) {

                // https://stackoverflow.com/questions/10343448/javascript-atan2-function-not-giving-expected-results
                if (bot.angleWithTarget < 0) bot.angleWithTarget = Math.PI + bot.angleWithTarget;
                
                let newX = (bot.target.x + Math.cos(bot.angleWithTarget) * dist) / dist;
                let newY = (bot.target.y + Math.sin(bot.angleWithTarget) * dist) / dist;
//
console.log(newX, newY)

                bot.velX = ((tx + 32 * newX/5) / dist) /* * this.getRandomDirection(bot) */;
                bot.velY = ((ty + 32 * newY/3) / dist) /* * this.getRandomDirection(bot) */;
                //bot.angleWithTarget +=5 /* * Math.PI / 180 */; // orario
                //// il target è considerato il centro del cerchio e il radius la distanza tra bot e target
                //bot.velX = (bot.target.x + Math.cos(bot.angleWithTarget) * dist) / dist;
                //bot.velY = (bot.target.y + Math.sin(bot.angleWithTarget) * dist) / dist;
                bot.x += bot.velX * bot.speed;
                bot.y += bot.velY * bot.speed;
                bot.angleWithTarget +=15;

            }
            if (dist < 150) { // retreat
                bot.velX = -(tx / dist);
                bot.velY = -(ty / dist);
                bot.x += bot.velX * bot.speed;
                bot.y += bot.velY * bot.speed;
            }
            

            this.shot(bot, dist);
        } else{
            bot.brain.pushState(this.wander.bind(this));
        }
    }

    // TODO: https://stackoverflow.com/questions/24378155/random-moving-position-for-sprite-image

    wander(bot: any, progress: number) {
        if (bot.brain.first) {
                console.log(`Passaggio di stato: ${bot.brain.state.name}`);
        }
        bot.status ='wander';
        let opponentData = this.getNearestVisibleEnemy(bot, this.main.actors);
        bot.target = opponentData.elem;

        if (bot.target && bot.target.alive /* && bot.distanceWIthTarget < 350 */) {
            bot.brain.pushState(this.chaseTarget.bind(this));
        } else {
            bot.attackCounter = 0;
            bot.angleWithTarget = 0;
            // se non si ha un target si va alla ricerca dei powerup
            bot.targetItem = this.getNearestPowerup(bot, this.main.powerup.list) || this.getNearestWaypoint(bot, this.main.waypoints.list); // il targetItem sono sia i powerUp che i waypoints
            if (bot.alive && bot.targetItem) {
                this.collectPowerUps(bot);
            }
        }
    }

    // trova quello con la distanza minore
    // TODO: si deve filtrare su quelli VICINI e VISIBILI non su tutti !!!!
    getNearestPowerup(origin: any, data: any) {
        let output: any = { dist: 10000 }; // elemento + vicino ad origin
        data
        .filter((elem:any)=> elem.visible==true) // si esclude quelli non visibili
        .filter((e:any)=>this.checkIfIsSeen2(origin, e))   // quelli non visibili // FIXME:quando si ha il pathfinding con A* si potrà togliere...
        .forEach((e: any) => {
            let distanza = Helper.calculateDistance(origin, e);
            if (output.dist > distanza && distanza < 350) {
                output = { dist: distanza, elem: e };
            }
        })
        return output.elem;
    }
    getNearestWaypoint(bot: any, data: any) {
        let output: any = { dist: 10000 }; // elemento + vicino ad bot
        data
        .filter((elem:any)=> elem[bot.index].visible==true) // solo quelli non ancora attraversati dallo specifico bot
        .forEach((e: any) => {
            let distanza = Helper.calculateDistance(bot, e);
            if (output.dist > distanza && distanza < 600) {
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

    collectPowerUps(bot: any){
        bot.angleWithTarget = Helper.calculateAngle(bot.x - this.camera.x, bot.y - this.camera.y, bot.targetItem.x - this.camera.x, bot.targetItem.y - this.camera.y);
        // We need to get the distance
        var tx = bot.targetItem.x - bot.x,
            ty = bot.targetItem.y - bot.y,
            dist = Math.sqrt(tx * tx + ty * ty);
        bot.velX = (tx / dist);
        bot.velY = (ty / dist);
        bot.old_x = bot.x;
        bot.old_y = bot.y;
        bot.x += bot.velX * bot.speed;
        bot.y += bot.velY * bot.speed;
    }

    shot(bot:any, dist:number){
        if (dist < 400 && this.checkIfIsSeen2(bot.target, bot)) {	// SE non troppo lontano e visibile SPARA!
            let now = Date.now();
            if (now - bot.attackCounter < bot.shootRate) return;
            bot.attackCounter = now;
            let vX = (bot.target.x - this.camera.x) - (bot.x - this.camera.x);
            let vY = (bot.target.y - this.camera.y) - (bot.y - this.camera.y);
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
