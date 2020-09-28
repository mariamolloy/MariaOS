var TSOS;
(function (TSOS) {
    class ProcessManager {
        constructor() {
        }
        run() {
            //to do: scheduling and priorities and all that fun stuff
            //take all pcb stuff and make it cpu stuff
            _CPU.PC = this.process.PC;
            _CPU.Acc = this.process.Acc;
            _CPU.Xreg = this.process.Xreg;
            _CPU.Yreg = this.process.Yreg;
            _CPU.Zflag = this.process.Zflag;
            _CPU.isExecuting = true; //starts program essentially
        }
    }
    TSOS.ProcessManager = ProcessManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=processmanager.js.map