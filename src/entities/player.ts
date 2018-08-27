import { Helper } from '../helper';
import { WeaponsInventory } from './weapons';
export class Player {

	// PLAYER
	x: number;
	old_x: number;
	y: number;
	old_y: number;
	r: number
	speed: number;
	angle: number;				// angolo con il mirino (dove punta l'arma)

	name: string;
	hp: number;					// punti vita
	ap: number;					// punti armatura
	kills: number;				// nemici uccisi
	score: number = 0;			// numero di uccisioni
	numberOfDeaths: number;		// numero di volte in vui è stato ucciso

	trails: any[] = [];

	damage: number;				// 1 capacità di far danno 1 normale 4 quaddamage
	alive: boolean;				// se il player è vivo o morto ()
	index: number;				// è l'id del giocatore
	respawnTime: number = 0;
	
	godMode: boolean = false;

	team:string;
	
	weaponsInventory: WeaponsInventory;
	currentWeapon: any;			// arma corrente
	attackCounter: number = 0;		// frequenza di sparo
	// shootRate:     number = 200;	// frequenza di sparo

	canvas:  any;
	ctx:     any;
	camera:  any;
	main:    any
	enemy:   any
	c:       any
	map:     any
	control: any;
	bullet:  any;


	constructor() {
	}

	init(main: any) {
		this.main = main;
		this.c = main.c;
		this.canvas = main.canvas;
		this.ctx = main.ctx;
		this.camera = main.camera;
		this.enemy = main.enemy;
		this.bullet = main.bullet;
		this.map = main.currentMap;
		this.control = main.control;
	}

	createPlayer() {
		this.name = "Lorenzo";
		this.index = 100;
		this.alive = true;				// 
		// const spawn = Helper.getSpawnPoint(this.main.data.spawn);
		this.x     = 400;
		this.old_x = 400;
		this.y     = 300;
		this.old_y = 300;
		this.team = 'team1';
		//this.camera.adjustCamera(this);
		this.r = this.c.PLAYER_RADIUS
		this.speed = this.c.PLAYER_SPEED;	// è uguale in tutte le direzioni
		this.damage = 1;					// danno da moltiplicare per 4 con quad damage
		this.angle = 0;						// angolo tra asse x e puntatore del mouse
		this.hp = this.c.PLAYER_HP;			// punti vita
		this.ap = this.c.PLAYER_AP;			// punti armatura
		this.kills = 0;						// uccisioni
		this.numberOfDeaths = 0;	    	// numero di volte in cui è stato ucciso

		this.weaponsInventory = new WeaponsInventory();
		this.currentWeapon = this.weaponsInventory.selectedWeapon;		// arma corrente
	}

	storePosForTrail(x: number, y: number) {
		// push an item
		this.trails.push({ x, y });
		//get rid of first item
		if (this.trails.length > this.c.MOTION_TRAILS_LENGTH) {
			this.trails.shift();
		}
	}

	hotKey(keyCode:number) {
		if (keyCode == 48) {
			keyCode = 58
		}
		if (keyCode - 49 in this.weaponsInventory.weapons) {
			this.weaponsInventory.weapon = keyCode - 49;
			// se disponibile si sceglie
			if(this.weaponsInventory.weapons[this.weaponsInventory.weapon].available){
				this.weaponsInventory.selectedWeapon = this.weaponsInventory.weapons[this.weaponsInventory.weapon];
				this.currentWeapon = this.weaponsInventory.selectedWeapon;		// arma corrente
			}
		}
	}

	wheel(delta: number) {
		if (delta > 0) {
			if (this.weaponsInventory.weapon <= 0) {
				this.weaponsInventory.weapon = this.weaponsInventory.weapons.length - 1
			} else {
				this.weaponsInventory.weapon--;
			}
		} else {
			if (this.weaponsInventory.weapon >= this.weaponsInventory.weapons.length - 1) {
				this.weaponsInventory.weapon = 0
			} else {
				this.weaponsInventory.weapon++;
			}
		}
		// se disponibile si sceglie
		if(this.weaponsInventory.weapons[this.weaponsInventory.weapon].available){
			this.weaponsInventory.selectedWeapon = this.weaponsInventory.weapons[this.weaponsInventory.weapon];
			this.currentWeapon = this.weaponsInventory.selectedWeapon;		// arma corrente
		}

	}

	private getPlayerColour() {
		if (this.speed > 4 / 16) {
			return 'yellow';
		}
		if (this.damage > 1) {
			return 'violet';
		}
		return this.c.PLAYER_COLOUR_INSIDE;
	}

