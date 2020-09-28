module TSOS {
  export class MemoryAccessor {
    constructor(){}
    
    //request checks what block to write mem in
    //to do for proj 3
    public requestMem(){

    }

    //to do for proj3
    public releaseMem(): boolean{
      return true;
    }

    //make it so u can write an array of bytes, multiple bytes to memory
    public write(addy: number, val: string[]): void{
      //check its a valid address
      if ((addy >= 0) && (addy < _memSize)){
        //check if we r adding just one byte or many bytes
        if (val.length == 1){
          _Memory.writeMem(addy, val[0].toString());
        } else if (val.length < _memSize){
            for (var i = 0; i < val.length; i++){
              var newByte = val[i].toString();
              var add = addy + (i * 2);
              _Memory.writeMem(addy + i, newByte);
            }
          }else {
          _StdOut.putText("ur not valid smh");
        }
      } else {
        _StdOut.putText("ur memory address isn't valid smh");
      }
  }

  //to do read
  //be able to read mutiple bytes w start end and PCB
  //but PCB is for proj 3
  //start = the memory address where we wanna start reading bytes and end is where we wanna end
    public read(start: number, end: number, maPcb: PCB): string {
      var amtToRead = end - start;
      if (amtToRead == 1){
        _Memory.readMem(start);
      } else {
        for (var i = 0; i < amtToRead; i++){
          _Memory.readMem(start + i);
        }
      }
    }

    //to do for iProj 3
    mapAddress(): void{
    }

  }
}
