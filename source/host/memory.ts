module TSOS {

  export class Memory {
    //make memory and initialize it to 0
    constructor (private mem = new Array<string>(_memSize)){
    }

    //initialize memory to 00000000...
    init(): void {
      for (var i = 0; i < _memSize; i++){
        this.mem[i] = "00";
      }
    }

    //returns a memory address
    public readMem(addy: number): string {
      //to do add to check its above 0
      if (addy < _memSize){
        return this.mem[addy];
      } else {
        return "Error memory address out of bounds";
        _StdOut.putText("Error memory address out of bounds");
      }
    }

    //adds a byte to Memory
    public writeMem(addy: number, byte: string): void {
      this.mem[addy] = byte;
    }

  }
}
