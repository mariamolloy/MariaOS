var TSOS;
(function (TSOS) {
    //program control block
    class PCB {
        constructor(id) {
            this.id = id;
            this.Pid = id;
        }
        //initialize pcb
        //everything is 0
        init(p) {
            this.State = "Let's goooo";
            this.PC = 0;
            this.IR = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.Partition = p;
        }
    }
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=pcb.js.map