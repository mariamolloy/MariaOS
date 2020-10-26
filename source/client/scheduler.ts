module TSOS {
  export class Scheduler {
    public quantum: number;
    public alg: string;
    public rrCounter: number;

    constructor (){
      this.quantum = _DefaultQuantum;
      this.rrCounter = 0;
      this.alg = "rr";
    }

    //main process that runs every cpu cycle
    public schedule(){
      //idt we need to do anything if theres nothing in da ready qeueueueue
      if (!_ProcessManager.ready.isEmpty()){
        switch (this.alg){
          case "rr":
            this.roundRobin();
            break;
          case "fcfs":
            this.setQuantum(500000);
            this.fcfs();
            break;
          case "priority":
            this.priority();
            break;
        }
      }
    }

    public setAlg(a: string): boolean{
      switch (a) {
        case "rr":
          this.alg = "rr"
          break;
        case "fcfs":
          this.alg = "fcfs"
          this.setQuantum(500000);
          break;
        case "priority":
          this.alg = "priority";
          break;
        default:
          return false;
      }
      return true;
    }

    public contextSwitch(): void{
      //no need to do anything if ready queue is isEmpty
      if (!_ProcessManager.ready.isEmpty()){
        
      }
    }

    public roundRobin(){
      this.rrCounter++;
    }

    //to do for project 4
    public fcfs(){

    }

    //to do for project 4
    public priority(){

    }

    public setQuantum(q: number): void{
      this.quantum = q;
    }

    //to do round robin
  }


}
