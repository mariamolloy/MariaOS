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
        this.resident = new Queue();
        this.ready = new Queue();
    }

    //put all ur shell load code in here
    public load(input: string[]): void{

      //finds the first empty partition to load input into
      var part = _MemoryManager.getEmptyPart();
      _CurrentPartition = part;

      //assign	a	Process	ID	(PID) and create	a	Process	Control	Block	(PCB)
      var processID = this.idCounter;
      var newPcb = new PCB(processID);
      this.allPcbs.push(newPcb);
      this.resident.enqueue(newPcb);
      this.idCounter++;

      newPcb.init(part); //initialize the PCB we just made with the free partition we found earlier
    //  _ProcessManager.running = newPcb; //set this as current PCB to put into memory


      //go through the array and load into memory at location $0000
      _MemoryManager.writingTime(0, input, part);

      //return	the	PID	to	the	console	and	display	it.
      _StdOut.putText("Loaded Process " + processID);

    }

    public run(process: PCB): void{
      //to do: scheduling and priorities and all that fun stuff
      this.running = process;
      //take all pcb stuff and make it cpu stuff
      _CPU.PC = process.PC;
      _CPU.Acc = process.Acc;
      _CPU.Xreg = process.Xreg;
      _CPU.Yreg = process.Yreg;
      _CPU.Zflag = process.Zflag;
      _CPU.Pcb = process;

      process.State = "running";

      this.ready.enqueue(process);
      _CurrentPartition = process.Partition;

      _CPU.isExecuting = true; //starts program essentially
    }

    public terminate(process: PCB){
      this.ready.dequeue();
      _MemoryManager.clearPart(process.Partition);
      process.State = "terminated";
    }

    public trackStats(): void{
      //to do
      //increment turnaround time and wait time when appropriate
    }

  }
}
