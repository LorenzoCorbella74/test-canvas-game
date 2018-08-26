import { demoMap } from './maps/dm0';
import { demoMap2 } from './maps/dm1';



export const types = [
    { id: 0, colour: '#ddd5d5', solid: 0 },                                   // tile navigabile
    { id: 1, colour: '#868679', solid: 1 }
    
    /*// tile solida
    // ENVIRONMENT
    { id: 2, colour: '#ddd5d5', solid: 0, desc: 'SPAWN' },                            // spawn points
    { id: 3, colour: '#ddd5d5', solid: 0, desc: 'lava', damage: 1 },                  // lava
    { id: 4, colour: '#ddd5d5', solid: 0, desc: 'toxic water', damage: 1 },           // toxic water
    { id: 5, colour: '#ddd5d5', solid: 0, desc: 'water', friction: 1 },               //  water
    { id: 6, colour: '#ddd5d5', solid: 0, desc: 'portals', destination: {r:1,c:2} },  // portals
    { id: 7, colour: '#ddd5d5', solid: 0, desc: 'bounce pad', force: {x:1,y:2} },     // piattaforme di jump
    // POWERUPS
    { id: 10, colour: '#ddd5d5', solid: 0, desc: 'health' },     
    { id: 11, colour: '#ddd5d5', solid: 0, desc: 'megaHealth' },     
    { id: 12, colour: '#ddd5d5', solid: 0, desc: 'armour' },     
    { id: 13, colour: '#ddd5d5', solid: 0, desc: 'megaArmour' },     // a tempo
    { id: 14, colour: '#ddd5d5', solid: 0, desc: 'quad damage' },    // a tempo  
    { id: 15, colour: '#ddd5d5', solid: 0, desc: 'speed' },          // a tempo
    { id: 15, colour: '#ddd5d5', solid: 0, desc: 'regeneration' },   // a tempo   
    // WEAPONS AMMO
    { id: 23, colour: '#ddd5d5', solid: 0, desc: 'ammo for Machine Gun/Rifle' },
    { id: 24, colour: '#ddd5d5', solid: 0, desc: 'ammo for Shotgun' },     
    { id: 25, colour: '#ddd5d5', solid: 0, desc: 'ammo for Plasma Gun' },     
    { id: 26, colour: '#ddd5d5', solid: 0, desc: 'ammo for ' },     
    { id: 27, colour: '#ddd5d5', solid: 0, desc: 'ammo for Rocket Launcher' },     
    { id: 28, colour: '#ddd5d5', solid: 0, desc: 'ammo for Lightning Gun' },     
    { id: 29, colour: '#ddd5d5', solid: 0, desc: 'ammo for Railgun' },     
    // WEAPONS
    { id: 33, colour: '#ddd5d5', solid: 0, desc: 'Machine Gun' },
    { id: 34, colour: '#ddd5d5', solid: 0, desc: 'Shotgun' },     
    { id: 35, colour: '#ddd5d5', solid: 0, desc: 'Plasma Gun' },     
    { id: 36, colour: '#ddd5d5', solid: 0, desc: 'Grenade Launcher' },     
    { id: 37, colour: '#ddd5d5', solid: 0, desc: 'Rocket Launcher' },     
    { id: 38, colour: '#ddd5d5', solid: 0, desc: 'Lightning Gun' },     
    { id: 39, colour: '#ddd5d5', solid: 0, desc: 'Railgun' }
    
    */
];

export class Map {

    tileSize:          number;
    mapSize:           any;
    camera:            any;
    powerup:           any;
    main:              any;
    c:                 any;
    ctx:               any;
    map:               any;

    constructor() { }

    init(main: any){
        this.camera   = main.camera;
        this.main     = main;
        this.c        = main.c;
        this.tileSize = this.c.TILE_SIZE;
        this.powerup  = main.powerup;
        this.ctx      = main.ctx;
        this.map      = demoMap2;
        // dimensioni in pixels
        this.mapSize = {
            h:         (this.map.length * this.tileSize),
            w:         (this.map[0].length * this.tileSize),
        }
        console.log(`Mappa: ${this.mapSize.w} x ${this.mapSize.h} pixel, Righe: ${this.map.length} - Colonne:${this.map[0].length} `);
    }

