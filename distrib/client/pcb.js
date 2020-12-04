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
        PCB.prototype.init = function (part, pri) {
            this.State = "new";
            this.PC = 0;
            this.IR = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.TurnAroundTime = 0;
            this.WaitTime = 0;
            this.Partition = part;
            this.Priority = pri; //default = 1
            this.Base = this.Partition * _PartitionSize;
            this.Limit = this.Base + _PartitionSize - 1;
        };
        //returns pid of current process control block
        PCB.prototype.getPid = function () {
            return this.Pid;
        };
        PCB.prototype.copyPCB = function (original) {
            var pa = original.Partition;
            var pr = original.Priority;
            var copy = new PCB(pa);
            copy.init(pa, pr);
            copy.State = original.State;
            copy.PC = original.PC;
            copy.IR = original.PC;
            copy.Acc = original.PC;
            copy.Xreg = original.Xreg;
            copy.Yreg = original.Yreg;
            copy.Zflag = original.Zflag;
            copy.TurnAroundTime = original.TurnAroundTime;
            copy.WaitTime = original.WaitTime;
            return copy;
        };
        return PCB;
    }());
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
