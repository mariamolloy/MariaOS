var TSOS;
(function (TSOS) {
    class ProcessManager {
        constructor() {
            //to do for iproj3:
            //add queue stuff so we can do multiple processes
            //counter to create processIDs starting with 0
            //array of all of the pcbs
            this.idCounter = 0;
            this.allPcbs = new Array();
        }
        run(process) {
            //to do: scheduling and priorities and all that fun stuff
            //take all pcb stuff and make it cpu stuff
            _CPU.PC = process.PC;
            _CPU.Acc = process.Acc;
            _CPU.Xreg = process.Xreg;
            _CPU.Yreg = process.Yreg;
            _CPU.Zflag = process.Zflag;
            _CPU.isExecuting = true; //starts program essentially
        }
    }
    TSOS.ProcessManager = ProcessManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=processmanager.js.map