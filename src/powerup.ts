import { Helper } from './helper';

export const tipiPowerUp = {
    'health': { hp:5, color:'blue', r:5 },
    'megaHealth':{ hp:100, color:'blue', r: 10},
    'armour': { ap:5, color:'green', r:5 },
    'megaArmour':{ ap:50, color:'green', r: 10}
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
        let tipo = tipiPowerUp[type];
        let powerup        = this.pool.length > 0 ? this.pool.pop(): new Object();
        powerup.x          = x;
        powerup.y          = y;
        powerup.reloadRate = 0;
        powerup.visible    = true;
        powerup.r          = tipo.r;
        powerup.color      = tipo.color;
        this.list.push(powerup);
    };

    update(progress:number) {
        for (var i = this.list.length - 1; i >= 0; i--) {
            var powerup = this.list[i];

            if (!powerup.visible) {
                powerup.reloadRate+= progress;  // si inizia a contare se non visibile
            }

            // si guarda se i powerup entrano in contatto con il player
            if (powerup.visible && Helper.circleCollision(powerup, this.player)) {
                    this.player.hp += 5;
                    for (var j = 0; j < 10; j++) {
                        this.particelle.create(powerup.x, powerup.y, Math.random() * 2 - 1, Math.random() * 2 - 1, 2 , powerup.color)
                    }
                    powerup.visible = false;
            }


            // si guarda se i powerup entrano in contatto con qualche nemico
            for (let i = this.bots.list.length - 1; i >= 0; i--) {
                const bot = this.bots.list[i];
                if (powerup.visible && Helper.circleCollision(powerup, bot)) {
                        bot.hp += 5;
                        for (var j = 0; j < 12; j++) {
                            this.particelle.create(powerup.x, powerup.y, Math.random() * 2 - 5, Math.random() * 2 - 5, 5, powerup.color)
                        }
                        powerup.visible = false;
                }
            }

            if (powerup.reloadRate > this.c.POWERUP_SPAWN_TIME) {	// numero di cicli oltre il quale è nuovamente visibile
                powerup.visible = true;
                powerup.reloadRate = 0;
            }
        }
    };

    render(progress:number) {
        for (let i = this.list.length - 1; i >= 0; i--) {
            let powerup = this.list[i];
            if (powerup.visible) {
                let x = powerup.x - this.main.camera.x;
                let y = powerup.y - this.main.camera.y;
                this.ctx.beginPath();
                this.ctx.arc(x, y, powerup.r, 0, 6.2832);
                this.ctx.fillStyle = powerup.color;
                this.ctx.fill();
                this.ctx.closePath()
            }

        }
    }
}

