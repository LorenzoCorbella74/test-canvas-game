export const conf ={

    // CANVAS
    CANVAS_WIDTH:800,
    CANVAS_HEIGHT:600,

    // GAME
    GAME_KILLS_TO_WIN:5,
    GAME_MATCH_DURATION: 90000, // in ms 
    GAME_BOTS_PER_MATCH:3,
    GAME_RESPAWN_TIME:3000,         // in ms
    
    // MAP
    TILE_SIZE: 25,
    
    // PLAYER
    PLAYER_SPEED: 3.5,
    PLAYER_RADIUS: 12.5,
    PLAYER_HP: 100,
    PLAYER_AP: 100,
    PLAYER_STARTING_WEAPON: 'rifle',
    PLAYER_COLOUR_INSIDE: '#6688cc',
    PLAYER_COLOUR_OUTSIDE: '#4b58a0',

    // ENEMIES
    ENEMY_SPEED: 3.5,
    ENEMY_RADIUS: 12.5,
    ENEMY_HP: 100,
    ENEMY_AP: 100,
    ENEMY_STARTING_WEAPON: 'rifle',
    ENEMY_COLOUR_INSIDE: '#f90c00',
    ENEMY_COLOUR_OUTSIDE: '#bb0b00',
    ENEMY_NAMES: ['Ranger','Phobos','Mynx','Orbb','Sarge','Grunt','Hunter','Klesk','Slash','Anarki','Razor','Visor','Bones','Doom','Major','Xaero'],

    // BULLETS
    BULLET_RADIUS: 3,
    BULLET_DAMAGE: 5,
    
    // DETRITI
    DEBRIS_COLOR: ['#800000','#812314','#823624','#814734','#7e5544','#796556','#727267'], // from maroon to #727267
    DEBRIS_RADIUS: 3,

    // SANGUE
    BLOOD_COLOUR: ['#ff0000','#eb0001','#d60002','#c40002','#b10002','#9d0002','#8b0000'], // from red to darkred
    BLOOD_RADIUS: 4,

    // POWERUP
    POWERUP_RADIUS: 6,
    POWERUP_SPAWN_TIME: 30*1000,
    
    // HUD
    FONT_FAMILY : '"Segoe UI",Arial,sans-serif',
    HUD_BACKGROUND:"rgba(102, 136, 204, 0.5)"
}


/*

Poteva essere usato anche una classe con proprietà statiche:
https://medium.com/@haidermalik504/classes-in-typescript-ec5e75196201
*/

/*

    For colors: http://gka.github.io/chroma.js/#cubehelix-hue
    https://gka.github.io/palettes

*/


