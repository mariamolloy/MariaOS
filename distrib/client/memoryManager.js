var TSOS;
(function (TSOS) {
    var MemoryManager = /** @class */ (function () {
        function MemoryManager() {
            //array of partition Objects
            //we will always have three partitions in the array
            this.partitions = new Array();
            for (var i = 0; i < _NumOfPartitions; i++) {
                this.partitions[i] = new Partition(i);
            }
        }
        //checks to see if there is an empty partition we can load input into
        MemoryManager.prototype.checkEmptyPart = function () {
            for (var i = 0; i < _NumOfPartitions; i++) {
                if (this.partitions[i].isEmpty) {
                    return true;
                }
            }
            return false;
        };
        //returns partition id of first availible empty partition
        MemoryManager.prototype.getEmptyPart = function () {
            for (var i = 0; i < _NumOfPartitions; i++) {
                if (this.partitions[i].isEmpty) {
                    return i;
                }
            }
            return null;
        };
        //to do i proj3: allocation and deallocation
        //clears memory in all sections and sets to 00 00 00 00 00 00 00 ...
        MemoryManager.prototype.clearAllMemory = function () {
            //make sure we arent in the middle of a process
            if (!_CPU.isExecuting) {
                //make all memory 00000 and set all partitions to empty
                for (var i = 0; i < _TotalMemorySize; i++) {
                    _MemoryAccessor.write(i, "00");
                }
                for (var j = 0; j < _NumOfPartitions; j++) {
                    this.partitions[j].isEmpty = true;
                }
                TSOS.Control.hostUpdateMemory();
                return true;
            }
            else {
                //error we are in the middle of a process or something
                _StdOut.putText("Error: cannot clear all memory rn. be patient.");
                return false;
            }
        };
        //function to clear a single partition in memory and mark as empty
        MemoryManager.prototype.clearPart = function (p) {
            var b = this.partitions[p].base;
            var l = this.partitions[p].limit;
            for (var i = b; i < l; i++) {
                _MemoryAccessor.write(i, "00");
            }
            this.partitions[p].isEmpty = true;
            TSOS.Control.hostUpdateMemory();
        };
        //writingTime writes an array of strings to a specified address in memory in a specified partition
        MemoryManager.prototype.writingTime = function (logicalAddy, val, p) {
            var currPart = this.partitions[p];
            //check its a valid address
            if ((logicalAddy >= 0) && (logicalAddy < _PartitionSize)) {
                //translate logical address to phsyical address
                var physicalAddy = logicalAddy + currPart.base;
                //check if we r adding just one byte or many bytes
                if (val.length == 1) {
                    _MemoryAccessor.write(physicalAddy, val[0].toString());
                    currPart.isEmpty = false;
                } //if we are adding many bytes then go through array and add byte by byte
                else if (val.length <= _PartitionSize) {
                    for (var i = 0; i < val.length; i++) {
                        var bite = val[i].toString();
                        _MemoryAccessor.write(physicalAddy + i, bite);
                        currPart.isEmpty = false;
                    }
                }
                else {
                    _StdOut.putText("ERROR: You are trying to write more bytes than possible");
                }
            }
            else {
                _StdOut.putText("ERROR: You did not provide a valid memory address");
            }
        };
        //be able to read mutiple bytes w start end and PCB
        //but PCB is for proj 3
        //start = the memory address where we wanna start reading bytes and end is where we wanna end
        //read everything in one memory partition
        //p is the partition # we want to read from
        MemoryManager.prototype.readPartition = function (p) {
            var b = this.partitions[p].base;
            var l = this.partitions[p].limit;
            for (var i = b; i < l; i++) {
                return _MemoryAccessor.read(b + i);
            }
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
    //class to create partitions
    var Partition = /** @class */ (function () {
        function Partition(i) {
            this.id = i;
            this.base = this.id * _PartitionSize;
            this.limit = this.base + _PartitionSize - 1;
            this.isEmpty = true;
        }
        return Partition;
    }());
})(TSOS || (TSOS = {}));
