export class BrainFSM {

    private stack: any[] = [];
    private time: number;
    private justSetState: boolean;
    private state: string;
    private first: boolean;
    private _currentStateFunction: Function;

    get currentStateFunction() {
        return this.getCurrentState();
    }

    constructor() { }

    public update(who: any, progress: number): void {
        if (this.currentStateFunction != null) {
            this.first = this.justSetState;
            this.time += this.first ? 0 : progress;
            this.justSetState = false;
            this.currentStateFunction(who, progress);
        }
    }
    
    public popState(): Function {
        return this.stack.pop();
    }
    
    public pushState(state: Function): void {
        if (this.getCurrentState() != state) {
            this.state = state.constructor.name;
            this.time = 0;
            this.justSetState = true;
            this.stack.push(state);
        }
    }

    public getCurrentState(): Function {
        return this.stack.length > 0 ? this.stack[this.stack.length - 1] : null;
    }


    is(state: any) {
        return this._currentStateFunction === state;
    }

    isIn(...states: any) {
        return states.some(s => this.is(s));
    }
}