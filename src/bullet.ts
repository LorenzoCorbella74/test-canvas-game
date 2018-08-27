import { Helper } from './helper';

export class BulletHandler {

    list: any[] = [];
    pool: any[] = []

    main:       any;
    c:          any;
    player:     any;
    enemy:      any;
    map:        any;
    particelle: any;
    blood:      any;


    constructor() { }

    init(main: any) {
        this.list.length = 0;
        this.main        = main;
        this.c           = main.c;
        this.player      = main.player;
        this.enemy       = main.enemy;
        this.particelle  = main.particelle;
        this.map         = main.currentMap;
        this.blood       = main.blood;
    }

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

    doExplosion(shot:any){
        let magnitude = 2;
        // let type =Object.assign(shot.type,{r:this.c.TILE_SIZE*1.5})
        // si crea uno shot che verrà analizzato nel prossimo update() avente il raggio dell'esplosione
        // this.create( shot.x, shot.y, 0, 0, shot.firedBy, shot.index, 50, type)
        for (let b = 0; b < 50; b++) {
            this.main.particelle.create(shot.x, shot.y, Math.random() * magnitude - magnitude, Math.random() * magnitude - magnitude, Helper.randf(this.c.DEBRIS_RADIUS, 20), Helper.randomElementInArray(this.c.FIRE_EXPLOSION))
        }
    }

    update(dt: number) {
        let shot, i;
        for (i = this.list.length - 1; i >= 0; i--) {
            shot = this.list[i];
            shot.old_x = shot.x;
            shot.old_y = shot.y;
            shot.x += shot.vX;
            shot.y += shot.vY;

            shot.angleForDinamicRadius += 2*Math.PI/30;  // animazione del raggio dinamico di 36° a frame

            // collisione con i muri
            if (this.myCheckCollision(shot, this.map.map)) {
                // TODO: la velocità deve invertire su un solo asse quella del bullet...
                this.main.particelle.create(shot.x, shot.y, Math.random() * shot.vX / 3.5, Math.random() * shot.vY / 3.5, this.c.DEBRIS_RADIUS)
                if(shot.explode){
                    this.doExplosion(shot);
                }
                this.pool.push(shot);
                this.list.splice(i, 1);
                continue
            }

            // bullet sparati da bot a bot (non il player... chiSparaTarget.index!=100 )
            let chiSpara = this.enemy.list[shot.index];
            if (chiSpara) {
                let chiSparaTarget = chiSpara.target || {};
                if (shot.index == chiSpara.index && chiSparaTarget.alive && chiSparaTarget.index!=100 && Helper.circleCollision(shot, chiSparaTarget)) {
                    if(shot.explode){
                        this.doExplosion(shot);
                    }
                    chiSparaTarget.hp -= shot.damage;
                    this.blood.create(shot.x, shot.y, Math.random() * 4 - 4, Math.random() * 4 - 4, this.c.BLOOD_RADIUS) // crea il sangue
                    this.pool.push(shot);
                    this.list.splice(i, 1);
                    if (chiSparaTarget.hp <= 0) {
                        chiSparaTarget.alive = false;
                        chiSparaTarget.numberOfDeaths++;
                        for (let b = 0; b < 36; b++) {
                            this.blood.create(shot.x, shot.y, Math.random() * 4 - 4 * i, Math.random() * 4 - 4 * i, this.c.BLOOD_RADIUS) // crea il sangue
                        }
                        this.enemy.list[shot.index].kills++;    // si aumenta lo score del bot che ha sparato il proiettile
                        console.log(`BOT ${chiSpara.index} killed BOT ${chiSparaTarget.index}`);
                        setTimeout(() => {
                            this.enemy.respawn(chiSparaTarget);
                        }, this.c.GAME_RESPAWN_TIME);
                    }
                    this.pool.push(shot);
                    this.list.splice(i, 1);
                    continue
                }
            }


            // si guarda se i proiettili di qualche nemico impattano il player
            if (shot.firedBy == 'enemy' && this.player.alive && Helper.circleCollision(shot, this.player)) {
                if(shot.explode){
                    this.doExplosion(shot);
                }
                if(!this.player.godMode){
                    this.player.hp -= shot.damage;
                }
                this.blood.create(shot.x, shot.y, Math.random() * 2 - 2, Math.random() * 2 - 2, this.c.BLOOD_RADIUS) // crea il sangue
                this.pool.push(shot);
                this.list.splice(i, 1);
                if (this.player.hp <= 0) {
                    this.player.alive = false;
                    this.player.numberOfDeaths++;
                    for (let b = 0; b < 36; b++) {
                        this.blood.create(shot.x, shot.y, Math.random() * 2 - 2 * i, Math.random() * 2 - 2 * i, this.c.BLOOD_RADIUS) // crea il sangue
                    }
                    this.enemy.list[shot.index].kills++;    // si aumenta lo score del bot che ha sparato il proiettile
                    let currentActorInCamera = this.enemy.list[shot.index];
                    this.main.camera.setCurrentPlayer(currentActorInCamera);
                    this.main.camera.adjustCamera(currentActorInCamera);
                    // setTimeout(() =>this.player.respawn(), this.c.GAME_RESPAWN_TIME);
                    console.log(`BOT ${shot.index} killed Player ${this.player.index}.`);
                }
                this.pool.push(shot);
                this.list.splice(i, 1);
                continue
            }

            // si guarda se i proiettili del player impattano qualche nemico
            for (let i = this.enemy.list.length - 1; i >= 0; i--) {
                const bot = this.enemy.list[i];
                if (shot.firedBy == 'player' && bot.alive && Helper.circleCollision(shot, bot)) {
                    bot.hp -= shot.damage;
                    this.blood.create(shot.x, shot.y, Math.random() * 2 - 2, Math.random() * 2 - 2, this.c.BLOOD_RADIUS) // crea il sangue
                    if (bot.hp <= 0) {
                        bot.alive = false;
                        this.player.kills++;
                        bot.numberOfDeaths++;
                        for (let b = 0; b < 36; b++) {
                            this.blood.create(shot.x, shot.y, Math.random() * 2 - 2 * i, Math.random() * 2 - 2 * i, this.c.BLOOD_RADIUS) // crea il sangue
                        }
                        console.log(`PLayer killed BOT ${bot.index}.`);
                        setTimeout(() => {
                            this.enemy.respawn(bot);
                        }, this.c.GAME_RESPAWN_TIME);
                    }
                    this.pool.push(shot);
                    this.list.splice(i, 1);
                    continue
                }
            }

            // diverse visualizzazioni proiettili
            if(shot.type.name=='Plasma'){
                shot.r =1 + Math.abs(Math.sin(shot.angleForDinamicRadius))*5;
            }
            /* if(shot.type.name=='Railgun'){
                let time = new Date().getTime()+dt;// in ms
                let period = 250;// in ms
                let amplitude = 30; // in px
                shot.vX  += amplitude * Math.sin(time + 2 * Math.PI / period);
                shot.vY  += amplitude * Math.cos(time + 2 * Math.PI / period);
            } */
            // decremento del proiettile
            shot.ttl -= dt;
            if (shot.ttl <= 0) {
                this.pool.push(shot);
                this.list.splice(i, 1);
                continue
            }
        }
    }

