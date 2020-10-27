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

    //resets counter
    init(): void{
      this.rrCounter = 0;
    }

    //Scheduling inspired by PhazonOS
    public schedule(){

        switch (this.alg){
          //round robin
          case "rr":
            this.roundRobin();
            break;
          //fcfs is just round robin w huge quantum
          case "fcfs":
            this.setQuantum(500000);
            this.roundRobin();
            break;
          //priority
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
        console.log("jk no need")
        this.schedule();
      }
    }

    public roundRobin(){
      //loading a new process in (could  be after a context switch?)
        if (_ProcessManager.running === null || _ProcessManager.running.State === "terminated"){
          //to do for proj 4:
          //add disk driver stuff here
          //load in new program from ready queue
          if (!_ProcessManager.isEmpty){
            //lets see if this will work
            _ProcessManager.run();
          }
        } else { //currently running a process
          console.log("Scheduler cycle " + this.rrCounter); //log current cycle
          //check if we have reached the end of our quantum cycle
          if (this.rrCounter >= this.quantum && _CPU.isExecuting){
            //big if so... time for a context switch
            console.log("Performing Context Switch");
            //to do for proj 4:
            //add disk driver stuff here
            this.rrCounter = 0;
            _KernelInterruptQueue.enqueue(new Interrupt(CONTEXT_SWITCH, ["idk"]));
          } else { //otherwise we increment counter
              this.rrCounter++;
              if (_CPU.isExecuting && !(_ProcessManager.running == null)){
                //if (_ProcessManager.running !== null){
                _ProcessManager.trackStats(); //increment wait time / turn around time as needed
                _CPU.cycle(); //call cpu cycle
                //console.log("cpu cycle " + _ProcessManager.running.Pid + " ran.");
                Control.hostUpdateCPU(); //update cpu display
                Control.hostUpdateReadyQueue(); //update ready queue display
            //  }
              }
          }
      }
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