	render() {
		if (this.alive) {	// solo se il player è vivo!

			// trails
			 for (let i = 0; i < this.trails.length; i++) {
			 	let ratio = (i + 1) / this.trails.length;
			 	this.ctx.beginPath();
			 	this.ctx.arc(this.trails[i].x - this.camera.x, this.trails[i].y - this.camera.y, ratio * this.r *(3/ 5) + this.r *(2/ 5), 0, 2 * Math.PI, true);
			 	this.ctx.fillStyle = this.ctx.fillStyle = `rgb(127, 134, 135,${ratio/2})`;
			 	this.ctx.fill();
			 }
			// draw the colored region
			this.ctx.beginPath();
			this.ctx.arc(this.x - this.camera.x, this.y - this.camera.y, this.r, 0, 2 * Math.PI, true);
			this.ctx.fillStyle = this.getPlayerColour();
			this.ctx.fill();

			// draw the stroke
			this.ctx.lineWidth = 2;
			this.ctx.strokeStyle = this.c.PLAYER_COLOUR_OUTSIDE;
			this.ctx.stroke();


			// beccuccio arma
			this.ctx.strokeStyle = this.c.PLAYER_COLOUR_OUTSIDE;
			this.ctx.beginPath();
			this.ctx.moveTo(this.x - this.camera.x, this.y - this.camera.y);
			var pointerLength = 12.5;
			this.ctx.lineTo(
				this.x - this.camera.x + pointerLength * Math.cos(this.angle),
				this.y - this.camera.y + pointerLength * Math.sin(this.angle)
			);
			this.ctx.stroke();

			if (this.main.debug) {
				this.ctx.font = 'bold 8px/1 Arial';
				this.ctx.fillStyle = 'black';
				this.ctx.fillText(this.x.toFixed(2).toString(), this.x - this.camera.x - 5, this.y - this.camera.y - 15);
				this.ctx.fillText(this.y.toFixed(2).toString(), this.x - this.camera.x - 5, this.y - this.camera.y + 20);
			}
		}
	}

