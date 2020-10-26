module TSOS {
  export class ProcessManager {
    //to do for iproj3:
    //add queue stuff so we can do multiple processes
    public resident: any; //loaded and ready processes
    public ready: any; //running processes

    //counter to create processIDs starting with 0
    //array of all of the pcbs
    public idCounter: number = 0;
    public allPcbs: PCB[] = new Array(); //all processes

    public running: PCB;

    constructor(){
        this.resident = new Queue<PCB>();
        this.ready = new Queue<PCB>();
    }

    //put all ur shell load code in here
    public load(input: string[]): void{
      //check to make sure there is an empty partition we can load this into
      if (_MemoryManager.checkEmptyPart()){
        //finds the first empty partition to load input into
        var part = _MemoryManager.getEmptyPart();
        _CurrentPartition = part;

        //assign	a	Process	ID	(PID) and create	a	Process	Control	Block	(PCB)
        var processID = this.idCounter;
        var newPcb = new PCB(processID);
        //this.allPcbs.push(newPcb);


        newPcb.init(part); //initialize the PCB we just made with the free partition we found earlier
      //  _ProcessManager.running = newPcb; //set this as current PCB to put into memory

      //add initalized PCB to resident queue now that it is loaded
      this.resident.enqueue(newPcb);
      this.idCounter++; //increment pcb id counter

        //go through the array and load into memory at location $0000
        _MemoryManager.writingTime(0, input, part);

        //return	the	PID	to	the	console	and	display	it.
        _StdOut.putText("Loaded Process " + processID);
      } else {
        _StdOut.putText("Memory full!!¡¡!! Please delete a loaded program before loading in a new one.");
      }
    }

    //in run shell command make it go through resident queue to find proper element to add to ready enqueue
    public run(): void{

      //to do: scheduling and priorities and all that fun stuff
      this.running = this.ready.dequeue();
      //take all pcb stuff and make it cpu stuff
      _CPU.PC = this.running.PC;
      _CPU.Acc = this.running.Acc;
      _CPU.Xreg = this.running.Xreg;
      _CPU.Yreg = this.running.Yreg;
      _CPU.Zflag = this.running.Zflag;
      _CPU.Pcb = this.running;

      this.running.State = "running";

      _CurrentPartition = this.running.Partition;

      _CPU.isExecuting = true; //starts program essentially

      // Update host log
      Control.hostLog("Running process " + this.running.Pid, "OS");
    }

    public terminate(){
      //this.ready.dequeue();
      _MemoryManager.clearPart(this.running.Partition);
      this.running.State = "terminated";
      Control.hostLog("Exiting process" + this.running.Pid, "OS");
      _StdOut.advanceLine();
      //print stats
      _StdOut.putText("Process ID: " + this.running.Pid);
      _StdOut.advanceLine();
      _StdOut.putText("Turnaround time: " + this.running.TurnAroundTime + " cycles, wait time: "
          + this.running.WaitTime + " cycles.");
      //reset cursor to new line
      _StdOut.advanceLine();
      _OsShell.putPrompt();

      //clear out prev running prog
      this.running = null;
    }

    //function to check if anything is in the ready queues
    //--> to check if we
    public checkReady(): void {
      if(!this.ready.isEmpty()){
        this.run();
      }
      else {
      //  _CPU.isExecuting
      }
    }


    public trackStats(): void{
      //to do
      //increment turnaround time of running prog
      this.running.TurnAroundTime++;
      for (var i = 0; i < this.ready.getSize(); i++){
        //increment turnaround time and wait time of everything in ready queue
        var currentPCB = this.ready.dequeue();
        currentPCB.TurnAroundTime++;
        currentPCB.WaitTime++;
        this.ready.enqueue(currentPCB);
      }
    }

  }
}
