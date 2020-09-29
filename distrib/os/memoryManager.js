var TSOS;
(function (TSOS) {
    var MemoryManager = /** @class */ (function () {
        function MemoryManager() {
            //to do for iproj3: make partitions here
        }
        //to do i proj3: allocation and deallocation
        //to do write (wrap around memory accessor)
        //make it so u can write an array of bytes, multiple bytes to memory
        MemoryManager.prototype.writingTime = function (addy, val) {
            //check its a valid address
            if ((addy >= 0) && (addy < _memSize)) {
                //check if we r adding just one byte or many bytes
                if (val.length == 1) {
                    _MemoryAccessor.write(addy, val[0].toString());
                } //if we are adding many bytes then go through array and add byte by byte
                else if (val.length <= _memSize) {
                    for (var i = 0; i < val.length; i++) {
                        var bite = val[i].toString();
                        _MemoryAccessor.write(addy + i, bite);
                    }
                }
                else {
                    _StdOut.putText("ur not valid smh");
                }
            }
            else {
                _StdOut.putText("ur memory address isn't valid smh");
            }
        };
        //be able to read mutiple bytes w start end and PCB
        //but PCB is for proj 3
        //start = the memory address where we wanna start reading bytes and end is where we wanna end
        MemoryManager.prototype.readingTime = function (start, end, maPcb) {
            var amtToRead = end - start;
            if (amtToRead == 1) {
                return _MemoryAccessor.read(start);
            }
            else {
                for (var i = 0; i < amtToRead; i++) {
                    return _MemoryAccessor.read(start + i);
                }
            }
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
