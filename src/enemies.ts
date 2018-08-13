import {Helper} from'./helper';

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

    list:   any;
    pool:   any;

    constructor() { }

    init(main:any){
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

    create( x: number, y: number, num:number) {
        let enemy:any = new Object();
        enemy.id              = `BOT${num}`;
        enemy.name            = Helper.getBotsName(this.c.ENEMY_NAMES);
        enemy.x               = x || 75;
        enemy.y               = y || 50;
        enemy.r               = this.c.ENEMY_RADIUS;
        enemy.velX            = 0;
        enemy.velY            = 10;
        enemy.angleWithPlayer = 0;
        enemy.hp              = this.c.ENEMY_HP;
        enemy.ap              = this.c.ENEMY_AP;
        enemy.kills           = 0;
        enemy.speed           = this.c.ENEMY_SPEED;
        enemy.attackCounter   = 0;
        enemy.strategy        = {};
        enemy.numberOfDeaths  = 0;
        this.list[this.list.length] = enemy
    };

    render(progress:number) {
        for (let i = this.list.length - 1; i >= 0; i--) {
            const obj = this.list[i];
            //if (!obj.dead) {
                // draw the colored region
                this.ctx.beginPath();
                this.ctx.arc(obj.x - this.camera.x, obj.y - this.camera.y, obj.r, 0, 2 * Math.PI, true);
                this.ctx.fillStyle = this.c.ENEMY_COLOUR_INSIDE;
                this.ctx.fill();

                // draw the stroke
                this.ctx.lineWidth = 2;
                this.ctx.strokeStyle = this.c.ENEMY_COLOUR_OUTSIDE;
                this.ctx.stroke();

                // beccuccio arma
                this.ctx.strokeStyle = this.c.ENEMY_COLOUR_OUTSIDE;
                this.ctx.beginPath();
                this.ctx.moveTo(obj.x - this.camera.x, obj.y - this.camera.y);
                var pointerLength = this.c.ENEMY_RADIUS;
                this.ctx.lineTo(
                    obj.x  - this.camera.x + pointerLength * Math.cos(obj.angleWithPlayer),
                    obj.y  - this.camera.y + pointerLength * Math.sin(obj.angleWithPlayer)
                );
                this.ctx.stroke();

                //if (this.main.debug) {
                    this.ctx.font = 'bold 8px/1 Arial';
                    this.ctx.fillStyle = 'white';
                    this.ctx.fillText(obj.hp.toString(), obj.x - this.camera.x -5, obj.y - this.camera.y);
                // }
            //}
        }
    }

    // collisione tra elementi della stessa imensione (tile e player)
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
    getNearest(origin:any, data: any){
        let output:any = {dist:10000}; // elemento + vicino ad origin
        data.powerup.forEach((e:any) => {
            let distanza = Helper.calculateDistance(origin, e);
            if(output.dist> distanza){
                output = {dist: distanza, elem: e};
            }
        });
        return output.elem;
    }

    update(progress:number) {
        for (let i = this.list.length - 1; i >= 0; i--) {
            const obj = this.list[i];

            if (this.player.alive) {
                // si calcola l'angolo rispetto allo stesso sistema di riferimento (camera)
                obj.angleWithPlayer = Helper.calculateAngle(obj.x - this.camera.x, obj.y - this.camera.y, this.player.x - this.camera.x, this.player.y - this.camera.y);

                obj.attackCounter += progress;

                // TODO: const powerupVicino = this.getNearest(obj, this.main.data)

                // get the target x and y
                obj.strategy.targetX = this.player.x;
                obj.strategy.targetY = this.player.y;

                // We need to get the distance
                var tx = obj.strategy.targetX - obj.x,
                    ty = obj.strategy.targetY - obj.y,
                    dist = Math.sqrt(tx * tx + ty * ty);

                /* 
                * we calculate a velocity for our object this time around
                * divide the target x and y by the distance and multiply it by our speed
                * this gives us a constant movement speed.
                */

                obj.velX = (tx / dist) * obj.speed;
                obj.velY = (ty / dist) * obj.speed;

                // si va verso il player 
                if (dist > (125 - this.player.r)) {
                    // add our velocities
                    if (obj.velX > 0) {
                        obj.strategy.d = obj.velX;
                    } else {
                        obj.strategy.a = obj.velX;
                    }
                    if (obj.velY > 0) {
                        obj.strategy.s = obj.velX;
                    } else {
                        obj.strategy.w = obj.velX;
                    }

                    if (obj.strategy.w) { // W 
                        if (this.checkmove(obj.x - obj.r, obj.y - obj.r - obj.speed)) {
                            obj.y -= obj.speed;
                            if (obj.y - obj.r < this.camera.y) {
                                obj.y = this.camera.y + obj.r;
                            }
                            // collisione con il player
                            // if (Helper.circleCollision(obj, this.player)) {
                            //     this.player.y -= 4 * obj.speed;
                            //     obj.y += 2 * this.player.speed;
                            // }
                        }
                    }
                    if (obj.strategy.s) {	// S
                        if (this.checkmove(obj.x - obj.r, obj.y - obj.r + obj.speed)) {
                            obj.y += obj.speed;
                            if (obj.y + obj.r >= this.camera.y + this.camera.h) {
                                obj.y = this.camera.y + this.camera.h - obj.r;
                            }
                            // collisione con il player
                            // if (Helper.circleCollision(obj, this.player)) {
                            //     this.player.y += 4 * obj.speed;
                            //     obj.y -= 2 * this.player.speed;
                            // }
                        }
                    }
                    if (obj.strategy.a) {	// a
                        if (this.checkmove(obj.x - obj.r - obj.speed, obj.y - obj.r)) {
                            obj.x -= obj.speed;
                            if (obj.x - obj.r < this.camera.x) {
                                obj.x = this.camera.x + obj.r;
                            }
                            // collisione con il player
                            // if (Helper.circleCollision(obj, this.player)) {
                            //     this.player.x -= 4 * obj.speed;
                            //     obj.x += 2 * this.player.speed;
                            // }
                        }
                    }
                    if (obj.strategy.d) {	// d
                        if (this.checkmove(obj.x - obj.r + obj.speed, obj.y - obj.r)) {
                            obj.x += obj.speed;
                            if (obj.x + obj.r >= this.map.mapSize.w) {
                                obj.x = this.camera.x + this.camera.w - obj.r;
                            }
                            // collisione con il player 
                            // if (Helper.circleCollision(obj, this.player)) {
                            //     this.player.x += 4 * obj.speed;
                            //     obj.x -= 2 * this.player.speed;
                            // }
                        }
                    }
                    if (dist < 350 && this.checkIfIsSeen(this.player, obj)) {	// SE non troppo lontano e visibile SPARA!
                        let vX = (this.player.x - this.camera.x) - (obj.x - this.camera.x);
                        let vY = (this.player.y - this.camera.y) - (obj.y - this.camera.y);
                        let dist = Math.sqrt(vX * vX + vY * vY);	// si calcola la distanza
                        vX /= dist;									// si normalizza e si calcola la direzione
                        vY /= dist;
                        if (obj.attackCounter > 200) {									// frequenza di sparo
                            this.bullet.create(obj.x, obj.y, vX * 8, vY * 8, 'enemy', i);  // 8 è la velocità del proiettile
                            obj.attackCounter = 0;
                        }

                    }
                    
                } else {
                    // si cerca il powerup + vicino
                    // console.log('si rimane fermi...');
                }
            }
        }
    }

    checkIfIsSeen(obj1:any, obj2:any){

        // let obj1Tile = this.map.map[Math.floor(obj1.y / this.c.TILE_SIZE)][Math.floor(obj1.x / this.c.TILE_SIZE)];
        // let obj2Tile = this.map.map[Math.floor(obj2.y / this.c.TILE_SIZE)][Math.floor(obj2.x / this.c.TILE_SIZE)];
// 
        // console.log(obj1Tile,obj2Tile)

        return true;

    }

}
