var TSOS;
(function (TSOS) {
    var Disc = /** @class */ (function () {
        function Disc() {
            this.tracks = 4; //  tracks on the disk
            this.sectors = 8; // sectors in each track
            this.blocks = 8; //  blocks in each sector
            this.totalBytes = 60; // actual amt of bytes to write to
            this.isFormatted = false; //its not formatted yet
        }
        //function to initialize all storage to 0s
        Disc.prototype.format = function () {
            //make matrix with array lists
            for (var i = 0; i < this.tracks; i++) {
                for (var j = 0; j < this.sectors; j++) {
                    for (var k = 0; k < this.blocks; k++) {
                        var key = i + ":" + j + ":" + k;
                        var emptyDisc = Array();
                        for (var n = 0; n < this.totalBytes; n++) {
                            emptyDisc.push("00");
                        }
                        var block = {
                            avail: "0",
                            pointer: "0:0:0",
                            data: emptyDisc // make it empty
                        };
                        sessionStorage.setItem(key, JSON.stringify(block));
                        this.isFormatted = true;
                    }
                }
            }
        };
        return Disc;
    }());
    TSOS.Disc = Disc;
})(TSOS || (TSOS = {}));
