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

    
    static calculateDistance(obj1: any, obj2: any) {
        let tx = obj1.x - obj2.x,
        ty = obj1.y - obj2.y,
        dist = Math.sqrt(tx * tx + ty * ty);
        return dist;
    }
    
    static randomElementInArray(items: any) {
        return items[Math.floor(Math.random() * items.length)];
    }

    // Returns a random integer between min (include) and max (include)
    static randBetween(min:number, max:number){
        return  Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static rand(min, max) {
        return Math.floor(Helper.randf(min, max));
      }
      
    static randf(min, max) {
    if (max == null) {
        max = min || 1;
        min = 0;
    }
    return Math.random() * (max - min) + min;
    }
      
      static randOneIn(max = 2) {
        return Helper.rand(0, max) === 0;
      }

    static circleCollision(circle1: any, circle2: any) {
        let x = circle1.x - circle2.x;
        let y = circle1.y - circle2.y
        let distance = Math.sqrt(x * x + y * y);
        return (distance < circle1.r + circle2.r) ? true : false;
    }


    // https://yal.cc/rectangle-circle-intersection-test/
    // https://gist.github.com/vonWolfehaus/5023015
    static circleRectangleCollision(circle:any, rectangle:any){
        // limits value to the range min..max
        function clamp(val:number, min:number, max:number) {
            return Math.max(min, Math.min(max, val))
        }

        // Find the closest point to the circle within the rectangle
        // Assumes axis alignment! ie rect must not be rotated
        var closestX = clamp(circle.x, rectangle.x, rectangle.x + rectangle.width);
        var closestY = clamp(circle.y, rectangle.y, rectangle.y + rectangle.height);

        // Calculate the distance between the circle's center and this closest point
        var distanceX = circle.x - closestX;
        var distanceY = circle.y - closestY;

        // If the distance is less than the circle's radius, an intersection occurs
        var distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
        return distanceSquared < (circle.r * circle.r);
    }

    // https://www.emanueleferonato.com/2007/04/28/create-a-flash-artillery-game-step-1/
    // https://www.safaribooksonline.com/library/view/html5-canvas/9781449308032/ch05s03.html

    static getBotsPreferences(): string {
        let preferences = [/* 'Rifle',  */'Shotgun', 'Plasma', 'Rocket', 'Railgun'];
        let weights = [0.22, 0.24, 0.27, 0.26];
        function generateWeighedList(list:string[], weights:number[]) {
            let weighed_list = [];
            // Loop over weights
            for (let i = 0; i < weights.length; i++) {
                let multiples = weights[i] * 100;
                // Loop over the list of items
                for (let j = 0; j < multiples; j++) {
                    weighed_list.push(list[i]);
                }
            }
            return weighed_list;
        };
        let weighed_list = generateWeighedList(preferences, weights);
        let random_num = Helper.rand(0, weighed_list.length-1);
        return weighed_list[random_num];
    }

    // NEW Line drawing on a grid

    static dot(x1:number, y1:number, x2:number, y2:number) {
        return x1 * x2 + y1 * y2;
    }

    static lerp(start, end, t) {
        return start + t * (end-start);
    }

    static lerp_point(p0, p1, t) {
        return { x: Helper.lerp(p0.x, p1.x, t), y: Helper.lerp(p0.y, p1.y, t) };
    }

    static diagonal_distance(p0, p1) {
        var dx = p1.x - p0.x, dy = p1.y - p0.y;
        return Math.max(Math.abs(dx), Math.abs(dy));
    }
    
    static round_point(p) {
        return {x: Math.round(p.x), y: Math.round(p.y)};
    }
    
    static line(p0, p1) {
        var points = [];
        var N = Helper.diagonal_distance(p0, p1);
        for (var step = 0; step <= N; step++) {
            var t = N == 0? 0.0 : step / N;
            points.push(Helper.round_point(Helper.lerp_point(p0, p1, t)));
        }
        return points;
    }

}   