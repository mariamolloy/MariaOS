module TSOS {
  export class MemoryAccessor {
    public base: number;
    public limit: number;
    public par: number;

    constructor(){
      this.base = 0;
      this.limit = _PartitionSize;
      this.par = 0;
    }

    //request checks what block to write mem in
    //to do for proj 3
    public requestMem(): void{

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

    //never call this without calling addressTranslator first except when we are printing to the gui
    //writes byte to memory
    write(addy: number, bite: string): void{
      _Memory.writeMem(addy, bite);
    }

    //reads byte from memory
    read(addy: number): string {
      return _Memory.readMem(addy);
    }

    //call function with a logical address and it returns a physical address
    //same as one in cpu... which to delete?
    public addressTranslator(logicalAddy: number, par: number): number{
      this.par = par;
      this.base = _PartitionSize * this.par;
      var physicalAddy = this.base + logicalAddy;
      if (this.inBounds(physicalAddy, this.par)){
        return physicalAddy;
      } else {
        _StdOut.putText("ERROR: ADDRESS NOT IN BOUNDS");
        return null;
      }
    }

    //function to check that an address we will write to is in bounds
  public inBounds(physicalAddy: number, par: number): boolean{
      this.par = par;
      this.base = _PartitionSize * this.par;
      this.limit = this.base + _PartitionSize;
      //if the physical address is between the base and limit we should be good
      if ((physicalAddy >= this.base) && (physicalAddy < this.limit)){
        return true;
      } else {
        _StdOut.putText("ERROR: MEM OUT OF BOUNDS");
        return false;
      }
    }

  }
}
