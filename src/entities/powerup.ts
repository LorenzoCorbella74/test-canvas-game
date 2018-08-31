import { Helper } from '../helper';

export const tipiPowerUp = {
    'health':      { name: 'health', hp:5, color:'DodgerBlue', r: 5, spawnTime:  30000 },
    'megaHealth':  { name: 'megaHealth', hp:50, color:'DodgerBlue', r:10, spawnTime: 30000 },
    'armour':      { name: 'armour', ap:5, color:'green', r:5, spawnTime:  30000 },
    'megaArmour':  { name: 'megaArmour', ap:50, color:'green', r:10, spawnTime: 30000 },
    'quad':        { name: 'quad', multiplier:4, color:'violet', r:10, spawnTime: 30000, enterAfter: 60000, duration: 10000 },
    'speed':       { name: 'speed', multiplier: 1.5, color:'yellow', r:10, spawnTime: 30000, enterAfter: 30000, duration: 10000 },
    'ammoRifle':   { for:  'Rifle', color: 'brown', r:8, spawnTime:30000, amount:30 },
    'ammoShotgun': { for:  'Shotgun', color:'brown', r:8, spawnTime:30000,amount:24 },
    'ammoPlasma':  { for:  'Plasma', color: 'blue', r:8, spawnTime:30000,amount:25 },
    'ammoRocket':  { for:  'Rocket', color: 'red', r:8, spawnTime:30000,amount:5 },
    'ammoRailgun': { for:  'Railgun', color:'green', r:8, spawnTime:30000,amount:5 },
    'weaponShotgun':{ for: 'Shotgun', color:'brown', r:16, spawnTime:30000,amount:24 },
    'weaponPlasma':{ for:  'Plasma', color: 'blue', r:16, spawnTime:30000,amount:25 },
    'weaponRocket':{ for:  'Rocket', color: 'red', r:16, spawnTime:30000,amount:5 },
    'weaponRailgun':{ for: 'Railgun',color:'green', r:16, spawnTime:30000,amount:5 },
    'team1flag':{ name:  'team1flag', color: '#6688cc', r:1, spawnTime:0 },
    'team2flag':{ name: 'team2flag',color:'#f90c00', r:1, spawnTime:0 },
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

    create(x: number, y: number, type: string, index:number) {
        let powerup        = this.pool.length > 0 ? this.pool.pop(): new Object();
        powerup.type       = tipiPowerUp[type];
        powerup.index      = index;
        powerup.x          = x;
        powerup.y          = y;
        if(type.startsWith('ammo')||type.startsWith('weapon')){
            powerup.ref = type;                     // permette di distinguere tra bullet e weapons
            powerup.amount = powerup.type.amount;   // quanti bullet
            powerup.for = powerup.type.for;         // per quale arma
        }
        if(type.startsWith('team')){                // per bandiera nel CTF
            powerup.ref = type;                     // permette di distinguere se è del team1 o 2
            powerup.taken = false;                  // se è presa o no
            powerup.startx = x;                     // coordinate iniziali quando recuperata da elemento dello stesso team
            powerup.starty = y;
            console.log(powerup);
        }
        powerup.reloadRate = 0;
        powerup.spawnTime  = powerup.type.spawnTime;   // tempo impiegato per respawn
        if(powerup.type.name=='quad' || powerup.type.name=='speed'){
            powerup.visible = false;
            powerup.enterAfter = powerup.type.enterAfter;   // delay di entrata
            powerup.durationRate = 0;                       // indica il contatore della durata
            powerup.duration = powerup.type.duration;       // eventuale durata dell'effetto
            powerup.takenBy = {};                           // indica chi l'o sta utilizzando
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
        powerup.takenBy = who;
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

    deupgrade(powerup:any){
        if(powerup.type.name=='regeneration'){
           console.log('TO DO!');
        } else if (powerup.type.name=='speed'){
            powerup.takenBy.speed /= powerup.type.multiplier;
        } else if (powerup.type.name=='quad'){
            powerup.takenBy.damage /= powerup.type.multiplier;
        }
    }

    update(dt:number, timestamp:number) {
        for (var i = this.list.length - 1; i >= 0; i--) {
            var powerup = this.list[i];

            powerup.currentAngle += dt * 0.004;             // animazione del cerchio esterno...
            powerup.angleForDinamicRadius += 2*Math.PI/60;  // animazione del raggio dinamico di 6° a frame

            /// reset angle
            powerup.currentAngle %= 2 * Math.PI;

            if (!powerup.visible) {
                powerup.reloadRate+= dt;  // si inizia a contare se non visibile
            }

            // se non è visibile e ha una durata inizia a contare la durata dell'effetto (quad, speed, etc)
            if(!powerup.visible && powerup.duration && powerup.startDurationRate){
                powerup.durationRate+= dt;
            }

            // si guarda se i powerup entrano in contatto con il player
            if (powerup.visible && Helper.circleCollision(powerup, this.player)) {
                for (var j = 0; j < 10; j++) {
                    // TODO: cambiare effetto !!!
                    this.particelle.create(powerup.x, powerup.y, Math.random() * 2 - 2, Math.random() * 2 - 2, 2 , powerup.color)
                }
                powerup.visible = false;
                if(powerup.duration){
                    powerup.startDurationRate= true;
                }  
                this.upgrade(powerup, this.player);
                // se AMMO o WEAPON
                if(powerup.ref){
                    if(powerup.ref.startsWith('weapon')){
                        this.player.weaponsInventory.setAvailabilityAndNumOfBullets(powerup.for, powerup.amount);
                    } else{
                        this.player.weaponsInventory.setNumOfBullets(powerup.for, powerup.amount);
                    }
                }
            }

            // si guarda se i powerup entrano in contatto con qualche nemico
            for (let i = this.bots.list.length - 1; i >= 0; i--) {
                const bot = this.bots.list[i];
                if (powerup.visible && Helper.circleCollision(powerup, bot)) {
                    for (var j = 0; j < 12; j++) {
                        this.particelle.create(powerup.x, powerup.y, Math.random() * 2 - 2, Math.random() * 2 - 2, 5, powerup.color)
                    }
                    powerup.visible = false;
                    if(powerup.duration){
                        powerup.startDurationRate= true;
                    }  
                    this.upgrade(powerup, bot);
                    // se AMMO o WEAPON
                    if(powerup.ref){
                        if(powerup.ref.startsWith('weapon')){
                            bot.weaponsInventory.setAvailabilityAndNumOfBullets(powerup.for, powerup.amount);
                            bot.weaponsInventory.getBest();
                            bot.currentWeapon = bot.weaponsInventory.selectedWeapon;	// arma corrente
                        } else{
                            bot.weaponsInventory.setNumOfBullets(powerup.for, powerup.amount);
                        }
                    }

                }
            }

            // RESPAWN
            if (powerup.reloadRate > (powerup.spawnTime + powerup.enterAfter) ) {	// numero di cicli oltre il quale è nuovamente visibile
                powerup.visible = true;
                powerup.reloadRate = 0;
            }
                
            // FINE EFFETTO 
            if(powerup.durationRate> powerup.duration){
                this.deupgrade(powerup);   // FIXME: per ora è solo per il player...
                powerup.startDurationRate= false;
                powerup.durationRate = 0;
            }
        }
    }

    render() {
        for (let i = this.list.length - 1; i >= 0; i--) {
            let powerup = this.list[i];
            // tutti i powerup tranne ammo e weapons
            if (powerup.visible && !powerup.ref) {
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
                if (this.main.debug) {
                    this.ctx.font = 'bold 8px/1 Arial';
                    this.ctx.fillStyle = 'black';
                    this.ctx.fillText(powerup.index.toString(), powerup.x - this.main.camera.x - 6, powerup.y - this.main.camera.y -12);
                }

            } 
        
            if(powerup.ref && powerup.ref.startsWith('team')){ // per bandiera nel CTF
                // CTF FLAGS
                let x = powerup.x - this.main.camera.x;
                let y = powerup.y - this.main.camera.y;
                this.ctx.beginPath();
                this.ctx.moveTo(x, y);
                this.ctx.lineTo(x, y-40);
                this.ctx.rect(x, y-40, 40, 20);
                this.ctx.fillStyle=powerup.color;
                this.ctx.strokeStyle = 'black';
                this.ctx.fill();
                this.ctx.stroke();
                this.ctx.closePath();   
                if (this.main.debug) {
                    this.ctx.font = 'bold 8px/1 Arial';
                    this.ctx.fillStyle = 'black';
                    this.ctx.fillText(powerup.index.toString(), powerup.x - this.main.camera.x - 6, powerup.y - this.main.camera.y -12);
                }  
            } else if(powerup.visible && powerup.ref ){
                // AMMO e WEAPONS
                let x = powerup.x - this.main.camera.x;
                let y = powerup.y - this.main.camera.y;
                this.ctx.beginPath();
                this.ctx.arc(x, y, powerup.r, 0, 6.2832);
                this.ctx.fillStyle = powerup.color;
                this.ctx.fill();
                this.ctx.closePath();
                if (this.main.debug) {
                    this.ctx.font = 'bold 8px/1 Arial';
                    this.ctx.fillStyle = 'black';
                    this.ctx.fillText(powerup.index.toString(), powerup.x - this.main.camera.x - 6, powerup.y - this.main.camera.y -12);
                }
            }

        }
    }
}

