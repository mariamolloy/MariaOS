module TSOS {
  //program control block
  export class PCB {
    public Pid: number;
    public State: string;
    public PC: number;
    public IR: number;
    public Acc: number;
    public Xreg: number;
    public Yreg: number;
    public Zflag: number;

    //stuff w memory limits
    /*public Start: number;
    public End: number;*/
    public Partition: number;

    constructor(public id: number){
      this.Pid = id;
    }

    //initialize pcb
    //everything is 0
    public init(p: number): void{
      this.State = "Let's goooo";
      this.PC = 0;
      this.IR = 0;
      this.Acc = 0;
      this.Xreg = 0;
      this.Yreg = 0;
      this.Zflag = 0;
      this.Partition = p;

    }
  }
}
