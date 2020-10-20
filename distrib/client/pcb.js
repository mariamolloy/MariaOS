var TSOS;
(function (TSOS) {
    //program control block
    var PCB = /** @class */ (function () {
        function PCB(id) {
            this.id = id;
            this.Pid = id;
        }
        //initialize pcb
        //everything is 0 except partition base and limit
        //p = partition pcb is in
        PCB.prototype.init = function (p) {
            this.State = "new";
            this.PC = 0;
            this.IR = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.turnaroundTime = 0;
            this.waitTime = 0;
            this.Partition = p;
            this.Base = this.Partition * _PartitionSize;
            this.Limit = this.Base + _PartitionSize - 1;
        };
        PCB.prototype.updatePCB = function () { };
        return PCB;
    }());
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
