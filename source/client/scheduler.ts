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
        //if current process isnt done running, add it to the back of the queue
        if (_ProcessManager.running.State !== "terminated"){
          _ProcessManager.running.State = "ready";
          console.log("Enqueuing Process " + _ProcessManager.running.Pid);
          _ProcessManager.ready.enqueue(_ProcessManager.running);
        }
        //get next process and run it
        _ProcessManager.running = _ProcessManager.ready.dequeue();
        _CPU.setCPU(_ProcessManager.running);
        console.log("Switching to process " + _ProcessManager.running.Pid);
        if (_CPU.isExecuting){
          this.schedule();
        }
      } else {
        this.schedule();
      }
    }

    public roundRobin(){
      if (this.rrCounter == this.quantum){
        console.log("Performing Context Switch");
        this.rrCounter = 0;
        _KernelInterruptQueue.enqueue(new Interrupt(CONTEXT_SWITCH, "time 4 a context switch"));
      }
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
