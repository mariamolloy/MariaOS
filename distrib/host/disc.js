var TSOS;
(function (TSOS) {
    var Disc = /** @class */ (function () {
        function Disc() {
            this.tracks = 4; //  tracks on the disk
            this.sectors = 8; // sectors in each track
            this.blocks = 8; //  blocks in each sector
            this.totalBytes = 60; // actual amt of bytes to write to
        }
        return Disc;
    }());
    TSOS.Disc = Disc;
})(TSOS || (TSOS = {}));