    render(dt: number) {
        for (let j = this.list.length - 1; j >= 0; j--) {
            const shot = this.list[j];
            let x = shot.x - this.main.camera.x;
            let y = shot.y - this.main.camera.y;
            this.main.ctx.beginPath();
            this.main.ctx.arc(x, y, shot.r, 0, 6.2832);
            if(shot.type.name=='Flamer'){
                this.main.ctx.fillStyle = Helper.randomElementInArray(this.c.FIRE_IN_LAVA); // 'rgba(0,0,0,0.66)';
            } else if(shot.type.name=='Plasma'){
                this.main.ctx.fillStroke = shot.color;
            } else{
                this.main.ctx.fillStyle = shot.color; // 'rgba(0,0,0,0.66)';
            }
            this.main.ctx.fill();
            this.main.ctx.closePath()
        }
    }

    create(x: number, y: number, vX: number, vY: number, firedBy: string, index: number, damage:number, type?: any) {
        let shot = /* this.pool.length > 0 ? this.pool.pop() : */ {};
        shot.old_x   = x;
        shot.x       = x;
        shot.old_y   = y;
        shot.y       = y;
        shot.index   = index;   // è l'id del 
        shot.firedBy = firedBy; // indica da chi è sparato il colpo ( player, enemy )
        shot.type    = type;
        if(shot.type.name=='Plasma' || shot.type.name=='Railgun'){
            shot.angleForDinamicRadius = 0;
        }
        shot.vX  = vX * type.speed + Math.random() * type.spread * 2 - type.spread;
        shot.vY  = vY  * type.speed + Math.random() * type.spread * 2 - type.spread;
        
        shot.r       = type.r;
        shot.ttl     = type.ttl;
        shot.color   = type.color;
        shot.damage  = damage ? damage * type.damage: type.damage;
        shot.explode = type.explode;
        this.list.push(shot);
    }

}

