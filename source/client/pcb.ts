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

    public Priority: number; //scheduling priority

    //stats
    public TurnAroundTime: number;
    public WaitTime: number;

    constructor(public id: number){
      this.Pid = id;
    }

    //initialize pcb
    //everything is 0 except partition base and limit
    //p = partition pcb is in
    public init(part: number, pri: number): void{
      this.State = "new";
      this.PC = 0;
      this.IR = 0;
      this.Acc = 0;
      this.Xreg = 0;
      this.Yreg = 0;
      this.Zflag = 0;

      this.TurnAroundTime = 0;
      this.WaitTime = 0;

      this.Partition = part;

      this.Priority = pri; //default = 1

      this.Base = this.Partition * _PartitionSize ;
      this.Limit = this.Base + _PartitionSize - 1;

    }

    //returns pid of current process control block
    public getPid(): number{
      return this.Pid;
    }

    public copyPCB(original: PCB): PCB{
      let pa = original.Partition;
      let pr = original.Priority;
      let copy = new PCB(pa);
      copy.init(pa, pr);

      copy.State = original.State;
      copy.PC = original.PC;
      copy.IR = original.PC;
      copy.Acc = original.PC;
      copy.Xreg = original.Xreg;
      copy.Yreg = original.Yreg;
      copy.Zflag = original.Zflag;

      copy.TurnAroundTime = original.TurnAroundTime;
      copy.WaitTime = original.WaitTime;

      return copy;
    }


  }
}
