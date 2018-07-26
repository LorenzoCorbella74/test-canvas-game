import Game from './game';

window.onload = function () {
    let app = new Engine(new Game());
    app.bootstrap()
};

class Engine {

    private _game: Game;

	constructor(game: Game) {
		this._game = game;
	}

    bootstrap(){
        // configurazione di setup
    
        // fa partire il gameloop
        this.gameLoop();
    }

    private gameLoop(): void {
        // need to bind the current this reference to the callback
		requestAnimationFrame(this.gameLoop.bind(this)); 

        this._game.updateAll();
		this._game.renderAll();
	} 
	
} 
	

