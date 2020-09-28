var TSOS;
(function (TSOS) {
    var MemoryAccessor = /** @class */ (function () {
        function MemoryAccessor() {
        }
        //request checks what block to write mem in
        //to do for proj 3
        MemoryAccessor.prototype.requestMem = function () {
        };
        //to do for proj3
        MemoryAccessor.prototype.releaseMem = function () {
            return true;
        };
        /*  //make it so u can write an array of bytes, multiple bytes to memory
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
        } */
        /*
          //to do read
          //be able to read mutiple bytes w start end and PCB
          //but PCB is for proj 3
          //start = the memory address where we wanna start reading bytes and end is where we wanna end
            public read(start: number, end: number, maPcb: PCB): string {
              var amtToRead = end - start;
              if (amtToRead == 1){
                return _Memory.readMem(start);
              } else {
                for (var i = 0; i < amtToRead; i++){
                return _Memory.readMem(start + i);
                }
              }
            }
        */
        //writes byte to memory
        MemoryAccessor.prototype.write = function (addy, bite) {
            _Memory.writeMem(addy, bite);
        };
        //reads byte from memory
        MemoryAccessor.prototype.read = function (addy) {
            return _Memory.readMem(addy);
        };
        //to do for iProj 3
        MemoryAccessor.prototype.mapAddress = function () {
        };
        return MemoryAccessor;
    }());
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
