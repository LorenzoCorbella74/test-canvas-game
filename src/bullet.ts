import { conf as c } from './config';
import {Helper} from'./helper';

export class BulletHandler {

    // CARATTERISTICHE DEL BULLET
    r:  number = c.BULLET_RADIUS;
    damage:  number = c.BULLET_DAMAGE;
    firedBy: string;    // indica da chi è sparato il colpo ( player, enemy )

    list:    any[]  = [];
    pool:    any[]  = []

    main:    any;
    player:  any;
    enemy:   any;
    map:     any;
    detriti: any;
    blood:   any;


    constructor(main: any) {
        this.list.length = 0;
        this.main        = main;
        this.player      = main.player;
        this.enemy       = main.enemy;
        this.detriti     = this.main.detriti;
    }

    useIstance(map: any, blood: any) {
        this.map = map;
        this.blood = blood;
    }

    // collisione tra elementi della stessa imensione (tile e player)
    // SOURCE: https://codereview.stackexchange.com/questions/60439/2d-tilemap-collision-method
    checkmove(x: number, y: number): boolean {
        if (this.map.map[Math.floor(y / c.TILE_SIZE)][Math.floor(x / c.TILE_SIZE)].solid == 1
            || this.map.map[Math.floor(y / c.TILE_SIZE)][Math.ceil(x / c.TILE_SIZE)].solid == 1
            || this.map.map[Math.ceil(y / c.TILE_SIZE)][Math.floor(x / c.TILE_SIZE)].solid == 1
            || this.map.map[Math.ceil(y / c.TILE_SIZE)][Math.ceil(x / c.TILE_SIZE)].solid == 1) {
            return false;
        } else {
            return true;
        }
    }



    update() {
        let shot, i;
        for (i = this.list.length - 1; i >= 0; i--) {
            shot = this.list[i];
            shot.x += shot.vX;
            shot.y += shot.vY;

            // collisione con i muri
            if (/*!this.checkmove(/* shot.x - shot.r, shot.y - shot.r) || */
                !this.checkmove(shot.x + this.r, shot.y - this.r) ||
                !this.checkmove(shot.x - this.r, shot.y + this.r) /* || 
            !this.checkmove(shot.x + shot.r, shot.y + shot.r) */) {
                this.main.detriti.create(shot.x, shot.y, Math.random() * 2 - 2, Math.random() * 2 - 2, 3)
                this.pool.push(shot);
                this.list.splice(i, 1);
                continue
            }

            // si guarda se i proiettili di qualche nemico impattano il player
            if (shot.firedBy=='enemy' && Helper.circleCollision(shot, this.player)) {
                this.player.hp -= shot.damage;
                this.player.vX = shot.vX * 0.03;
                this.player.vY = shot.vY * 0.03;
                shot.hp = -99;
                this.blood.create(shot.x, shot.y,  Math.random() * 2 - 2, Math.random() * 2 - 2, 4) // crea il sangue
                if(this.player.hp<=0){
                    this.player.numberOfDeaths++;
                    this.player.loadDefault();
                }
                continue
            }

            // si guarda se i proiettili del player impattano qualche nemico
            for (let i = this.enemy.list.length - 1; i >= 0; i--) {
                const obj = this.enemy.list[i];
                if (shot.firedBy == 'player'&& Helper.circleCollision(shot, obj)) {
                    obj.hp -= shot.damage;
                    obj.vX = shot.vX * 0.03;
                    obj.vY = shot.vY * 0.03;
                    shot.hp = -99;
                    this.blood.create(shot.x, shot.y, Math.random() * 2 - 2, Math.random() * 2 - 2, 4) // crea il sangue
                    if (obj.hp <= 0) {
                        this.player.kills++;
                        obj.numberOfDeaths++;
                        // TODO: RESPAWN
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

    render() {
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

    create(x, y, vX, vY, firedBy:string) {
        let shot      = this.pool.length > 0 ? this.pool.pop(): {};
        shot.x       = x;
        shot.y       = y;
        shot.vX      = vX;
        shot.vY      = vY;
        shot.firedBy = firedBy;
        shot.r       = this.r;
        shot.damage  = this.damage;
        this.list.push(shot);
    }

    // se colpisce qualcosa si rimuove
    hit(i) {
        this.pool.push(this.list[i]);
        this.list.splice(i, 1)
    };
}

