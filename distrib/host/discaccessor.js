var TSOS;
(function (TSOS) {
    var DiscAccessor = /** @class */ (function () {
        function DiscAccessor() {
        }
        //fully formats the disk
        DiscAccessor.prototype.fullFormat = function () {
            if (_Disc.format()) {
                TSOS.Control.hostInitDisk();
                _StdOut.putText("Hard Drive was successfully fully formatted.");
            }
            else {
                _StdOut.putText("Hard drive could not be formatted at this moment");
            }
        };
        //takes a track sector and branch as param and returns a file
        DiscAccessor.prototype.readFrmDisc = function (TSB) {
            return _Disc.storage.getItem(TSB);
        };
        //TSB : TSB of the file we are writing to
        //bytes : data we are writing
        DiscAccessor.prototype.writeToDisc = function (TSB, bytes) {
            _Disc.storage.setItem(TSB, bytes);
            TSOS.Control.hostUpdateDisk();
        };
        DiscAccessor.prototype.getTsb = function (t, s, b) {
            var TSB = t + ":" + s + ":" + b;
            return TSB;
        };
        return DiscAccessor;
    }());
    TSOS.DiscAccessor = DiscAccessor;
})(TSOS || (TSOS = {}));
