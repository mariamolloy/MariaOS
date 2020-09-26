var TSOS;
(function (TSOS) {
    class Memory {
        //make memory and initialize it to 0
        constructor(mem = new Array(memSize)) {
            this.mem = mem;
            for (var i = 0; i < memSize; i++) {
                mem[i] = "00";
            }
        }
        //returns a memory address
        readMem(addy) {
            //to do add to check its above 0
            if (addy < memSize) {
                return this.mem[addy];
            }
            else {
                _StdOut.putText("Error memory address out of bounds");
            }
        }
        //adds a byte to Memory
        //to do: check that its valid input only rlly need line 27 in this
        //move byte check to MA
        //for memory accessor u can handle an array of bytes but here just one byte at a time
        writeMem(addy, byte) {
            if (byte.length == 2) {
                this.mem[addy] = byte;
            }
            else {
                _StdOut.putText("Not a byte smh");
            }
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map