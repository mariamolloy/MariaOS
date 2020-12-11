var TSOS;
(function (TSOS) {
    var DiscAccessor = /** @class */ (function () {
        function DiscAccessor() {
        }
        //formats the disk
        DiscAccessor.prototype.fullFormat = function () {
            if (_Disc.format()) {
                TSOS.Control.hostInitDisk();
                _StdOut.putText("Hard Drive was successfully fully formatted.");
            }
            else {
                _StdOut.putText("Hard drive could not be formatted at this moment");
            }
        };
        DiscAccessor.prototype.readFrmDisc = function () {
            return "hi";
        };
        DiscAccessor.prototype.createFile = function () {
        };
        DiscAccessor.prototype.writeToDisc = function () {
        };
        DiscAccessor.prototype.getTsb = function (t, s, b) {
            var TSB = t + ":" + s + ":" + b;
            return TSB;
        };
        return DiscAccessor;
    }());
    TSOS.DiscAccessor = DiscAccessor;
})(TSOS || (TSOS = {}));
