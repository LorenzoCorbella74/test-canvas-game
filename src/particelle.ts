import { conf as c } from './config';
import {Helper} from'./helper';

export class Particelle {
    list:any[];
    pool:any[];
    main:any;

    constructor (main:any) {
        this.list = [];
        this.pool = [];
        this.main = main;
    }

    update () {
        if (this.list.length > 0) {
            var obj;
            for (var i = this.list.length - 1; i >= 0; i--) {
                obj = this.list[i];
                obj.x += -obj.vX;
                obj.y += -obj.vY;
                obj.vX *= 0.96;
                obj.vY *= 0.96;
                obj.r -= 0.1;
                if (obj.r <= 0) {
                    this.pool.push(obj);
                    this.list.splice(i, 1);
                    continue
                }
            }
        }
    };

    /**
     * Invocata con:
     * this.debrisHandler.create(shot.x, shot.y, Math.random() * 2 - 1, Math.random() * 2 - 1, 3)
     * @param {*} x coordinata x del detrito
     * @param {*} y coordinata y del detrito
     * @param {*} vX    veocità x
     * @param {*} vY    velocità y
     * @param {*} r raggio del detrito (default =3)
     * @memberof Particelle
     */
    create (x:number, y:number, vX:number, vY:number, r: any=3, color?:string) {
        var obj = this.pool.length > 0 ? this.pool.pop() : new Object();
        obj.x  = x;
        obj.y  = y;
        obj.vX = vX;
        obj.vY = vY;
        obj.r  = r;
        obj.color = color;
        this.list.push(obj)
    };

    render(){
        for (var i = this.list.length - 1; i >= 0; i--) {
            var detrito = this.list[i];
            let x = detrito.x - this.main.camera.x;
            let y = detrito.y - this.main.camera.y;
            this.main.ctx.beginPath();
                    this.main.ctx.arc(x, y, detrito.r, 0, 6.2832);
                    this.main.ctx.fillStyle =  detrito.color || Helper.randomElementInArray(c.DEBRIS_COLOR);
                    this.main.ctx.fill();
                    this.main.ctx.closePath()
        }
    }

}

