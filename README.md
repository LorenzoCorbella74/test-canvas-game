# Corbe Arena shooter 2D!

![arena](screen/arena.png)

Esempio di top down shooter, prototipo realizzato per studiare il canvas e lo sviluppo di giochi con tecnologie web. Il gioco ricrea le meccaniche di arena shooter quali Quake 3 Arena, Unreal tournament, etc. Per giocare seguire il [link](https://lorenzocorbella74.github.io/test-canvas-game/)

## Features
- [x] scrolling map built with tiles 
- [x] different types of tiles (lava, toxic water)
- [x] movements time based for all entities: [source](https://www.viget.com/articles/time-based-animation/)
- [x] camera following different entities (player, bots) 
- [x] collision system for all entities
- [x] debug mode (+ god mode, camera cycle for bots)
- [x] spawn mechanism
    - [x] spawn animation
- [x] particles (debris, blood)
    - [X] explosion
- [x] powerups system with different respawn time + counter
- [x] different weapons
    - [X] for each weapon add different effect
- [x] bots AI
    - [x] navigazione con A* in base a waypoints e collezionabili (powerups, ammo, weapons)
    - [x] brain con Finite state machine
    - [x] percezione visiva (line of sight) 
    - [x] mira con stima della posizione del target
    - [ ] utilizzo di armi in base a probabilità pesata
    - [ ] BOT AI level
- [ ] portals and jump pads (with animation)
- [ ] UI MESSAGES
    - [x] warmup, 1 minute warning, etc
    - [ ] multiple, assist, etc
- [x] different game modes (deathmatch, team deathmach)
    - [ ] page to choose game type, map, num of bots, etc
- [ ] multiple maps
- [ ] music and effects
- [ ] multiplayer
- [x] start screen
- [x] stat screen
- [x] stat screen
- [x] pause screen


### Installation
Installare tramite:

    npm install

### Development

Lanciare il server di sviluppo con:

    npm start
    

Compile TypeScript app and copy index.html to the `dist` folder.

    npm run build



## Built With

HTML5, CSS, Typescript, canvas, parcel

## Versioning

Versione 0.0.1

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details


## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/LorenzoCorbella74/testCanvasGame/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/LorenzoCorbella74](https://github.com/LorenzoCorbella74)
