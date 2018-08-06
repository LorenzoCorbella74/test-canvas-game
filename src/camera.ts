import { conf as c } from './config';

export class Camera {

    x:             number;
    y:             number;
    w:             number;
    h:             number;
    currentPlayer: any;
    map:           any;
    main:          any;

    constructor(x: number, y: number, w: number, h: number, main:any) {
        this.x    = x || 0;
        this.y    = y || 0;
        this.w    = w || 800;
        this.h    = h || 600;
        this.main = main;
    }

    setCurrentPlayer(player:any){
        this.currentPlayer = player;
    }

    setCurrentMap(map:any){
        this.map = map;
    }

    update(progress:number) {
        // si evita di aggiornare la camera quando si arriva al bordo della mappa
        if (this.currentPlayer.x > (this.w / 2) && this.currentPlayer.x < this.map.mapSize.w - (this.w / 2)) {
            this.x = this.currentPlayer.x - (this.w / 2);
        }
        if (this.currentPlayer.y > (this.h / 2) && this.currentPlayer.y < this.map.mapSize.h - (this.h / 2)) {
            this.y = this.currentPlayer.y - (this.h / 2);
        }
    }

    // adjust camera after respawn
    adjustCamera(actor:any){
		if(actor.x > (this.map.mapSize.w - c.CANVAS_WIDTH)){
			this.x = this.map.mapSize.w - c.CANVAS_WIDTH;
		}
		if(actor.x < c.CANVAS_WIDTH){
			this.x = 0;
		}
		if(actor.y < c.CANVAS_HEIGHT){
			this.y = 0;
		}
		if(actor.y > (this.map.mapSize.h - c.CANVAS_HEIGHT)){
			this.y = this.map.mapSize.h - c.CANVAS_HEIGHT;
		}
	}

};