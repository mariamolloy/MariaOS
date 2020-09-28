var TSOS;
(function (TSOS) {
    var Memory = /** @class */ (function () {
        function Memory() {
            this.mem = new Array(_memSize);
        }
        //initialize memory to 00000000...
        Memory.prototype.init = function () {
            for (var i = 0; i < _memSize; i++) {
                this.mem[i] = "00";
            }
        };
        //returns a memory address
        Memory.prototype.readMem = function (addy) {
            //to do add to check its above 0
            if (addy < _memSize) {
                return this.mem[addy];
            }
            else {
                return "Error memory address out of bounds";
                _StdOut.putText("Error memory address out of bounds");
            }
        };
        //adds a byte to Memory
        Memory.prototype.writeMem = function (addy, byte) {
            this.mem[addy] = byte;
        };
        return Memory;
    }());
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
