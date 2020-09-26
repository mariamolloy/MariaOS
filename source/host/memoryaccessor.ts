module TSOS {
  export class memoryAccessor {
    constructor(){}
    //request checks what block to write mem in
    //to do for proj 3
    public requestMem(){

    }

    //to do for proj3
    public releaseMem(): boolean{
      return true;
    }

    public write(addy: number, val: string): void{
      //check its a valid address
      if ((addy >= 0) && (addy < memSize)){
        //check that we are actually adding a byte
        if (val.length == 2){
          _Memory.writeMem(addy, val);
        } else {
          _StdOut.putText("not a byte smh");
        }
      } else {
        _StdOut.putText("ur memory address isn't valid smh");
      }
  }


    //to do for iProj 3
    mapAddress(): void{
    }

  }
}
