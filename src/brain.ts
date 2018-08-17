export class BrainFSM {

    private  stack :any[] = [];
    private  _currentStateFunction :Function;

    get currentStateFunction() {
        return this.getCurrentState();
    }
 
    constructor(){}
    
    public update(who:any, progress:number) :void {
        if (this.currentStateFunction != null) {
            this.currentStateFunction(who, progress);
        }
    }
 
    public popState() :Function {
        return this.stack.pop();
    }
 
    public pushState(state :Function) :void {
        if (this.getCurrentState() != state) {
            this.stack.push(state);
        }
    }
 
    public getCurrentState() :Function {
        return this.stack.length > 0 ? this.stack[this.stack.length - 1] : null;
    }
}