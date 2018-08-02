export class PowerUp {

    radius:            number = 7;
    reloadRate:        number = 0.95;
    hp:                number = 3;
    list:              any[]  = [];
    pool:              any[]  = [];

    player:            any;
    playerShotHandler: any;
    ctx:               any;
    main:              any;

    constructor(main:any) {
        this.list.length = 0;
        this.main        = main;
        this.player      = main.player;
        this.ctx         = main.ctx;
        this.playerShotHandler = main.playerShotHandler
    }

    update() {
        var player = this.player;
        var dist;
        for (var i = this.list.length - 1; i >= 0; i--) {
            var pickup = this.list[i];
            pickup.delay--;
            if (pickup.delay <= 0) {
                dist = Math.sqrt((player.x - pickup.x) * (player.x - pickup.x) + (player.y - pickup.y) * (player.y - pickup.y)) - player.radius - pickup.radius;
                if (dist <= 0) {
                    player.hp += 5;
                    for (var j = 0; j < 9; j++) {
                        this.playerShotHandler.create(pickup.x, pickup.y, Math.random() * 2 - 1, Math.random() * 2 - 1)
                    }
                    this.pool.push(pickup);
                    this.list.splice(i, 1)  // si rimuove
                } else if (dist <= 40) {
                    pickup.x += (player.x - pickup.x) * (160 - dist * 4) * 0.001;   // logica che permette al powerup di essere risucchiato dall'agent
                    pickup.y += (player.y - pickup.y) * (160 - dist * 4) * 0.001
                }
                pickup.delay = (dist - 40) / player.speed //
            }
        }
    };

    render(){
        for (var i = this.list.length - 1; i >= 0; i--) {
            var pickup = this.list[i];
            let x = pickup.x - this.main.camera.x;
            let y = pickup.y - this.main.camera.y;
            this.ctx.beginPath();
                    this.ctx.arc(x, y, pickup.radius, 0, 6.2832);
                    this.ctx.fill();
                    this.ctx.closePath()
        }
    }

    create(x:number, y:number) {
        var pickup = this.pool.length > 0 ? this.pool.pop() : new Object();
        pickup.x = x;
        pickup.y = y;
        pickup.delay = 0;
        pickup.radius = this.radius;
        this.list.push(pickup)
    };
}

