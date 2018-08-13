import { Helper } from './helper';

export const tipiPowerUp = {
    'health': { name: 'health', hp: 5, color: 'DodgerBlue', r: 5, spawnTime: 30000 },
    'megaHealth': { name: 'megaHealth', hp: 50, color: 'blue', r: 10, spawnTime: 30000 },
    'armour': { name: 'armour', ap: 5, color: 'green', r: 5,, spawnTime: 30000 },
    'megaArmour': { name: 'megaArmour', ap: 50, color: 'green', r: 10, spawnTime: 30000 },
    'quad': { name: 'quad', multiplier: 4, color: 'violet', r: 10, spawnTime: 30000, enterAfter: 1000, duration: 20000 },
    'speed': { name: 'speed', multiplier: 2, color: 'yellow', r: 10, spawnTime: 30000, enterAfter: 1000, duration: 20000 },
}

export class PowerUp {

    list: any[] = [];
    pool: any[] = [];

    player:     any;
    bots:       any;
    particelle: any;
    ctx:        any;
    main:       any;
    c:          any;

    constructor() { 
    }

    init(main: any){
        this.list = [];
        this.main       = main;
        this.c          = main.c;
        this.player     = main.player;
        this.bots       = main.enemy;
        this.ctx        = main.ctx;
        this.particelle = main.particelle;
    }

    create(x: number, y: number, type: string) {
        let powerup        = this.pool.length > 0 ? this.pool.pop(): new Object();
        powerup.type       = tipiPowerUp[type];
        powerup.x            = x;
        powerup.y            = y;
        powerup.reloadRate   = 0;
        powerup.spawnTime   = powerup.type.spawnTime;   // tempo impiegato per respawn
        if(powerup.type.name=='quad' || powerup.type.name=='speed'){
            powerup.visible = false;
            powerup.enterAfter = powerup.type.enterAfter;   // delay di entrata
            powerup.durationRate = 0;
            powerup.duration = powerup.type.duration;       // eventuale durata dell'effetto
        } else {
            powerup.enterAfter = 0;
            powerup.visible    = true;
        }
        powerup.r            = powerup.type.r;  // raggio esterno rotante
        powerup.r1           = powerup.type.r;  // raggio interno dinamico
        powerup.color        = powerup.type.color;
        // animazione SOURCE: https://stackoverflow.com/questions/20445357/canvas-rotate-circle-in-certain-speed-using-requestanimationframe
        powerup.startAngle   = 2*Math.PI;
        powerup.endAngle     = Math.PI*1.5;
        powerup.currentAngle = 0;
        powerup.angleForDinamicRadius = 0;   // animazione del raggio dinamico
        this.list.push(powerup);
    };

    upgrade(powerup:any, who:any){
        if(powerup.type.name=='health'){
            who.hp += powerup.type.hp;
        } else if (powerup.type.name=='armour'){
            who.ap += powerup.type.ap;
        } else if (powerup.type.name=='megaHealth'){
            who.hp += powerup.type.hp;
        } else if (powerup.type.name=='megaArmour'){
            who.ap += powerup.type.ap;
        } else if (powerup.type.name=='quad'){
             who.damage *= powerup.type.multiplier;
        } else if (powerup.type.name=='speed'){
             who.speed *= powerup.type.multiplier;
        }
    }

    deupgrade(powerup:any, who:any){
        if(powerup.type.name=='regeneration'){
           console.log('TO DO!');
        } else if (powerup.type.name=='speed'){
            who.speed /= powerup.type.multiplier;
        } else if (powerup.type.name=='quad'){
            who.damage /= powerup.type.multiplier;
        }
    }

    update(progress:number) {
        for (var i = this.list.length - 1; i >= 0; i--) {
            var powerup = this.list[i];

            powerup.currentAngle += progress * 0.004;       // animazione del cerchio esterno...
            powerup.angleForDinamicRadius += 2*Math.PI/60;  // animazione del raggio dinamico di 6° a frame

            /// reset angle
            powerup.currentAngle %= 2 * Math.PI;

            if (!powerup.visible) {
                powerup.reloadRate+= progress;  // si inizia a contare se non visibile
            }

            // se non è visibile e ha una durata inizia a contare la durata dell'effetto (quad, speed, etc)
            if(!powerup.visible && powerup.duration && powerup.startDurationRate){
                powerup.durationRate+= progress;
            }

            // si guarda se i powerup entrano in contatto con il player
            if (powerup.visible && Helper.circleCollision(powerup, this.player)) {
                for (var j = 0; j < 10; j++) {
                    this.particelle.create(powerup.x, powerup.y, Math.random() * 2 - 5, Math.random() * 2 - 5, 2 , powerup.color)
                }
                powerup.visible = false;
                if(powerup.duration){
                    powerup.startDurationRate= true;
                }  
                this.upgrade(powerup, this.player);
            }

            // si guarda se i powerup entrano in contatto con qualche nemico
            for (let i = this.bots.list.length - 1; i >= 0; i--) {
                const bot = this.bots.list[i];
                if (powerup.visible && Helper.circleCollision(powerup, bot)) {
                    for (var j = 0; j < 12; j++) {
                        this.particelle.create(powerup.x, powerup.y, Math.random() * 2 - 5, Math.random() * 2 - 5, 5, powerup.color)
                    }
                    powerup.visible = false;
                    if(powerup.duration){
                        powerup.startDurationRate= true;
                    }  
                    this.upgrade(powerup, bot);
                }
            }

            // RESPAWN
            if (powerup.reloadRate > (powerup.spawnTime + powerup.enterAfter) ) {	// numero di cicli oltre il quale è nuovamente visibile
                powerup.visible = true;
                powerup.reloadRate = 0;
            }
            
            // FINE EFFETTO 
            if(powerup.durationRate> powerup.duration){
                this.deupgrade(powerup, this.player);   // FIXME: per ora è solo per il player...
                powerup.startDurationRate= false;
                powerup.durationRate = 0;
            }
        }
    }

    render(progress:number) {
        for (let i = this.list.length - 1; i >= 0; i--) {
            let powerup = this.list[i];
            if (powerup.visible) {
                // centro pulsante
                powerup.r1 =  2 + 0.1 + Math.sin(powerup.angleForDinamicRadius)*2;   // il sin va da -1 a +1
                let x = powerup.x - this.main.camera.x;
                let y = powerup.y - this.main.camera.y;
                this.ctx.beginPath();
                this.ctx.arc(x, y, powerup.r1, 0, 6.2832);
                this.ctx.fillStyle = powerup.color;
                this.ctx.fill();
                this.ctx.closePath()

                // cerchio esterno
                this.ctx.beginPath();                  
                this.ctx.arc(x, y, powerup.r + 2.5, powerup.startAngle + powerup.currentAngle, powerup.endAngle + powerup.currentAngle, false);
                this.ctx.strokeStyle = powerup.color;
                this.ctx.lineWidth = 2.0;
                this.ctx.stroke();
            }

        }
    }
}

