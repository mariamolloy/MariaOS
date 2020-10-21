var TSOS;
(function (TSOS) {
    var ProcessManager = /** @class */ (function () {
        function ProcessManager() {
            //counter to create processIDs starting with 0
            //array of all of the pcbs
            this.idCounter = 0;
            this.allPcbs = new Array(); //all processes
            this.resident = new TSOS.Queue();
            this.ready = new TSOS.Queue();
        }
        ProcessManager.prototype.run = function (process) {
            //to do: scheduling and priorities and all that fun stuff
            this.running = process;
            //take all pcb stuff and make it cpu stuff
            _CPU.PC = process.PC;
            _CPU.Acc = process.Acc;
            _CPU.Xreg = process.Xreg;
            _CPU.Yreg = process.Yreg;
            _CPU.Zflag = process.Zflag;
            process.State = "running";
            this.ready.enqueue(process);
            _CurrentPartition = process.Partition;
            _CPU.isExecuting = true; //starts program essentially
        };
        ProcessManager.prototype.terminate = function (process) {
            this.ready.dequeue();
            _MemoryManager.clearPart(process.Partition);
            process.State = "terminated";
        };
        ProcessManager.prototype.trackStats = function () {
            //to do
            //increment turnaround time and wait time when appropriate
        };
        return ProcessManager;
    }());
    TSOS.ProcessManager = ProcessManager;
})(TSOS || (TSOS = {}));
