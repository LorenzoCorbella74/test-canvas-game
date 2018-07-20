import { conf as c } from './config';


export class Player {

	// PLAYER
	x: number;
	y: number;
	r: number
	speed: number;
	angle:number;

	// CANVAS
	canvas: any;
	ctx: any;

	// COMANDI
	keys: any = {};
	mouseDown = false;
	mouseX = 0;
	mouseY = 0;

	camera: any;
	map: any

	constructor(main: any) {
		this.x = 400;
		this.y = 300;
		this.r = c.PLAYER_RADIUS
		this.speed = c.PLAYER_SPEED;
		this.angle = 0;

		this.canvas = main.canvas;
		this.ctx = main.ctx;

		// listners per i comandi
		this.canvas.addEventListener("keydown", (e: any) => {
			this.keys[`${e.keyCode}`] = true;
		});
		this.canvas.addEventListener("keyup", (e: any) => {
			this.keys[`${e.keyCode}`] = false;
		});

		this.canvas.addEventListener('mousedown', (e: any) => {
			this.mouseDown = true
		});
		this.canvas.addEventListener('mouseup', (e: any) => {
			this.mouseDown = false
		});
		this.canvas.addEventListener('mousemove', (e: any) => {
			var rect = this.canvas.getBoundingClientRect();
			this.mouseX = e.clientX - rect.left;
			this.mouseY = e.clientY - rect.top
			this.angle = this.calculateAngle(this.x,this.y, this.mouseX, this.mouseY);
		});
		this.canvas.addEventListener('contextmenu', (e: any) => {
			e.preventDefault()
		});
	}

	private calculateAngle(cx:number, cy:number, ex:number, ey:number) {
		var dy = ey - cy;
		var dx = ex - cx;
		var theta = Math.atan2(dy, dx); // range (-PI, PI]
		// theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
		// if (theta < 0) theta = 360 + theta; // range [0, 360)
		return theta;
	  }

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
		this.ctx.strokeStyle=c.PLAYER_COLOUR_OUTSIDE;
		this.ctx.beginPath();
		this.ctx.moveTo(this.x,this.y);
		var pointerLength = 25;
		this.ctx.lineTo(
			this.x - this.camera.x + pointerLength * Math.cos(this.angle),
			this.y - this.camera.y + pointerLength * Math.sin(this.angle)
			);
		this.ctx.stroke();
	}

	isFollowedBY(camera: any, map: any) {
		this.camera = camera;
		this.map = map
	}

	update() {
		if (this.keys['87'] || this.keys['38']) { // W o top arrow
			this.y -= this.speed;
			if (this.y - this.r < this.camera.y) {
				this.y = this.camera.y + this.r;
			}
		}
		if (this.keys['83'] || this.keys['40']) {	// S
			this.y += this.speed;
			if (this.y + this.r >= this.camera.y + this.camera.h) {
				this.y = this.camera.y + this.camera.h - this.r;
			}
		}
		if (this.keys['65'] || this.keys['37']) {	// a
			this.x -= this.speed;
			if (this.x - this.r < this.camera.x) {
				this.x = this.camera.x + this.r;
			}
		}
		if (this.keys['68'] || this.keys['39']) {	// d
			this.x += this.speed;
			if (this.x + this.r >= this.map.mapSize.w) {
				this.x = this.camera.x + this.camera.w - this.r;
			}
		}
		return false;
	}
}

