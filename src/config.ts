export class Config {

    // CANVAS
    CANVAS_WIDTH:           number = 800;
    CANVAS_HEIGHT:          number = 600;

    // MAP
    TILE_SIZE:              number = 25;

    // GAME
    GAME_KILLS_TO_WIN:      number = 15;
    GAME_MATCH_DURATION:    number = 300000; // in ms 
    GAME_BOTS_PER_MATCH:    number = 5;
    GAME_RESPAWN_TIME:      number = 5000;   // in ms

    //
    MOTION_TRAILS_LENGTH:   number = 10;
    
    // PLAYER
    PLAYER_SPEED:           number = 3.5/16;
    PLAYER_RADIUS:          number = 12.5;
    PLAYER_HP:              number = 100;
    PLAYER_AP:              number = 100;
    PLAYER_STARTING_WEAPON: string = 'rifle';
    PLAYER_COLOUR_INSIDE:   string = '#6688cc';
    PLAYER_COLOUR_OUTSIDE: string = '#4b58a0';

    // ENEMIES
    ENEMY_SPEED:           number = 3.5/16;
    ENEMY_RADIUS:          number = 12.5;
    ENEMY_HP:              number = 100;
    ENEMY_AP:              number = 100;
    ENEMY_STARTING_WEAPON: string = 'rifle';
    ENEMY_COLOUR_INSIDE:   string = '#f90c00';
    ENEMY_COLOUR_OUTSIDE:  string = '#bb0b00';
    ENEMY_NAMES:string[] = ['Ranger','Phobos','Mynx','Orbb','Sarge','Grunt','Hunter','Klesk','Slash','Anarki','Razor','Visor','Bones','Doom','Major','Xaero'],

    // BULLETS
    BULLET_RADIUS:number = 2.5;
    BULLET_DAMAGE:number = 5;
    BULLET_TTL:number = 1000;
    
    // DETRITI
    DEBRIS_COLOR:string[] = ['#800000','#812314','#823624','#814734','#7e5544','#796556','#727267']; // from maroon to #727267
    DEBRIS_RADIUS:number = 3;

    // SANGUE
    BLOOD_COLOUR:string[] = ['#ff0000','#eb0001','#d60002','#c40002','#b10002','#9d0002','#8b0000']; // from red to darkred
    BLOOD_RADIUS:number = 4;

    FIRE_IN_LAVA:string[]=['#ffffe0','#fff1c4','#ffe2a5','#ffd587','#ffc667','#ffb541','#ffa500']; // lightyellow, orange, #FFA500

    // POWERUP
    POWERUP_RADIUS:number = 6;
    POWERUP_SPAWN_TIME:number = 30*1000;
    
    // HUD
    FONT_FAMILY :string = '"Segoe UI",Arial,sans-serif';
    HUD_BACKGROUND:string ="rgba(102, 136, 204, 0.5)";

    // WAYPOINT
    WAYPOINTS_TIMING:number= 8000;
}


/*

Poteva essere usato anche una classe con proprietà statiche:
https://medium.com/@haidermalik504/classes-in-typescript-ec5e75196201
*/

/*

    For colors: http://gka.github.io/chroma.js/#cubehelix-hue
    https://gka.github.io/palettes

*/


