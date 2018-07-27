import { conf as c } from './config';

export class Player {

	// PLAYER
	x:     number;
	y:     number;
	r:     number
	speed: number;
	angle: number;

	hp:    number;
	ap:    number;
	kills: number
	currentWeapon: string;

	canvas:  any;
	ctx:     any;
	camera:  any;
	map:     any
	control: any


	constructor(main: any) {
		this.x = 400;
		this.y = 300;
		this.r = c.PLAYER_RADIUS
		this.speed = c.PLAYER_SPEED;	// è uguale in tutte le direzioni
		this.angle = 0;					// angolo tra asse x e puntatore del mouse

		this.hp = 100;					// punti vita
		this.ap = 10;					// punti armatura
		this.kills = 0;					// uccisioni
		this.currentWeapon= 'None';		// arma corrente

		this.canvas  = main.canvas;
		this.ctx     = main.ctx;
		this.camera  = main.camera;
		this.map 	 = main.map;
	}

	setControlHandler(control:any){
		this.control = control;
	}

	isFollowedBY(camera: any, map: any) {
		this.camera = camera;
		this.map = map
	}

	wheel(delta:number) {
		if (delta > 0) {
			console.log(delta);
		} else {
			console.log(delta);
		}
	};


	render() {
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
		var pointerLength = 25;
		this.ctx.lineTo(
			this.x - this.camera.x + pointerLength * Math.cos(this.angle),
			this.y - this.camera.y + pointerLength * Math.sin(this.angle)
		);
		this.ctx.stroke();
	}

	// collisione tra elementi della stessa imensione (tile e player)
	// SOURCE: https://codereview.stackexchange.com/questions/60439/2d-tilemap-collision-method
	checkmove(x:number, y:number):boolean {
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
		return false;
	}
}

