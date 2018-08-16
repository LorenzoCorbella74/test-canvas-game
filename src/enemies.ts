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
    pool: any;

    constructor() { }

    init(main: any) {
        this.list   = [];
        this.pool   = []
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
        let enemy: any              = new Object();
        enemy.index                 = num;
        enemy.name                  = Helper.getBotsName(this.c.ENEMY_NAMES);
        enemy.x                     = x || 75;
        enemy.y                     = y || 50;
        enemy.r                     = this.c.ENEMY_RADIUS;
        enemy.velX                  = 0;
        enemy.velY                  = 0;
        enemy.alive                 = true;
        enemy.speed                 = this.c.ENEMY_SPEED;
        enemy.angleWithTarget       = 0;
        enemy.hp                    = this.c.ENEMY_HP;
        enemy.ap                    = this.c.ENEMY_AP;
        enemy.attackCounter         = 0;
        enemy.shootRate             = 200;
        enemy.damage                = 1;					// è per il moltiplicatore del danno (quad = 4)
        enemy.strategy              = {};                   // per il movimento del bot
        enemy.kills                 = 0;
        enemy.numberOfDeaths        = 0;
        enemy.target                = {};
        enemy.targetItem            = {};
        this.list[this.list.length] = enemy;
        return enemy;
    };

    respawn(bot: any) {
        const spawn = Helper.getSpawnPoint(this.main.data.spawn);
        console.log(`BOT ${bot.index} is swawning at ${spawn.x-this.camera.x} - ${spawn.y-this.camera.y}`);
        bot.x = spawn.x;
        bot.y = spawn.y;
        bot.r = this.c.ENEMY_RADIUS;
        bot.velX = 0;
        bot.velY = 0;
        // bot.camera.adjustCamera(this);
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
        bot.currentWeapon = this.c.PLAYER_STARTING_WEAPON;		// arma corrente
    }

    private getBotColour(bot){
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
                    this.ctx.fillText(bot.index.toString(), bot.x - this.camera.x - 5, bot.y - this.camera.y -16);
                    this.ctx.fillText(bot.target? bot.target.index.toString():'', bot.x - this.camera.x + 5, bot.y - this.camera.y -16);
                    this.ctx.fillText(bot.targetItem && bot.targetItem.index? bot.targetItem.index.toString():'', bot.x - this.camera.x + 5, bot.y - this.camera.y +16);
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

    // trova quello con la distanza minore
    // TODO: si deve filtrare su quelli VICINI e VISIBILI non su tutti !!!!
    getNearestPowerup(origin: any, data: any) {
        let output: any = { dist: 10000 }; // elemento + vicino ad origin
        data
        .filter((elem:any)=> elem.visible==true) // si esclude quelli non visibili
        // .filter((e:any)=>this.checkIfIsSeen2(origin, e))   // quelli non visibili // FIXME:quando si ha il pathfinding con A* si potrà togliere...
        .forEach((e: any) => {
            let distanza = Helper.calculateDistance(origin, e);
            if (output.dist > distanza && distanza < 350) {
                output = { dist: distanza, elem: e };
            }
        })
        return output.elem;
    }

    getNearestEnemy(origin: any, actors: any) {
        let output: any = { dist: 10000 }; // elemento + vicino ad origin
        actors
        .filter((elem:any)=> elem.index!==origin.index) // si esclude se stessi
        .forEach((e: any) => {
            let distanza = Helper.calculateDistance(origin, e);
            if (output.dist > distanza && distanza < 350) {
                output = { dist: distanza, elem: e };
            }
        });
        return output.elem;
    }

    collectPowerUps(bot: any){
        bot.angleWithTarget = Helper.calculateAngle(bot.x - this.camera.x, bot.y - this.camera.y, bot.targetItem.x - this.camera.x, bot.targetItem.y - this.camera.y);
        // We need to get the distance
        var tx = bot.targetItem.x - bot.x,
            ty = bot.targetItem.y - bot.y,
            dist = Math.sqrt(tx * tx + ty * ty);
        bot.velX = (tx / dist);
        bot.velY = (ty / dist);

        // si va verso il powerup 
        if (dist > 0) {
            if (bot.velX > 0) {
                bot.strategy.d = true;
                bot.strategy.a = false;
            } else {
                bot.strategy.a = true;
                bot.strategy.d = false;
            }
            if (bot.velY > 0) {
                bot.strategy.s = true;
                bot.strategy.w = false;
            } else {
                bot.strategy.w = true;
                bot.strategy.s = false;
            }
        } 
        this.checkCollision(bot);
    }

    attackEnemy(bot: any, index:number, progress: number) {

        // si calcola l'angolo rispetto allo stesso sistema di riferimento (camera)
        bot.angleWithTarget = Helper.calculateAngle(bot.x - this.camera.x, bot.y - this.camera.y, bot.target.x - this.camera.x, bot.target.y - this.camera.y);

        // bot.attackCounter += progress;

        // We need to get the distance
        var tx = bot.target.x - bot.x,
            ty = bot.target.y - bot.y,
            dist = Math.sqrt(tx * tx + ty * ty);

        /* 
        * we calculate a velocity for our object this time around
        * divide the target x and y by the distance and multiply it by our speed
        * this gives us a constant movement speed.
        */
        bot.velX = (tx / dist);
        bot.velY = (ty / dist);

        // si va verso il player fino a quando si è vicini
        if (dist > 150) {
            if (bot.velX > 0) {
                bot.strategy.d = true;
            } else {
                bot.strategy.a = true;
            }
            if (bot.velY > 0) {
                bot.strategy.s = true;
            } else {
                bot.strategy.w = true;
            }
        } else {
            if (bot.velX > 0 ) {
                bot.strategy.d = false;
            } else {
                bot.strategy.a = false;
            }
            if (bot.velY > 0) {
                bot.strategy.s = false;
            } else {
                bot.strategy.w = false;
            }
        }

        this.checkCollision(bot);

        // this.line(bot.target, bot);
        // this.walk_grid(bot.target, bot);

        if (dist < 400 && this.checkIfIsSeen2(bot.target, bot)) {	// SE non troppo lontano e visibile SPARA!
            let now = Date.now();
            if (now - bot.attackCounter < bot.shootRate) return;
            bot.attackCounter = now;
            let vX = (bot.target.x - this.camera.x) - (bot.x - this.camera.x);
            let vY = (bot.target.y - this.camera.y) - (bot.y - this.camera.y);
            let dist = Math.sqrt(vX * vX + vY * vY);	// si calcola la distanza
            vX /= dist;									// si normalizza e si calcola la direzione
            vY /= dist;
            // if (bot.attackCounter > 200) {									// frequenza di sparo
                this.bullet.create(bot.x, bot.y, vX * 8, vY * 8, 'enemy', index, bot.damage);  // 8 è la velocità del proiettile
                //bot.attackCounter = 0;
            //}
        }
    }

    checkCollision(bot:any){
        if (bot.strategy.w) { // W 
            if (this.checkmove(bot.x - bot.r, bot.y - bot.r - bot.speed)) {
                bot.y -= bot.speed;
                if (bot.y - bot.r < this.camera.y) {
                    bot.y = this.camera.y + bot.r;
                }
                // collisione con il player
                // if (Helper.circleCollision(bot, bot.target)) {
                //     bot.target.y -= 4 * bot.speed;
                //     bot.y += 2 * bot.target.speed;
                // }
            }
        }
        if (bot.strategy.s) {	// S
            if (this.checkmove(bot.x - bot.r, bot.y - bot.r + bot.speed)) {
                bot.y += bot.speed;
                if (bot.y + bot.r >= this.camera.y + this.camera.h) {
                    bot.y = this.camera.y + this.camera.h - bot.r;
                }
                // collisione con il player
                // if (Helper.circleCollision(bot, bot.target)) {
                //     bot.target.y += 4 * bot.speed;
                //     bot.y -= 2 * bot.target.speed;
                // }
            }
        }
        if (bot.strategy.a) {	// a
            if (this.checkmove(bot.x - bot.r - bot.speed, bot.y - bot.r)) {
                bot.x -= bot.speed;
                if (bot.x - bot.r < this.camera.x) {
                    bot.x = this.camera.x + bot.r;
                }
                // collisione con il player
                // if (Helper.circleCollision(bot, bot.target)) {
                //     bot.target.x -= 4 * bot.speed;
                //     bot.x += 2 * bot.target.speed;
                // }
            }
        }
        if (bot.strategy.d) {	// d
            if (this.checkmove(bot.x - bot.r + bot.speed, bot.y - bot.r)) {
                bot.x += bot.speed;
                if (bot.x + bot.r >= this.map.mapSize.w) {
                    bot.x = this.camera.x + this.camera.w - bot.r;
                }
                // collisione con il player 
                // if (Helper.circleCollision(bot, bot.target)) {
                //     bot.target.x += 4 * bot.speed;
                //     bot.x -= 2 * bot.target.speed;
                // }
            }
        }
    }

    update(progress: number) {
        for (let i = this.list.length - 1; i >= 0; i--) {
            const bot = this.list[i];
            bot.target =  /* this.player; //  */this.getNearestEnemy(bot, this.main.actors);
            if (bot.alive && bot.target && bot.target.alive) {
                this.attackEnemy(bot, i, progress);
            } else {
                bot.attackCounter =0;
                // se non si ha un target si va alla ricerca dei powerup
                bot.targetItem = this.getNearestPowerup(bot, this.main.powerup.list);
                if (bot.alive && bot.targetItem) {
                    this.collectPowerUps(bot);
                }
            }
        }
    }
/* 
    // se true è avvenuta la collisione se false no...
    myCheckCollision(shot: any, map: any) {
        if (shot.x - shot.old_x > 0 && map[Math.floor(shot.y / this.c.TILE_SIZE)][Math.floor((shot.x + this.c.BULLET_RADIUS) / this.c.TILE_SIZE)] == 1) {
            shot.x = shot.old_x;
            return true;
        }
        if (shot.x - shot.old_x > 0 && map[Math.floor(shot.y / this.c.TILE_SIZE)][Math.floor((shot.x - this.c.BULLET_RADIUS) / this.c.TILE_SIZE)] == 1) {
            shot.x = shot.old_x;
            return true;
        }
        if (shot.y + shot.old_y > 0 && map[Math.floor((shot.y + this.c.BULLET_RADIUS) / this.c.TILE_SIZE)][Math.floor(shot.x / this.c.TILE_SIZE)] == 1) {
            shot.y = shot.old_y;
            return true;
        }
        if (shot.y + shot.old_y < 0 && map[Math.floor((shot.y - this.c.BULLET_RADIUS) / this.c.TILE_SIZE)][Math.floor(shot.x / this.c.TILE_SIZE)] == 1) {
            shot.y = shot.old_y;
            return true;
        }
        return false;
    }

    checkIfIsSeen(target: any, source: any) {
        let ray = new Object();
        let old_x = source.x;
        let old_y = source.y ;
        let x = source.x;
        let y = source.y;
        let tx = (target.x) - (source.x),
            ty = (target.y) - (source.y),
            dist = Math.sqrt(tx * tx + ty * ty);
            // console.log(dist);
        ray.x = x;
        ray.old_x = old_x;
        ray.y = y;
        ray.old_y = old_y;
        ray.r = 1;
        let velX = (tx / dist);
        let velY = (ty / dist);
        ray.x += velX;
        ray.y += velY;
        //console.log(ray, dist);
        let output;
        for (let i = 0; i < 300; i+=3) {
            output = this.myCheckCollision(ray, this.map.map);
            if (!output) {  // se non è avvenuta si aggiorna le coordinate del raggio
                ray.old_x = ray.x;
                ray.old_y = ray.y;
                ray.x += velX;
                ray.y += velY;
            }else{
                break;
            }
        }
        return !output; 
    } */

    /*

     // torna true se non ci sono blocchi, false se si ha almeno una tile solida tra i due punti
    canSeeTarget(source: any, destination: any): boolean {
        let points = this.plot(source.x, source.y, destination.x, destination.y);
        console.log(points);
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


    private plot(x0, y0, x1, y1) {
        let dots = [];
        let dx = Math.abs(x1 - x0);
        let dy = Math.abs(y1 - y0);
        let sx = (x0 < x1) ? 1 : -1;
        let sy = (y0 < y1) ? 1 : -1;
        let err = dx - dy;
        dots.push({ x: x0, y: y0 });
        while(true){
            dots.push({ x: x0, y: y0 });
       
            if (Math.abs(x0-x1)<0.0001 && Math.abs(y0-y1)<0.0001) break;
            var e2 = 2*err;
            if (e2 >-dy){ err -= dy; x0  += sx; }
            if (e2 < dx){ err += dx; y0  += sy; }
          }
        return dots;
    }

    */

    /*
    // SOURCE: https://www.redblobgames.com/grids/line-drawing.html

    // Linear interpolation (“lerp”) gives you a number between two other numbers. 
    // When t = 0.0 you get the start point; when t = 1.0 you get the end point 
    lerp(start, end, t) {
        return start + t * (end-start);
    }


     lerp_point(p0:any, p1:any, t) {
        return {x:this.lerp(p0.x, p1.x, t), y: this.lerp(p0.y, p1.y, t)};
    }

     diagonal_distance(p0:any, p1:any) {
        var dx = p1.x - p0.x, dy = p1.y - p0.y;
        return Math.max(Math.abs(dx), Math.abs(dy));
    }
    
     round_point(p:any) {
        return {x:Math.round(p.x), y:Math.round(p.y)};
    }
    
     line(p0:any, p1:any) {
        var points = [];
        var N = this.diagonal_distance(p0, p1);
        for (var step = 0; step <= N; step++) {
            var t = N == 0? 0.0 : step / N; 
            // console.log(t);
            points.push(this.round_point(this.lerp_point(p0, p1, t)));
        }
        //console.log(points);
        return points;
    }
    */


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

}
