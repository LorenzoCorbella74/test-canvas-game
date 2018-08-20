export class Helper {

    static spawnUsed: number = 0;
    static botsNameIndex: number = 0;

    static getSpawnPoint(arr: any[]) {
        let _spawn = this.spawnUsed;
        if (_spawn == arr.length) {
            _spawn= 0;
            this.spawnUsed = 0;
        } else {
            this.spawnUsed++;
        }
        console.log(`Used spawn point n° ${this.spawnUsed}`);
        return arr[_spawn]
    }

    static getBotsName(arr: any[]) {
        let _spawn = this.botsNameIndex;
        if (_spawn == arr.length) {
            _spawn= 0;
            this.botsNameIndex = 0;
        } else {
            this.botsNameIndex++;
        }
        return arr[_spawn]
    }

    static calculateAngle(cx: number, cy: number, ex: number, ey: number) {
        let dy = ey - cy;
        let dx = ex - cx;
        let theta = Math.atan2(dy, dx); // range (-PI, PI]
        // theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
        // if (theta < 0) theta = 360 + theta; // range [0, 360)
        //if (theta < 0) theta = Math.PI + theta; // range [0, 360)
        return theta;
    }

    // Returns a random integer between min (include) and max (include)
    static randBetween(min:number, max:number){
        return  Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static calculateDistance(obj1: any, obj2: any) {
        let tx = obj1.x - obj2.x,
            ty = obj1.y - obj2.y,
            dist = Math.sqrt(tx * tx + ty * ty);
        return dist;
    }

    static randomElementInArray(items: any) {
        return items[Math.floor(Math.random() * items.length)];
    }

    static circleCollision(circle1: any, circle2: any) {
        let x = circle1.x - circle2.x;
        let y = circle1.y - circle2.y
        let distance = Math.sqrt(x * x + y * y);
        return (distance < circle1.r + circle2.r) ? true : false;
    }

    // https://www.emanueleferonato.com/2007/04/28/create-a-flash-artillery-game-step-1/
    // https://www.safaribooksonline.com/library/view/html5-canvas/9781449308032/ch05s03.html

}