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

    myCheckCollision(shot:any, map:any){
        if (shot.x-shot.old_x>0 && map[Math.floor(shot.y / this.c.TILE_SIZE)][Math.floor((shot.x+this.c.BULLET_RADIUS) / this.c.TILE_SIZE)] == 1){
            shot.x = shot.old_x;
            return true;
        }
        if(shot.x-shot.old_x>0 && map[Math.floor(shot.y / this.c.TILE_SIZE)][Math.floor((shot.x - this.c.BULLET_RADIUS)/ this.c.TILE_SIZE)] == 1) {
            shot.x = shot.old_x;
            return true;
        }
        if(shot.y+shot.old_y>0 && map[Math.floor((shot.y+this.c.BULLET_RADIUS) / this.c.TILE_SIZE)][Math.floor(shot.x / this.c.TILE_SIZE)] == 1){
            shot.y = shot.old_y;
            return true;
        }
        if(shot.y+shot.old_y<0 && map[Math.floor((shot.y-this.c.BULLET_RADIUS) / this.c.TILE_SIZE)][Math.floor(shot.x / this.c.TILE_SIZE)] == 1){
            shot.y = shot.old_y;
            return true;
        } 
        return false;
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
            if (this.myCheckCollision(shot, this.map.map)) {
                // TODO: la velocità deve invertire su un solo asse quella del bullet...
                this.main.particelle.create(shot.x, shot.y, Math.random() *shot.vX/3.5, Math.random() * shot.vY/3.5, this.c.DEBRIS_RADIUS)
                this.pool.push(shot);
                this.list.splice(i, 1);
                continue
            }

            // si guarda se i proiettili di qualche nemico impattano il player
            if (shot.firedBy=='enemy' && this.player.alive && Helper.circleCollision(shot, this.player)) {
                this.player.hp -= shot.damage;
                this.player.vX = shot.vX * 0.03;
                this.player.vY = shot.vY * 0.03;
                shot.hp = -99;
                this.blood.create(shot.x, shot.y,  Math.random() * 2 - 2, Math.random() * 2 - 2, this.c.BLOOD_RADIUS) // crea il sangue
                this.pool.push(shot);
                this.list.splice(i, 1);
                if(this.player.hp<=0){
                    this.player.alive = false;
                    this.player.numberOfDeaths++;
                    for (let b = 0; b < 36; b++) {
                        this.blood.create(shot.x, shot.y,  Math.random() * 2 - 2*i, Math.random() * 2 - 2*i, this.c.BLOOD_RADIUS) // crea il sangue
                    }
                    this.enemy.list[shot.index].kills++;    // si aumenta lo score del bot che ha sparato il proiettile
                    let currentActorInCamera = this.enemy.list[shot.index];
                    this.main.camera.setCurrentPlayer(currentActorInCamera);
                    this.main.camera.adjustCamera(currentActorInCamera);
                    setTimeout(() => {
                        this.player.respawn();
                    }, this.c.GAME_RESPAWN_TIME); 
                }
                this.pool.push(shot);
                this.list.splice(i, 1);
                continue
            }

            // si guarda se i proiettili del player impattano qualche nemico
            for (let i = this.enemy.list.length - 1; i >= 0; i--) {
                const obj = this.enemy.list[i];
                if (shot.firedBy == 'player' && obj.alive && Helper.circleCollision(shot, obj)) {
                    obj.hp -= shot.damage;
                    obj.vX = shot.vX * 0.03;
                    obj.vY = shot.vY * 0.03;
                    shot.hp = -99;
                    this.blood.create(shot.x, shot.y, Math.random() * 2 - 2, Math.random() * 2 - 2, this.c.BLOOD_RADIUS) // crea il sangue
                    if (obj.hp <= 0) {
                        obj.alive = false;
                        this.player.kills++;
                        obj.numberOfDeaths++;
                        for (let b = 0; b < 36; b++) {
                            this.blood.create(shot.x, shot.y,  Math.random() * 2 - 2*i, Math.random() * 2 - 2*i, this.c.BLOOD_RADIUS) // crea il sangue
                        }
                        setTimeout(() => {
                            this.enemy.respawn(obj);
                        }, this.c.GAME_RESPAWN_TIME); 
                    }
                    this.pool.push(shot);
                    this.list.splice(i, 1);
                    continue
                }
            }

            // decremento del proiettile
            shot.ttl -= progress;
            if (shot.ttl <= 0) {
                this.pool.push(shot);
                this.list.splice(i, 1);
                continue
            }
        }
    }

    render(progress: number) {
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
        shot.ttl     = this.c.BULLET_TTL;
        shot.index   = index;   // è l'id del 
        shot.damage  =damage? damage*this.c.BULLET_DAMAGE: this.c.BULLET_DAMAGE;
        this.list.push(shot);
    }

}

