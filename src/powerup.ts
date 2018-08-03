import { Helper } from './helper';
import { conf as c } from './config';

export const tipiPowerUp = {
    'health': { hp:5, color:'blue', r:5 },
    'megaHealth':{ hp:100, color:'blue', r: 10},
    'armour': { ap:5, color:'green', r:5 },
    'megaArmour':{ ap:50, color:'green', r: 10}
}

export class PowerUp {

    // caratteristiche di ogni powerup
    // radius: number = c.POWERUP_RADIUS;
    // reloadRate: number  = 1000;   // cicli entro cui riappaiono una volta entrati in contatto
    // visible:    boolean = true;

    list: any[] = [];
    pool: any[] = [];

    player:  any;
    bots:    any;
    detriti: any;
    ctx:     any;
    main:    any;

    constructor(main: any) {
        this.main    = main;
        this.player  = main.player;
        this.bots    = main.enemy;
        this.ctx     = main.ctx;
        this.detriti = main.detriti;
    }

    update() {
        for (var i = this.list.length - 1; i >= 0; i--) {
            var powerup = this.list[i];

            if (!powerup.visible) {
                powerup.reloadRate++;  // si inizia a contare se non visibile
            }

            // si guarda se i powerup entrano in contatto con il player
            if (powerup.visible && Helper.circleCollision(powerup, this.player)) {
                    this.player.hp += 5;
                    for (var j = 0; j < 10; j++) {
                        this.detriti.create(powerup.x, powerup.y, Math.random() * 2 - 1, Math.random() * 2 - 1, 2 , powerup.color)
                    }
                    powerup.visible = false;
            }


            // si guarda se i powerup entrano in contatto con qualche nemico
            for (let i = this.bots.list.length - 1; i >= 0; i--) {
                const bot = this.bots.list[i];
                if (powerup.visible && Helper.circleCollision(powerup, bot)) {
                        bot.hp += 5;
                        for (var j = 0; j < 9; j++) {
                            this.detriti.create(powerup.x, powerup.y, Math.random() * 2 - 1, Math.random() * 2 - 1, 2, powerup.color)
                        }
                        powerup.visible = false;
                }
            }

            if (powerup.reloadRate > 1000) {	// numero di cicli oltre il quale è nuovamente visibile
                powerup.visible = true;
                powerup.reloadRate = 0;
            }
        }
    };

    render() {
        for (let i = this.list.length - 1; i >= 0; i--) {
            let powerup = this.list[i];
            let x = powerup.x - this.main.camera.x;
            let y = powerup.y - this.main.camera.y;
            if (powerup.visible) {
                this.ctx.beginPath();
                this.ctx.arc(x, y, powerup.r, 0, 6.2832);
                this.ctx.fillStyle = powerup.color;
                this.ctx.fill();
                this.ctx.closePath()
            }

        }
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
}

