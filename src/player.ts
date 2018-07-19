import { conf as c } from './config';

export class Player {

	// PLAYER
	x:          number;
	y:          number;
	r:          number
	speed:      number;

	// CANVAS
	canvas:     any;
	ctx:        any;

	// COMANDI
	keys:       any = {};
	mouseDown = false;
	mouseX    = 0;
	mouseY    = 0;

	constructor(canvas: any, ctx: any) {
		this.x = 395;
		this.y = 295;
		this.r = c.PLAYER_RADIUS
		this.canvas = canvas;
		this.ctx = ctx;
		this.speed = c.PLAYER_SPEED;

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
		this.canvas.addEventListener('mouseup',(e: any) => {
			this.mouseDown = false
		});
		this.canvas.addEventListener('mousemove', (e:any) => {
			var rect = this.canvas.getBoundingClientRect();
			this.mouseX = e.clientX - rect.left;
			this.mouseY = e.clientY - rect.top
		});
		this.canvas.addEventListener('contextmenu', (e:any) => {
			e.preventDefault()
		});
	}

	render() {
		// draw the colored region
		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, true);
		this.ctx.fillStyle = c.PLAYER_COLOUR_INSIDE;
		this.ctx.fill();
		// draw the stroke
		this.ctx.lineWidth = 2;
		this.ctx.strokeStyle = c.PLAYER_COLOUR_OUTSIDE;
		this.ctx.stroke();
	}

	update() {
		if (this.keys['87']) {
			this.y -= this.speed;
		}
		if (this.keys['83']) {
			this.y += this.speed;
		}
		if (this.keys['65']) {
			this.x -= this.speed;
		}
		if (this.keys['68']) {
			this.x += this.speed;
		}
		return false;
	}
}

