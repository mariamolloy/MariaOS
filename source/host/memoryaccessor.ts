module TSOS {
  export class MemoryAccessor {

    constructor(){
    }

    //request checks what block to write mem in
    //to do for proj 3
    public requestMem(){

    }

    //to do for proj3
    public releaseMem(): boolean{
      return true;
    }


    //writes byte to memory
    write(addy: number, bite: string): void{
      //get the partition we are currently running in
      if (_ProcessManager.allPcbs.length > 0){
        var part = _ProcessManager.running.Partition;
         var b = _ProcessManager.running.Base;
        var l = _ProcessManager.running.Limit;
        var physicalAddy = b + addy;
        if (physicalAddy <= l){
          _Memory.writeMem(physicalAddy, bite);
          TSOS.Control.hostUpdateMemory();
        } else {
          _StdOut.putText("Error: Writing to Memory Out of Bounds");
        }
    }else {
      _Memory.writeMem(addy, bite);
    }
    }

    //reads byte from memory
    read(addy: number): string {
      if (_ProcessManager.allPcbs.length > 0){
        //get the info for the partition we are currently in
        var p = _ProcessManager.running.Partition;
        var b = _ProcessManager.running.Base;
        var l = _ProcessManager.running.Limit;
        var physicalAddy = b + addy;
        if (physicalAddy <= l){
          return _Memory.readMem(physicalAddy);
      } else {
        return null;
        _StdOut.putText("Error: Trying to Access Memory out of bounds")
      }
    }else {
      return _Memory.readMem(addy);
    }
    }

    //to do for iProj 3
    mapAddress(): void{

    }

    inBounds(addy:number):void{ //boolean{
      //  if ()
    }

  }
}
