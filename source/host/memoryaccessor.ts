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

/**
    //writes byte to memory
    write(addy: number, bite: string, part: number): void{
      //get the partition we are currently running in
      if (_ProcessManager.allPcbs.length > 0){
        var part = _ProcessManager.running.Partition;
        var b = part * _PartitionSize;
        var l = b + _PartitionSize;
        var physicalAddy = b + addy;
        if (physicalAddy < l){
          _Memory.writeMem(physicalAddy, bite);
          TSOS.Control.hostUpdateMemory();
        } else {
          //THIS IS WHERE ERROR IS
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
        var part = _ProcessManager.running.Partition;
        var b = part * _PartitionSize;
        var l = b + _PartitionSize;
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
    */

    //writes byte to memory
    write(addy: number, bite: string): void{
      //var physical = _MemoryAccessor.addressTranslator(addy, )
      _Memory.writeMem(addy, bite);
    }

    //reads byte from memory
    read(addy: number): string {
      return _Memory.readMem(addy);
    }

    //call function with a logical address and it returns a physical address
    addressTranslator(logicalAddy: number, part: number): number{
      var base = _PartitionSize * part;
      var physicalAddy = base + logicalAddy;
      if (this.inBounds(physicalAddy, part)){
        return physicalAddy;
      } else {
        _StdOut.putText("ERROR: ADDRESS NOT IN BOUNDS");
        return null;
      }
    }

    //function to check that an address we will write to is in bounds
    inBounds(physicalAddy: number, p: number): boolean{
      var base = _PartitionSize * p;
      var limit = base + _PartitionSize;
      //if the physical address is between the base and limit we should be good
      if ((physicalAddy >= base) && (physicalAddy < limit)){
        return true;
      } else {
        _StdOut.putText("ERROR: MEM OUT OF BOUNDS");
        return false;
      }
    }

  }
}
