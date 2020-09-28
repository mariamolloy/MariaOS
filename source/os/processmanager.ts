module TSOS {
  export class ProcessManager {
    //to do for iproj3:
    //add queue stuff so we can do multiple processes
    public process: TSOS.PCB;

    constructor(){
    }

    public run(): void{
      //to do: scheduling and priorities and all that fun stuff

      //take all pcb stuff and make it cpu stuff
      _CPU.PC = this.process.PC;
      _CPU.Acc = this.process.Acc;
      _CPU.Xreg = this.process.Xreg;
      _CPU.Yreg = this.process.Yreg;
      _CPU.Zflag = this.process.Zflag;
      _CPU.isExecuting = true; //starts program essentially
    }
  }
}
