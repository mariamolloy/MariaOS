module TSOS {

  export class Memory {
    //make memory and initialize it to 0
    constructor (private mem = new Array<String>(memSize)){
      for (var i = 0; i < memSize; i++){
        mem[i] = "00";
      }
    }

    //returns a memory address
    public readMem(addy: number): String {
      //to do add to check its above 0
      if (addy < memSize){
        return this.mem[addy];
      } else {
        _StdOut.putText("Error memory address out of bounds");
      }
    }

    //adds a byte to Memory
    //to do: check that its valid input only rlly need line 27 in this
    //move byte check to MA
    //for memory accessor u can handle an array of bytes but here just one byte at a time
    public writeMem(addy: number, byte: string): void {
      if (byte.length == 2){
        this.mem[addy] = byte;
      } else {
        _StdOut.putText("Not a byte smh");
      }

    }

  }
}
