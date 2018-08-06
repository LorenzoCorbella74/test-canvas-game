import { Camera } from './camera';
import { Helper } from './helper';
import { conf as c } from './config';

export class Player {

	// PLAYER
	x:              number;
	y:              number;
	r:              number
	speed:          number;
	angle:          number;	
	
	name:           string;
	hp:             number;		// punti vita
	ap:             number;		// punti armatura
	kills:          number;		// nemici uccisi
	score:          number = 0;	// numero di uccisioni
	numberOfDeaths: number;		// numero di volte in vui è stato ucciso

	currentWeapon:  string;		// arma corrente
	attackCounter: number = 0;	// frequenza di sparo
	alive: boolean;		// se il player è vivo o morto ()

	canvas:  any;
	ctx:     any;
	camera:  any;
	main:     any
	map:     any
	control: any;
	bullet:  any;


	constructor(main: any) {
		this.main   = main;
		this.canvas = main.canvas;
		this.ctx    = main.ctx;
		this.camera = main.camera;
		this.map    = main.map;
		// this.control = main.control;
		// this.loadDefault();
	}

	loadDefault(){
		this.name = "Lorenzo";
		this.respawn();
		// this.x     = 400;
		// this.y     = 300;
		// this.r     = c.PLAYER_RADIUS
		// this.speed = c.PLAYER_SPEED;	// è uguale in tutte le direzioni
		// this.angle = 0;					// angolo tra asse x e puntatore del mouse
		// this.hp    = c.PLAYER_HP;		// punti vita
		// this.ap    = c.PLAYER_AP;		// punti armatura
		this.kills = 0;					// uccisioni
		// this.alive = true;				// 
		this.numberOfDeaths = 0;	    // numero di volte in cui è stato ucciso
		// this.currentWeapon = c.PLAYER_STARTING_WEAPON;		// arma corrente
	}

	setControlHandler(control: any) {
		this.control = control;
	}

	setShotHandler(handler: any) {
		this.bullet = handler;
	}

	isFollowedBY(camera: any, map: any) {
		this.camera = camera;
		this.map = map
	}

	wheel(delta: number) {
		if (delta > 0) {
			console.log(delta);
		} else {
			console.log(delta);
		}
	};

	render(progress:number) {
		if(this.alive){	// solo se il player è vivo!
			// draw the colored region
			this.ctx.beginPath();
			this.ctx.arc(this.x - this.camera.x, this.y - this.camera.y, this.r, 0, 2 * Math.PI, true);
			this.ctx.fillStyle = c.PLAYER_COLOUR_INSIDE;
			this.ctx.fill();

			// draw the stroke
			this.ctx.lineWidth = 2;
			this.ctx.strokeStyle = c.PLAYER_COLOUR_OUTSIDE;
			this.ctx.stroke();

			// beccuccio arma
			this.ctx.strokeStyle = c.PLAYER_COLOUR_OUTSIDE;
			this.ctx.beginPath();
			this.ctx.moveTo(this.x - this.camera.x, this.y - this.camera.y);
			var pointerLength = 12.5;
			this.ctx.lineTo(
				this.x - this.camera.x + pointerLength * Math.cos(this.angle),
				this.y - this.camera.y + pointerLength * Math.sin(this.angle)
			);
			this.ctx.stroke();
		}
	}

	respawn(){
			const spawn = Helper.getSpawnPoint(this.main.data.spawn);
			this.x = spawn.x;
			this.y = spawn.y;
			this.camera.adjustCamera(this);
			this.r     = c.PLAYER_RADIUS
			this.speed = c.PLAYER_SPEED;	// è uguale in tutte le direzioni
			this.angle = 0;					// angolo tra asse x e puntatore del mouse
			this.hp    = c.PLAYER_HP;		// punti vita
			this.ap    = c.PLAYER_AP;		// punti armatura
			this.alive = true;				// il player è nuovamente presente in gioco
			// this.kills = 0;				// si mantengono...
			// this.numberOfDeaths = 0;	    // si mantengono...
			this.currentWeapon = c.PLAYER_STARTING_WEAPON;		// arma corrente
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

	update(progress:number) {

		this.attackCounter += 1;

		if(this.alive){
			if (this.control.w) { // W 
				if (this.checkmove(this.x - this.r, this.y - this.r - this.speed)) {
					this.y -= this.speed;
					if (this.y - this.r < this.camera.y) {
						this.y = this.camera.y + this.r;
					}
				}
			}
			if (this.control.s) {	// S
				if (this.checkmove(this.x - this.r, this.y - this.r + this.speed)) {
					this.y += this.speed;
					if (this.y + this.r >= this.camera.y + this.camera.h) {
						this.y = this.camera.y + this.camera.h - this.r;
					}
				}
			}
			if (this.control.a) {	// a
				if (this.checkmove(this.x - this.r - this.speed, this.y - this.r)) {
					this.x -= this.speed;
					if (this.x - this.r < this.camera.x) {
						this.x = this.camera.x + this.r;
					}
				}
			}
			if (this.control.d) {	// d
				if (this.checkmove(this.x - this.r + this.speed, this.y - this.r)) {
					this.x += this.speed;
					if (this.x + this.r >= this.map.mapSize.w) {
						this.x = this.camera.x + this.camera.w - this.r;
					}
				}
			}
			if (this.control.mouseLeft) {	// SE è PREMUTO IL btn del mouse
				let vX = (this.control.mouseX - (this.x - this.camera.x));
				let vY = (this.control.mouseY - (this.y - this.camera.y));
				let dist = Math.sqrt(vX * vX + vY * vY);	// si calcola la distanza
				vX /= dist;									// si normalizza
				vY /= dist;
				if (this.attackCounter > 4) {									// 4 è la frequenza di sparo
					this.bullet.create(this.x, this.y, vX * 8, vY * 8, 'player');  // 8 è la velocità del proiettile
					this.attackCounter = 0;
				}
			}
		}
	}
}

