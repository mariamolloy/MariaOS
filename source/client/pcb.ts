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
    public Base: number;
    public Limit: number;
    public Partition: number;

    //stats
    public turnaroundTime: number;
    public waitTime: number;

    constructor(public id: number){
      this.Pid = id;
    }

    //initialize pcb
    //everything is 0 except partition base and limit
    //p = partition pcb is in
    public init(p: number): void{
      this.State = "new";
      this.PC = 0;
      this.IR = 0;
      this.Acc = 0;
      this.Xreg = 0;
      this.Yreg = 0;
      this.Zflag = 0;
      this.turnaroundTime = 0;
      this.waitTime = 0;

      this.Partition = p;

        this.Base = this.Partition * _PartitionSize ;
        this.Limit = this.Base + _PartitionSize - 1;

    }

    public updatePCB(){}
  }
}
