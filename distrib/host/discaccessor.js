var TSOS;
(function (TSOS) {
    var DiscAccessor = /** @class */ (function () {
        function DiscAccessor() {
        }
        DiscAccessor.prototype.fullFormat = function () {
            _Disc.format();
            TSOS.Control.hostInitDisk();
            _StdOut.putText("Hard Drive was successfully fully formatted.");
        };
        return DiscAccessor;
    }());
    TSOS.DiscAccessor = DiscAccessor;
})(TSOS || (TSOS = {}));
