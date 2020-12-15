var TSOS;
(function (TSOS) {
    var Swapper = /** @class */ (function () {
        function Swapper() {
        }
        Swapper.prototype.writeProcessToDisc = function (input, procId) {
            var fn = "#PROCESS" + procId;
            _krnDiscDriver.createFile(fn);
            for (var i = input.length; i < _PartitionSize; i++) {
                input.push("00");
            }
            if (_krnDiscDriver.writeProcess(fn, input)) {
                _StdOut.putText("Loaded Process " + procId);
            }
            else {
                _StdOut.putText("Could not load Process " + procId);
            }
        };
        Swapper.prototype.swapIn = function () {
        };
        Swapper.prototype.swapOut = function () {
        };
        return Swapper;
    }());
    TSOS.Swapper = Swapper;
})(TSOS || (TSOS = {}));
