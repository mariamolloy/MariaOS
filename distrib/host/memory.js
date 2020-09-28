var TSOS;
(function (TSOS) {
    class Memory {
        constructor() {
            this.mem = new Array(_memSize);
        }
        //initialize memory to 00000000...
        init() {
            for (var i = 0; i < _memSize; i++) {
                this.mem[i] = "00";
            }
        }
        //returns a memory address
        readMem(addy) {
            //to do add to check its above 0
            if (addy < _memSize) {
                return this.mem[addy];
            }
            else {
                return "Error memory address out of bounds";
                _StdOut.putText("Error memory address out of bounds");
            }
        }
        //adds a byte to Memory
        writeMem(addy, byte) {
            this.mem[addy] = byte;
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map