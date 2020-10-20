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

    public running = PCB;
constructor(){
  this.resident = new Queue();
  this.ready = new Queue();
}


    public run(process: PCB): void{
      //to do: scheduling and priorities and all that fun stuff

      //take all pcb stuff and make it cpu stuff
      _CPU.PC = process.PC;
      _CPU.Acc = process.Acc;
      _CPU.Xreg = process.Xreg;
      _CPU.Yreg = process.Yreg;
      _CPU.Zflag = process.Zflag;
      _CPU.isExecuting = true; //starts program essentially
    }

    public trackStats(): void{
      //to do
      //increment turnaround time and wait time when appropriate
    }

  }
}
