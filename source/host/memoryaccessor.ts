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


    //writes byte to memory
    write(addy: number, bite: string): void{
      _Memory.writeMem(addy, bite);
    }

    //reads byte from memory
    read(addy: number): string {
      return _Memory.readMem(addy);
    }

    //to do for iProj 3
    mapAddress(): void{
    }

  }
}
