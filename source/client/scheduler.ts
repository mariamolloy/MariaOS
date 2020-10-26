module TSOS {
  export class Scheduler {
    public quantum: number;
    public alg: string;
    public rrCounter: number;

    constructor (){
      this.quantum = _DefaultQuantum;
      this.rrCounter = 0;
      this.alg = "ROUND_ROBIN";
    }

    //the eyes of the scheduler are always watching and waiting
    public schedulerEyes(){
      if (!_ProcessManager.ready.isEmpty()){
        
      }
    }

    public setAlg(a: string): boolean{
      switch (a) {
        case "ROUND_ROBIN":
          this.alg = "ROUND_ROBIN"
          break;
        case "FCFS":
          this.alg = "FCFS"
          this.setQuantum(500000);
          break;
        case "PRIORITY":
          this.alg = "PRIORITY";
          break;
        default:
          return false;
      }
      return true;
    }

    public roundRobin(){

    }

    public fcfs(){

    }

    public setQuantum(q: number): void{
      this.quantum = q;
    }

    //to do round robin
  }


}
