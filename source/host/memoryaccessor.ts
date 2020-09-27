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

    //make it so u can write an array of bytes, multiple bytes
    public write(addy: number, val: string[]): void{
      //check its a valid address
      if ((addy >= 0) && (addy < _memSize)){
        //check if we r adding just one byte or many bytes
        if (val.length == 1){
          _Memory.writeMem(addy, val[0]);
        } else if (val.length < _memSize){
            for (var i = 0; i < var.length; i++){
              var newByte =
              _Memory.writeMem(addy + i, val[i]);
            }
          }
        } else {
          _StdOut.putText("ur not valid smh");
        }
      } else {
        _StdOut.putText("ur memory address isn't valid smh");
      }
  }

  //to do read
  //be able to read multiple

    //to do for iProj 3
    mapAddress(): void{
    }

  }
}
