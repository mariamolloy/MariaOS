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
    public start: number;
    public end: number;
    public partition: number;

    constructor(public id: number){
      this.Pid = id;
    }

    //to do: init set everything to zero
    public init(): void{

    }
  }
}
