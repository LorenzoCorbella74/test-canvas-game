import { conf as c } from './config';

export class Camera {

    x:      number;
    y:      number;
    w:      number;
    h:      number;
    player: any;
    map:    any;

    constructor(x: number, y: number, w: number, h: number, main:any) {
        this.x = x || 0;
        this.y = y || 0;
        this.w = w || 800;
        this.h = h || 600;
        this.player = main.player;
    }

    setCurrentMap(map:any){
        this.map = map;
    }

    update() {
        // si evita di aggiornare la camera quando si arriva al bordo della mappa
        if (this.player.x > (this.w / 2) && this.player.x < this.map.mapSize.w - (this.w / 2)) {
            this.x = this.player.x - (this.w / 2);
        }
        if (this.player.y > (this.h / 2) && this.player.y < this.map.mapSize.h - (this.h / 2)) {
            this.y = this.player.y - (this.h / 2);
        }
    }

};