	respawn() {
		const spawn = Helper.getSpawnPoint(this.main.data.spawn);
		console.log(`Player is swawning at ${spawn.x} - ${spawn.y}`);
		this.index = 100;
		this.x = spawn.x;
		this.y = spawn.y;
		this.camera.setCurrentPlayer(this);
		this.camera.adjustCamera(this);
		this.r = this.c.PLAYER_RADIUS
		this.speed = this.c.PLAYER_SPEED;	// è uguale in tutte le direzioni
		this.damage = 1;					// è il moltiplicatore del danno (quad = 4)
		this.angle = 0;						// angolo tra asse x e puntatore del mouse
		this.hp = this.c.PLAYER_HP;			// punti vita
		this.ap = this.c.PLAYER_AP;			 // punti armatura
		this.alive = true;					// il player è nuovamente presente in gioco
		// this.kills = 0;					// si mantengono...
		// this.numberOfDeaths = 0;	    	// si mantengono...

		this.weaponsInventory.resetWeapons();                    	// munizioni e disponibilità default
		this.weaponsInventory.setWeapon(0);							// arma default
		this.currentWeapon = this.weaponsInventory.selectedWeapon;	// arma corrente
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

	isLavaOrToxic(x: number, y: number): void {
		if (this.map.map[Math.floor(y / this.c.TILE_SIZE)][Math.floor(x / this.c.TILE_SIZE)] == 3
			|| this.map.map[Math.floor(y / this.c.TILE_SIZE)][Math.ceil(x / this.c.TILE_SIZE)] == 3
			|| this.map.map[Math.ceil(y / this.c.TILE_SIZE)][Math.floor(x / this.c.TILE_SIZE)] == 3
			|| this.map.map[Math.ceil(y / this.c.TILE_SIZE)][Math.ceil(x / this.c.TILE_SIZE)] == 3
			|| this.map.map[Math.floor(y / this.c.TILE_SIZE)][Math.floor(x / this.c.TILE_SIZE)] == 4
			|| this.map.map[Math.floor(y / this.c.TILE_SIZE)][Math.ceil(x / this.c.TILE_SIZE)] == 4
			|| this.map.map[Math.ceil(y / this.c.TILE_SIZE)][Math.floor(x / this.c.TILE_SIZE)] == 4
			|| this.map.map[Math.ceil(y / this.c.TILE_SIZE)][Math.ceil(x / this.c.TILE_SIZE)] == 4
		) {
			this.hp -= 0.5;
			for (var j = 0; j < 24; j++) {
				this.main.particelle.create(this.x + Helper.randBetween(-this.r, this.r), this.y + Helper.randBetween(-this.r, this.r), Math.random() * 2 - 2, Math.random() * 2 - 2, 2, Helper.randomElementInArray(this.c.FIRE_IN_LAVA))
			}
			if (this.hp <= 0) {
				this.alive = false;
				this.numberOfDeaths++;
				for (let b = 0; b < 36; b++) {
					this.main.blood.create(this.x, this.y, Math.random() * 2 - 2, Math.random() * 2 - 2, this.c.BLOOD_RADIUS) // crea il sangue
				}
				let currentActorInCamera = this.enemy.list[0];
				this.main.camera.setCurrentPlayer(currentActorInCamera);
				this.main.camera.adjustCamera(currentActorInCamera);
				// setTimeout(() =>this.player.respawn(), this.c.GAME_RESPAWN_TIME);
				console.log(`Player killed by lava.`);
			}
		}
	}

	collisionDetection(dt: number) {
		let spostamento = this.speed * dt;
		this.old_x = this.x;
		this.old_y = this.y;
		if (this.control.w) { // W 
			// collisione con nemici
			this.enemy.list.forEach((enemy:any) => {
				if(enemy.alive && Helper.circleCollision(enemy, this)){
					this.y += 4*spostamento;
				}
			});
			if (this.checkmove(this.x - this.r, this.y - this.r - spostamento)) {
				this.y -= spostamento;
				if (this.y - this.r < this.camera.y) {
					this.y = this.camera.y + this.r;
				}
			}
		}
		if (this.control.s) {	// S
			// collisione con nemici
			this.enemy.list.forEach((enemy:any) => {
				if(enemy.alive && Helper.circleCollision(enemy, this)){
					this.y -= 4*spostamento;
				}
			});
			if (this.checkmove(this.x - this.r, this.y - this.r + spostamento)) {
				this.y += spostamento;
				if (this.y + this.r >= this.camera.y + this.camera.h) {
					this.y = this.camera.y + this.camera.h - this.r;
				}
	
			}
		}
		if (this.control.a) {	// a
			// collisione con nemici
			this.enemy.list.forEach((enemy:any) => {
				if(enemy.alive && Helper.circleCollision(enemy, this)){
					this.x += 4*spostamento;
				}
			});
			if (this.checkmove(this.x - this.r - spostamento, this.y - this.r)) {
				this.x -= spostamento;
				if (this.x - this.r < this.camera.x) {
					this.x = this.camera.x + this.r;
				}
			}
		}
		if (this.control.d) {	// d
			// collisione con nemici
			this.enemy.list.forEach((enemy:any) => {
				if(enemy.alive && Helper.circleCollision(enemy, this)){
					this.y -= 4* spostamento;
				}
			});
			if (this.checkmove(this.x - this.r + spostamento, this.y - this.r)) {
				this.x += spostamento;
				if (this.x + this.r >= this.map.mapSize.w) {
					this.x = this.camera.x + this.camera.w - this.r;
				}
				
			}
		}

		this.storePosForTrail(this.x, this.y);
	}

	shoot(dt: number) {
		if (this.alive && this.currentWeapon.shotNumber>0) {
			let now = Date.now();
			if (now - this.attackCounter < this.currentWeapon.frequency) return;
			this.attackCounter = now;
			let vX = (this.control.mouseX - (this.x - this.camera.x));
			let vY = (this.control.mouseY - (this.y - this.camera.y));
			let dist = Math.sqrt(vX * vX + vY * vY);	// si calcola la distanza
			vX = vX / dist;								// si normalizza
			vY = vY / dist;
			for (let i = this.currentWeapon.count-1; i >= 0; i--) {
				this.bullet.create(this.x, this.y, vX, vY, 'player', this.index, this.damage, this.currentWeapon);  // 8 è la velocità del proiettile
				this.currentWeapon.shotNumber--;
			}
		}else{
			// da valutare se prevederlo in automatico
			this.weaponsInventory.getBest();
            this.currentWeapon = this.weaponsInventory.selectedWeapon;	// arma corrente
		}
	}

	update(dt: number, timestamp:number) {

		if (this.alive) {
			// this.attackCounter += dt;	// contatore frdequenza di sparo
			

			this.isLavaOrToxic(this.x, this.y);
			this.collisionDetection(dt);


			if (this.control.mouseLeft) {	// SE è PREMUTO IL btn del mouse
				this.shoot(dt);
			}
		}

		if (!this.alive) {
			this.respawnTime += dt;
			if (this.respawnTime > this.c.GAME_RESPAWN_TIME) {	// numero di cicli oltre il quale è nuovamente visibile
				this.respawn();
				this.respawnTime = 0;
			}
		}
	}
}