    drawBorder(xPos: number, yPos: number, width: number, height: number, thickness = 1) {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(xPos - (thickness), yPos - (thickness), width + (thickness * 2), height + (thickness * 2));
    }

    render(dt: number) {
        var onXTile = Math.floor((this.camera.x + (this.camera.w / 2)) / this.tileSize);
        var onYTile = Math.floor((this.camera.y + (this.camera.h / 2)) / this.tileSize);
        this.ctx.beginPath();

        for (let j = onYTile - 13; j < onYTile + 13; j++) { // sono 24 righe
            for (let l = onXTile - 17; l < onXTile + 17; l++) { // sono 32 colonne
                if (j >= 0 && l >= 0 && j < this.map.length && l < this.map[j].length) {

                    // if (this.map[j][l] !== 1 || this.map[j][l] !== 3 || this.map[j][l] !== 4) {
                    //     this.drawBorder(l * this.tileSize - this.camera.x, j * this.tileSize - this.camera.y, this.tileSize, this.tileSize);
                    // }

                    // si renderizza relativamente alla camera !!!
                    this.ctx.fillStyle = this.getColor(this.map[j][l]);
                    this.ctx.fillRect(l * this.tileSize - this.camera.x, j * this.tileSize - this.camera.y, this.tileSize, this.tileSize);

                    if (this.main.debug) {
                        this.ctx.font = 'bold 8px/1 Arial';
                        this.ctx.fillStyle = '#494242';
                        this.ctx.fillText(j.toString(), l * this.tileSize - this.camera.x + 2, j * this.tileSize - this.camera.y + 10);
                        this.ctx.fillText(l.toString(), l * this.tileSize - this.camera.x + 2, j * this.tileSize - this.camera.y + 20);
                    }
                }
            }
        }
    }

    getColor(tile: any){
        let color;
        switch (tile) {
            case 0:  color = 'LightSteelBlue';break;    // empty
            case 1:  color = 'SlateGray';break;         // solid
            case 3:  color = 'red';break;               // lava
            case 4:  color = 'green';break;             // toxic water
            default: color = 'LightSteelBlue';break; 
        }
        return color;
    }

    pixelToMapPos(pos) {
        return {
          x: Math.floor(pos.x / this.tileSize),
          y: Math.floor(pos.y / this.tileSize)
        };
      }
    
      mapToPixelPos(mapPos) {
        return {
          x: mapPos.x * this.tileSize,
          y: mapPos.y * this.tileSize
        };
      }
    


