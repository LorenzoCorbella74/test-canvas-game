import {Helper} from'./helper';

export class Blood {
    list: any[];
    pool: any[];
    main: any;
    c:    any;

    constructor () {
    }

    init(main:any){
        this.list = [];
        this.pool = [];
        this.main = main;
        this.c    = main.c; 
    }

    update (progress: number) {
        if (this.list.length > 0) {
            var obj;
            for (var i = this.list.length - 1; i >= 0; i--) {
                obj = this.list[i];
                obj.x += -obj.vX;
                obj.y += -obj.vY;
                obj.vX *= 0.96;
                obj.vY *= 0.96;
                obj.radius -= 0.1;
                if (obj.radius <= 0) {
                    this.pool.push(obj);
                    this.list.splice(i, 1);
                    continue
                }
            }
        }
    };

    /**
     * Invocata con:
     *  this.blood(shot.x, shot.y, shot.vX * 0.4, shot.vY * 0.4, 4) // crea il sangue
     * @param {*} x coordinata x della particella di sangue
     * @param {*} y coordinata y della particella di sangue
     * @param {*} vX    veocità x
     * @param {*} vY    velocità y
     * @param {*} radius raggio della particella di sangue (default =3)
     */
    create (x:number, y:number, vX:number, vY:number, radius: any=3) {
        var obj = this.pool.length > 0 ? this.pool.pop() : new Object();
        obj.x  = x;
        obj.y  = y;
        obj.vX = vX;
        obj.vY = vY;
        obj.radius = radius;
        this.list.push(obj)
    };

    render(progress:number){
        for (var i = this.list.length - 1; i >= 0; i--) {
            var sangue = this.list[i];
            let x = sangue.x - this.main.camera.x;
            let y = sangue.y - this.main.camera.y;
            this.main.ctx.beginPath();
                    this.main.ctx.arc(x, y, sangue.radius, 0, 6.2832);
                    this.main.ctx.fillStyle = Helper.randomElementInArray(this.c.BLOOD_COLOUR) ;
                    this.main.ctx.fill();
                    this.main.ctx.closePath()
        }
    }

}

