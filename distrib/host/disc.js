var TSOS;
(function (TSOS) {
    var Disc = /** @class */ (function () {
        function Disc() {
            this.tracks = 4; //  tracks on the disk
            this.sectors = 8; // sectors in each track
            this.blocks = 8; //  blocks in each sector
            this.blockSize = 60; // actual amt of bytes to write to
            //public bytes: number = 64;
            this.isFormatted = false; //its not formatted yet
            this.storage = sessionStorage;
        }
        //function to initialize all storage to 0s
        Disc.prototype.format = function () {
            this.storage.clear();
            //make matrix with array lists
            for (var i = 0; i < this.tracks; i++) {
                for (var j = 0; j < this.sectors; j++) {
                    for (var k = 0; k < this.blocks; k++) {
                        var key = i + ":" + j + ":" + k;
                        var emptyDisc = Array();
                        for (var n = 0; n < this.blockSize; n++) {
                            emptyDisc.push("00");
                        }
                        var block = {
                            avail: "0",
                            pointer: "0:0:0",
                            data: emptyDisc // make it empty
                        };
                        this.storage.setItem(key, JSON.stringify(block));
                    }
                }
            }
            this.isFormatted = true;
        };
        return Disc;
    }());
    TSOS.Disc = Disc;
})(TSOS || (TSOS = {}));
