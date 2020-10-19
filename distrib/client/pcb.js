var TSOS;
(function (TSOS) {
    //program control block
    var PCB = /** @class */ (function () {
        function PCB(id) {
            this.id = id;
            this.Pid = id;
        }
        //initialize pcb
        //everything is 0
        PCB.prototype.init = function (p) {
            this.State = "ready";
            this.PC = 0;
            this.IR = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.Partition = p;
        };
        return PCB;
    }());
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
