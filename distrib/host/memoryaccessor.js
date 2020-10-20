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
            //get the partition we are currently running in
            var part = _ProcessManager.running.Partition;
            var b = _ProcessManager.running.Base;
            var l = _ProcessManager.running.Limit;
            var physicalAddy = b + addy;
            if (physicalAddy <= l) {
                _Memory.writeMem(physicalAddy, bite);
            }
            else {
                _StdOut.putText("Error: Writing to Memory Out of Bounds");
            }
        };
        //reads byte from memory
        MemoryAccessor.prototype.read = function (addy) {
            //get the info for the partition we are currently in
            var p = _ProcessManager.running.Partition;
            var b = _ProcessManager.running.Base;
            var l = _ProcessManager.running.Limit;
            var physicalAddy = b + addy;
            if (physicalAddy <= l) {
                return _Memory.readMem(physicalAddy);
            }
            else {
                return null;
                _StdOut.putText("Error: Trying to Access Memory out of bounds");
            }
        };
        //to do for iProj 3
        MemoryAccessor.prototype.mapAddress = function () {
        };
        MemoryAccessor.prototype.inBounds = function () {
            return true;
        };
        return MemoryAccessor;
    }());
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
