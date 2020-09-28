module TSOS {
  export class ProcessManager {
    //to do for iproj3:
    //add queue stuff so we can do multiple processes


    //counter to create processIDs starting with 0
    //array of all of the pcbs
    public idCounter: number = 0;
    public allPcbs: PCB[] = new Array();
constructor(){
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

  }
}
