module TSOS {
  export class MemoryManager {
    constructor(){
      //to do for iproj3: make partitions here
    }

//to do i proj3: allocation and deallocation

//writingTime writes an array of strings to a specified address in memory
public writingTime(addy: number, val: string[]): void{
  //check its a valid address
  if ((addy >= 0) && (addy <= _TotalMemorySize)){
    //check if we r adding just one byte or many bytes
    if (val.length == 1){
      _MemoryAccessor.write(addy, val[0].toString())
    } //if we are adding many bytes then go through array and add byte by byte
    else if (val.length <= _TotalMemorySize){
        for (var i = 0; i < val.length; i++){
          var bite = val[i].toString();
          _MemoryAccessor.write(addy + i, bite);
        }
      }else {
      _StdOut.putText("ur not valid smh");
    }
  } else {
    _StdOut.putText("ur memory address isn't valid smh");
  }
}



//be able to read mutiple bytes w start end and PCB
//but PCB is for proj 3
//start = the memory address where we wanna start reading bytes and end is where we wanna end
  public readingTime(start: number, end: number, maPcb: PCB): string {
    var amtToRead = end - start;
    if (amtToRead == 1){
      return _MemoryAccessor.read(start);
    } else {
      for (var i = 0; i < amtToRead; i++){
        return _MemoryAccessor.read(start + i);
      }
    }
  }

  //clears memory in all sections and sets to 00 00 00 00 00 00 00 ...
  public clearAllMemory(): void{
    //make sure we arent in the middle of a process
    if (!_CPU.isExecuting){
      for (var i = 0; i < _TotalMemorySize; i++){
        _MemoryAccessor.write(i, "00");
      }
    } else {
      //error we are in the middle of a process or something
      _StdOut.putText("Error: cannot clear all memory rn");
    }
  }

  }
}
