import {Helper} from'./helper';

export class BulletHandler {

    list:    any[]  = [];
    pool:    any[]  = []

    main:       any;
    c:          any;
    player:     any;
    enemy:      any;
    map:        any;
    particelle: any;
    blood:      any;


    constructor() { }

    init(main: any){
        this.list.length = 0;
        this.main        = main;
        this.c           = main.c; 
        this.player      = main.player;
        this.enemy       = main.enemy;
        this.particelle  = main.particelle;
        this.map         = main.currentMap;
        this.blood       = main.blood;
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

    check(shot, column, row) {

    }

    checkCollision(shot: any) {

        // console.log(this.map, shot);

        shot.left   = shot.x - this.c.BULLET_RADIUS + shot.vX;
        shot.right  = shot.x + this.c.BULLET_RADIUS + shot.vX;
        shot.bottom = shot.y - this.c.BULLET_RADIUS + shot.vY;
        shot.top    = shot.y + this.c.BULLET_RADIUS + shot.vY;
        let index: any = {};
        let values: any = {};
        let value_at_index: any;
        // sono le i di map[j][i]
        index.left  = Math.floor(shot.left / this.c.TILE_SIZE);
        index.right = Math.floor(shot.right / this.c.TILE_SIZE);
        // sono le j di map[j][i] 
        index.bottom = Math.floor(shot.bottom / this.c.TILE_SIZE);
        index.top    = Math.floor(shot.top / this.c.TILE_SIZE);

        values.left   = index.left * this.c.TILE_SIZE;
        values.right  = index.right * this.c.TILE_SIZE;
        values.bottom = index.bottom * this.c.TILE_SIZE;
        values.top    = index.top * this.c.TILE_SIZE;
        console.log(index, values);

        if (shot.x - shot.old_x < 0) {// test collision on left side of player if moving left
            value_at_index = this.map.map[index.bottom][index.left];
            if (value_at_index != 0) {// Check the bottom left point
                this.check(shot, values.bottom, values.left);
            }
            value_at_index = this.map.map[index.top][index.left];
            if (value_at_index != 0) {// Check the top left point
                this.check(shot, values.top, values.left);
            }
        } else if (shot.x - shot.old_x > 0) {// Is the player moving right?
            value_at_index = this.map.map[index.bottom][index.right];
            if (value_at_index != 0) {// Check the bottom right point
                this.check(shot, values.bottom, values.right);
            }
            value_at_index = this.map.map[index.top][index.right];
            if (value_at_index != 0) {// Check the top right point
                this.check(shot, values.top, values.right);
            }
        }
        if (shot.y - shot.old_y < 0) {
            value_at_index = this.map.map[index.top][index.left];
            if (value_at_index != 0) {// Check the top left point
                this.check(shot, values.top, values.left);
            }
            value_at_index = this.map.map[index.top][index.right];
            if (value_at_index != 0) {// Check the top right point
                this.check(shot, values.top, values.right);
            }
        } else if (shot.y - shot.old_y > 0) {
            value_at_index = this.map.map[index.bottom][index.left];
            if (value_at_index != 0) {// Check the bottom left point
                this.check(shot, values.bottom, values.left);
            }
            value_at_index = this.map.map[index.bottom][index.right];
            if (value_at_index != 0) {// Check the bottom right point
                this.check(shot, values.bottom, values.right);
            }
            return false;
        }
    }


    update(progress: number) {
        let shot, i;
        for (i = this.list.length - 1; i >= 0; i--) {
            shot = this.list[i];
            shot.old_x = shot.x;
            shot.old_y = shot.y;
            shot.x += shot.vX;
            shot.y += shot.vY;


            // collisione con i muri
            if (/* !this.checkmove(shot.x - this.c.BULLET_RADIUS, shot.y - this.c.BULLET_RADIUS) || */
                 !this.checkmove(shot.x + this.c.BULLET_RADIUS, shot.y - this.c.BULLET_RADIUS) ||
                !this.checkmove(shot.x - this.c.BULLET_RADIUS, shot.y + this.c.BULLET_RADIUS) /* ||  
                !this.checkmove(shot.x + this.c.BULLET_RADIUS, shot.y + this.c.BULLET_RADIUS) */
                /* this.checkCollision(shot) */) {

                // TODO: la velocità deve invertire su un solo asse quella del bullet...
                this.main.particelle.create(shot.x, shot.y, Math.random() *shot.vX/3.5, Math.random() * shot.vY/3.5, this.c.DEBRIS_RADIUS)
                this.pool.push(shot);
                this.list.splice(i, 1);
                continue
            }

            // si guarda se i proiettili di qualche nemico impattano il player
            if (shot.firedBy=='enemy' && this.player.alive && Helper.circleCollision(shot, this.player)) {
                this.player.hp -= shot.damage;
                // this.player.vX = shot.vX * 0.03;
                // this.player.vY = shot.vY * 0.03;
                shot.hp = -99;
                this.blood.create(shot.x, shot.y,  Math.random() * 2 - 2, Math.random() * 2 - 2, this.c.BLOOD_RADIUS) // crea il sangue
                this.pool.push(shot);
                this.list.splice(i, 1);
                if(this.player.hp<=0){
                    this.player.alive = false;
                    this.player.numberOfDeaths++;
                    this.enemy.list[shot.index].kills++;    // si aumenta lo score del bot che ha sparato il proiettile
                    setTimeout(() => {
                        this.player.respawn();
                    }, this.c.GAME_RESPAWN_TIME); 
                }
                continue
            }

            // si guarda se i proiettili del player impattano qualche nemico
            for (let i = this.enemy.list.length - 1; i >= 0; i--) {
                const obj = this.enemy.list[i];
                if (shot.firedBy == 'player'&& Helper.circleCollision(shot, obj)) {
                    obj.hp -= shot.damage;
                    // obj.vX = shot.vX * 0.03;
                    // obj.vY = shot.vY * 0.03;
                    shot.hp = -99;
                    this.blood.create(shot.x, shot.y, Math.random() * 2 - 2, Math.random() * 2 - 2, this.c.BLOOD_RADIUS) // crea il sangue
                    if (obj.hp <= 0) {
                        this.player.kills++;
                        obj.numberOfDeaths++;
                        // TODO: RESPAWN: al momento ora i nemici si tolgono dall'array...
                         this.enemy.pool[this.enemy.pool.length] = shot;
                         this.enemy.list.splice(i, 1);
                    }
                    this.pool.push(shot);
                    this.list.splice(i, 1);
                    continue
                }
            }

            // decremento del proiettile
            shot.r -= 0.035;
            if (shot.r <= 1) {
                this.pool.push(shot);
                this.list.splice(i, 1);
                continue
            }
        }
    }

    render(progress:number) {
        for (let j = this.list.length - 1; j >= 0; j--) {
            const obj = this.list[j];
            let x = obj.x - this.main.camera.x;
            let y = obj.y - this.main.camera.y;
            this.main.ctx.beginPath();
            this.main.ctx.arc(x, y, obj.r, 0, 6.2832);
            this.main.ctx.fillStyle = 'rgba(0,0,0,0.66)';
            this.main.ctx.fill();
            this.main.ctx.closePath()
        }
    }

    create(x:number, y:number, vX:number, vY:number, firedBy:string, index:number, damage?:number) {
        let shot     = this.pool.length > 0 ? this.pool.pop(): {};
        shot.old_x = x;
        shot.x     = x;
        shot.old_y = y;
        shot.y     = y;
        shot.vX    = vX;
        shot.vY    = vY;
        shot.firedBy = firedBy; // indica da chi è sparato il colpo ( player, enemy )
        shot.r       = this.c.BULLET_RADIUS;
        shot.index   = index;
        shot.damage  =damage? damage*this.c.BULLET_DAMAGE: this.c.BULLET_DAMAGE;
        this.list.push(shot);
    }

}

