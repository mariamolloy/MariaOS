module TSOS {
  export class Scheduler {
    public quantum: number;
    public alg: string;
    public rrCounter: number;
    public pCounter: number;

    constructor (){
      this.quantum = _DefaultQuantum;
      this.rrCounter = 0;
      this.alg = "rr";
    }

    //resets counter
    //called at run and runall
    init(): void{
      this.rrCounter = 0;
      this.pCounter = 0;
    }

    //Scheduling inspired by PhazonOS
    //schedule function is called every clock tick
    public schedule(){

        switch (this.alg){
          //round robin
          case "rr":
            if (this.quantum > 100){
              this.setQuantum(6);
            } else {
              this.setQuantum(this.quantum);
            }
            this.roundRobin();
            break;
          //fcfs is just round robin w huge quantum
          case "fcfs":
            this.setQuantum(500000000000);
            this.roundRobin();
            break;
          //priority
          case "priority":
            this.priority();
            break;
        }

    }

    //sets scheduling algorithm to input
    public setAlg(a: string): boolean{
      switch (a) {
        case "rr":
          if (this.quantum > 100){
            this.setQuantum(6);
          } else {
            this.setQuantum(this.quantum);
          }
          this.alg = "rr"
          break;
        case "fcfs":
          this.alg = "fcfs"
          this.setQuantum(5000000000000);
          break;
        case "priority":
          this.alg = "priority";
          break;
        default:
          return false;
      }
      return true;
    }

    //context switch!!! switch from one program to another
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
        _CPU.setCPU(_ProcessManager.running); //reset cpu to correct values
        console.log("Switching to process " + _ProcessManager.running.Pid);
        if (_CPU.isExecuting){
          this.schedule(); //we r always scheduling
        }
      } else {
        console.log("jk no need")
        this.schedule(); //we r always scheduling
      }
    }

    //round robin function
    public roundRobin(){
      if (this.alg == "fcfs"){
        console.log("Scheduler: First Come First Serve");
      } else if (this.alg == "rr"){
        console.log("Scheduler: Round Robin");
      }
      //loading a new process in
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
                _ProcessManager.trackStats(); //increment wait time / turn around time as needed
                _CPU.cycle(); //call cpu cycle
                Control.hostUpdateCPU(); //update cpu display
              }
          }
      }
    }

    //priority scheduling
    public priority(){
      console.log("Scheduler: Priority");
      //nothing to do if ready queue is empty
      if (_ProcessManager.ready.getSize()>0) {
        if (_ProcessManager.running === null || _ProcessManager.running.State === "terminated") {
          this.pCounter = 0;
         _ProcessManager.priorityRun();
        } else { //currently running a process
          console.log("Scheduler cycle " + this.pCounter + "; running program " + _ProcessManager.running.Pid + " with priority " + _ProcessManager.running.Priority); //log current cycle
        }
        this.pCounter++;
        if (_CPU.isExecuting && !(_ProcessManager.running == null)) {
          _ProcessManager.trackStats(); //increment wait time / turn around time as needed
          _CPU.cycle(); //call cpu cycle
          Control.hostUpdateCPU(); //update cpu display
        }
      } else {
        if (_CPU.isExecuting && !(_ProcessManager.running == null)){ //if were in the middle of runnning a program
          _ProcessManager.trackStats(); //increment wait time / turn around time as needed
          _CPU.cycle(); //call cpu cycle
          Control.hostUpdateCPU(); //update cpu display
        }
      }
    }

    //sets quantum to param
    public setQuantum(q: number): void{
      this.quantum = q;
    }

  }


}
