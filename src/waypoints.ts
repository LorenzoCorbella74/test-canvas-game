import { Helper } from './helper';

export class Waypoints {

    list: any[] = [];
    pool: any[] = [];

    player:     any;
    bots:       any;
    ctx:        any;
    main:       any;
    c:          any;

    constructor() { 
    }

    init(main: any){
        this.list = [];
        this.main       = main;
        this.c          = main.c;
        this.player     = main.player;
        this.bots       = main.enemy;
        this.ctx        = main.ctx;
    }

    // ogni waypoint ha un riferimento di ogni bot per essere attraverasabile
    linkToActors() {
        this.list.forEach(e => {
            this.bots.list.forEach((bot: any) => {
                e[bot.index] = { visible: true, reloadRate: 0 };
            });
        });
    }

    create(x: number, y: number, index:number) {
        let waypoint        = this.pool.length > 0 ? this.pool.pop(): new Object();
        waypoint.type       = 'waypoint';
        waypoint.index      = index;
        waypoint.x          = x;
        waypoint.y          = y;
        waypoint.reloadRate = 0;
        waypoint.spawnTime  = 8000;   // tempo impiegato per essere nuovamente attraverabili da ogni bot
        waypoint.r          = 2;  
        waypoint.color      = 'orange';
        this.list.push(waypoint);
    };


    update(progress:number) {
        for (var i = this.list.length - 1; i >= 0; i--) {
            var waypoint = this.list[i];
            for (let a = 0; a < this.bots.list.length; a++) {
                const actor = this.bots.list[a];
                if (!waypoint[actor.index].visible) {
                    waypoint[actor.index].reloadRate+= progress;  // si inizia a contare se non visibile
                }
            }

            // si guarda se i waypoint entrano in contatto con qualche nemico
            for (let i = this.bots.list.length - 1; i >= 0; i--) {
                const bot = this.bots.list[i];
                if (waypoint[bot.index].visible && Helper.circleCollision(waypoint, bot)) {
                    waypoint[bot.index].visible = false;
                }
            }
            // RESPAWN
            for (let a = 0; a < this.bots.list.length; a++) {
                const actor = this.bots.list[a];
                if (waypoint[actor.index].reloadRate > waypoint.spawnTime) {	// numero di cicli oltre il quale è nuovamente visibile
                    waypoint[actor.index].visible = true;
                    waypoint[actor.index].reloadRate = 0;
                } 
            }
        }
    }
}
