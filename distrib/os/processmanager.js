var TSOS;
(function (TSOS) {
    var ProcessManager = /** @class */ (function () {
        function ProcessManager() {
            //counter to create processIDs starting with 0
            //array of all of the pcbs
            this.idCounter = 0;
            this.allPcbs = new Array(); //all processes
            this.running = TSOS.PCB;
            this.resident = new TSOS.Queue();
            this.ready = new TSOS.Queue();
        }
        ProcessManager.prototype.run = function (process) {
            //to do: scheduling and priorities and all that fun stuff
            //take all pcb stuff and make it cpu stuff
            _CPU.PC = process.PC;
            _CPU.Acc = process.Acc;
            _CPU.Xreg = process.Xreg;
            _CPU.Yreg = process.Yreg;
            _CPU.Zflag = process.Zflag;
            _CPU.isExecuting = true; //starts program essentially
        };
        ProcessManager.prototype.trackStats = function () {
            //to do
            //increment turnaround time and wait time when appropriate
        };
        return ProcessManager;
    }());
    TSOS.ProcessManager = ProcessManager;
})(TSOS || (TSOS = {}));
