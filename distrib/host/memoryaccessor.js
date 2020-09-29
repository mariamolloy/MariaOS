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