    loadSpawnPointsAndPowerUps() {
        let output = {};
        output.spawn =[]; 
        output.powerup =[];
        output.waypoints =[];
        for (let j = 0; j < this.map.length; j++) {
            for (let l = 0; l < this.map[j].length; l++) {
                if (j >= 0 && l >= 0 && j < this.map.length && l < this.map[j].length) {
                    if (this.map[j][l] == 2) {
                        output.spawn.push({
                            x: l * this.tileSize - this.camera.x + 12.5,
                            y: j * this.tileSize - this.camera.y + 12.5
                        });
                    }

                    // POWERUPS
                    if (this.map[j][l] == 10) {
                        output.powerup.push({
                            x: l * this.tileSize - this.camera.x + 12.5,
                            y: j * this.tileSize - this.camera.y + 12.5,
                            type: 'health'
                        });
                    }
                    if (this.map[j][l] == 11) {
                        output.powerup.push({
                            x: l * this.tileSize - this.camera.x + 12.5,
                            y: j * this.tileSize - this.camera.y + 12.5,
                            type: 'megaHealth'
                        });
                    }
                    if (this.map[j][l] == 12) {
                        output.powerup.push({
                            x: l * this.tileSize - this.camera.x + 12.5,
                            y: j * this.tileSize - this.camera.y + 12.5,
                            type: 'armour'
                        });
                    }
                    if (this.map[j][l] == 13) {
                        output.powerup.push({
                            x: l * this.tileSize - this.camera.x + 12.5,
                            y: j * this.tileSize - this.camera.y + 12.5,
                            type: 'megaArmour'
                        });
                    }
                    if (this.map[j][l] == 14) {
                        output.powerup.push({
                            x: l * this.tileSize - this.camera.x + 12.5,
                            y: j * this.tileSize - this.camera.y + 12.5,
                            type: 'quad'
                        });
                    }
                    if (this.map[j][l] == 15) {
                        output.powerup.push({
                            x: l * this.tileSize - this.camera.x + 12.5,
                            y: j * this.tileSize - this.camera.y + 12.5,
                            type: 'speed'
                        });
                    }

                    /* --------------------- WEAPONS --------------------- */
                    if (this.map[j][l] == 34) {
                        output.powerup.push({
                            x: l * this.tileSize - this.camera.x + 12.5,
                            y: j * this.tileSize - this.camera.y + 12.5,
                            type: 'weaponShotgun',
                            for:'Shotgun',
                            amount:25
                        });
                    }
                    if (this.map[j][l] == 35) {
                        output.powerup.push({
                            x: l * this.tileSize - this.camera.x + 12.5,
                            y: j * this.tileSize - this.camera.y + 12.5,
                            type: 'weaponPlasma',
                            for:'Plasma',
                            amount:25
                        });
                    }
                    if (this.map[j][l] == 37) {
                        output.powerup.push({
                            x: l * this.tileSize - this.camera.x + 12.5,
                            y: j * this.tileSize - this.camera.y + 12.5,
                            type: 'weaponRocket',
                            for:'Rocket',
                            amount:10
                        });
                    }
                    if (this.map[j][l] == 39) {
                        output.powerup.push({
                            x: l * this.tileSize - this.camera.x + 12.5,
                            y: j * this.tileSize - this.camera.y + 12.5,
                            type: 'weaponRailgun',
                            for:'Railgun',
                            amount:5
                        });
                    }


                    /* --------------------- AMMO --------------------- */
                    if (this.map[j][l] == 23) {
                        output.powerup.push({
                            x: l * this.tileSize - this.camera.x + 12.5,
                            y: j * this.tileSize - this.camera.y + 12.5,
                            type: 'ammoRifle',
                            for:'Rifle'
                        });
                    }
                    if (this.map[j][l] == 24) {
                        output.powerup.push({
                            x: l * this.tileSize - this.camera.x + 12.5,
                            y: j * this.tileSize - this.camera.y + 12.5,
                            type: 'ammoShotgun',
                            for:'Shotgun',
                            amount:25
                        });
                    }
                    if (this.map[j][l] == 25) {
                        output.powerup.push({
                            x: l * this.tileSize - this.camera.x + 12.5,
                            y: j * this.tileSize - this.camera.y + 12.5,
                            type: 'ammoPlasma',
                            for:'Plasma',
                            amount:25
                        });
                    }
                    if (this.map[j][l] == 27) {
                        output.powerup.push({
                            x: l * this.tileSize - this.camera.x + 12.5,
                            y: j * this.tileSize - this.camera.y + 12.5,
                            type: 'ammoRocket',
                            for:'Rocket',
                            amount:10
                        });
                    }
                    if (this.map[j][l] == 29) {
                        output.powerup.push({
                            x: l * this.tileSize - this.camera.x + 12.5,
                            y: j * this.tileSize - this.camera.y + 12.5,
                            type: 'ammoRailgun',
                            for:'Railgun',
                            amount:5
                        });
                    }

                    // WAYPOINTS
                    if (this.map[j][l] == 40) {
                        output.waypoints.push({
                            x: l * this.tileSize - this.camera.x + 12.5,
                            y: j * this.tileSize - this.camera.y + 12.5,
                            type: 'waypoint'
                        });
                    }
                }
            }
        }
        // console.log(output);
        return output
    }

}