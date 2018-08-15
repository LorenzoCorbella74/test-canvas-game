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
        enemy.damage                = 1;					// è per il moltiplicatore del danno (quad = 4)
        enemy.strategy              = {};                   // per il movimento del bot
        enemy.kills                 = 0;
        enemy.numberOfDeaths        = 0;
        enemy.target                = {};
        this.list[this.list.length] = enemy;
        return enemy;
    };

    respawn(bot: any) {
        const spawn = Helper.getSpawnPoint(this.main.data.spawn);
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
        bot.attackCounter = 0;
        bot.currentWeapon = this.c.PLAYER_STARTING_WEAPON;		// arma corrente
    }

    render(progress: number) {
        for (let i = this.list.length - 1; i >= 0; i--) {
            const bot = this.list[i];
            if (bot.alive) {
                // draw the colored region
                this.ctx.beginPath();
                this.ctx.arc(bot.x - this.camera.x, bot.y - this.camera.y, bot.r, 0, 2 * Math.PI, true);
                this.ctx.fillStyle = this.c.ENEMY_COLOUR_INSIDE;
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
                    this.ctx.fillText(bot.index.toString(), bot.x - this.camera.x - 5, bot.y - this.camera.y -12);
                    this.ctx.fillText(bot.target? bot.target.index.toString():'', bot.x - this.camera.x + 5, bot.y - this.camera.y -12);
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
        data.powerup.forEach((e: any) => {
            let distanza = Helper.calculateDistance(origin, e);
            if (output.dist > distanza && distanza < 350) {
                output = { dist: distanza, elem: e };
            }
        });
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

    attackEnemy(bot: any, progress: number) {

        // si calcola l'angolo rispetto allo stesso sistema di riferimento (camera)
        bot.angleWithTarget = Helper.calculateAngle(bot.x - this.camera.x, bot.y - this.camera.y, bot.target.x - this.camera.x, bot.target.y - this.camera.y);

        bot.attackCounter += progress;

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

        // si va verso il player 
        if (dist > 200) {
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
            if (bot.velX > 0) {
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

        if (dist < 300 && this.checkIfIsSeen(bot.target, bot)) {	// SE non troppo lontano e visibile SPARA!
            let vX = (bot.target.x - this.camera.x) - (bot.x - this.camera.x);
            let vY = (bot.target.y - this.camera.y) - (bot.y - this.camera.y);
            let dist = Math.sqrt(vX * vX + vY * vY);	// si calcola la distanza
            vX /= dist;									// si normalizza e si calcola la direzione
            vY /= dist;
            if (bot.attackCounter > 200) {									// frequenza di sparo
                this.bullet.create(bot.x, bot.y, vX * 8, vY * 8, 'enemy', i, bot.damage);  // 8 è la velocità del proiettile
                bot.attackCounter = 0;
            }
        }
    }

    update(progress: number) {
        for (let i = this.list.length - 1; i >= 0; i--) {
            const bot = this.list[i];

            bot.target =  /* this.player; //  */this.getNearestEnemy(bot, this.main.actors);
            if (bot.alive && bot.target && bot.target.alive) {
                this.attackEnemy(bot, progress)
            }

            // se non si ha un target si va alla ricerca dei powerup

        }
    }

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

    checkIfIsSeen(obj1: any, obj2: any) {

        return true
        /* let ray = new Object();
        ray.x = obj1.x;
        ray.y = obj1.y;
        ray.r = 2;
        let vX = (obj1.x) - (obj2.x);
        let vY = (obj1.y) - (obj2.y);
        let dist = Math.sqrt(vX * vX + vY * vY);	// si calcola la distanza 
        vX /= dist;									// si normalizza e si calcola la direzione
        vY /= dist;
        ray.old_X = ray.x;
        ray.old_Y = ray.y;
        ray.x += vX;
        ray.y += vY;
        //console.log(ray, dist);
        let output;
        for (let i = 0; i < dist; i+=5) {
            output = this.myCheckCollision(ray, this.map.map);
            if (!output) {  // se non è avvenuta si aggiorna le coordinate del raggio
                ray.old_X = ray.x;
                ray.old_Y = ray.y;
                ray.x += vX;
                ray.y += vY;
                
            }
            console.log(ray, output);
            break;
        }
        return output; */
    }

}
