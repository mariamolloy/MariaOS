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
            if (_ProcessManager.allPcbs.length > 0) {
                var part = _ProcessManager.running.Partition;
                var b = _ProcessManager.running.Base;
                var l = _ProcessManager.running.Limit;
                var physicalAddy = b + addy;
                if (physicalAddy <= l) {
                    _Memory.writeMem(physicalAddy, bite);
                    TSOS.Control.hostUpdateMemory();
                }
                else {
                    _StdOut.putText("Error: Writing to Memory Out of Bounds");
                }
            }
            else {
                _Memory.writeMem(addy, bite);
            }
        };
        //reads byte from memory
        MemoryAccessor.prototype.read = function (addy) {
            if (_ProcessManager.allPcbs.length > 0) {
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
            }
            else {
                return _Memory.readMem(addy);
            }
        };
        //to do for iProj 3
        MemoryAccessor.prototype.mapAddress = function () {
        };
        MemoryAccessor.prototype.inBounds = function (addy) {
            //  if ()
        };
        return MemoryAccessor;
    }());
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
