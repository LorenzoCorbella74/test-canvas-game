export class PlayerShotHandler {
    
    radius:number = 3;
    list:any[] = [];
    pool:any[] = []

    main:any;
    player:any;
 

    constructor (main:any) {
        this.list.length      = 0;
        this.player           = main.player;
        this.main = main;
        // this.debrisHandler = main.debrisHandler; detriti
    }
    
    update() {
        let shot, i;
        for (i = this.list.length - 1; i >= 0; i--) {
            shot = this.list[i];
            shot.x += shot.vX;
            shot.y += shot.vY;
            shot.radius -= 0.045;
            if (shot.radius <= 1) {
                this.pool.push(shot);
                this.list.splice(i, 1);
                continue
            }
        }
    }

    render(){
        for (let j = this.list.length - 1; j >= 0; j--) {
            const obj = this.list[j];
            let x = obj.x - this.main.camera.x;
            let y = obj.y - this.main.camera.y;
            //if (x > -obj.radius && x < this.main.canvas.width + obj.radius && y > -obj.radius && y < this.main.canvas.height + obj.radius) {
            //    if (i > 5) {
            //        this.main.ctx.fillRect(x - obj.radius, y - obj.radius, obj.radius * 2, obj.radius * 2);
            //        if (Math.random() < 0.2 && typeof this.drawList[i].paint !== 'undefined') {
            //            this.bgContext.fillRect(obj.x, obj.y, 2, 2)
            //        }
            //    } else {
                    this.main.ctx.fillStyle = 'rgba(0,0,0,0.8)';
                    this.main.ctx.beginPath();
                    this.main.ctx.arc(x, y, obj.radius, 0, 6.2832);
                    this.main.ctx.fill();
                    this.main.ctx.closePath()
           //     }
           // }
        }
    }
    
    create(x, y, vX, vY) {
        let shot = this.pool.length > 0 ? this.pool.pop() : {};
        shot.x = x;
        shot.y = y;
        shot.vX = vX;
        shot.vY = vY;
        shot.radius = this.radius;
        this.list.push(shot)
    }
    
    // se colpisce qualcosa si rimuove
    hit (i) {
        this.pool.push(this.list[i]);
        this.list.splice(i, 1)
    };
}

