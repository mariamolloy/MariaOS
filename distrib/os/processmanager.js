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
        //put all ur shell load code in here
        ProcessManager.prototype.load = function (input) {
            //finds the first empty partition to load input into
            var part = _MemoryManager.getEmptyPart();
            _CurrentPartition = part;
            //assign	a	Process	ID	(PID) and create	a	Process	Control	Block	(PCB)
            var processID = this.idCounter;
            var newPcb = new TSOS.PCB(processID);
            this.allPcbs.push(newPcb);
            this.resident.enqueue(newPcb);
            this.idCounter++;
            newPcb.init(part); //initialize the PCB we just made with the free partition we found earlier
            //  _ProcessManager.running = newPcb; //set this as current PCB to put into memory
            //go through the array and load into memory at location $0000
            _MemoryManager.writingTime(0, input, part);
            //return	the	PID	to	the	console	and	display	it.
            _StdOut.putText("Loaded Process " + processID);
        };
        ProcessManager.prototype.run = function (process) {
            //to do: scheduling and priorities and all that fun stuff
            this.running = process;
            //take all pcb stuff and make it cpu stuff
            _CPU.PC = process.PC;
            _CPU.Acc = process.Acc;
            _CPU.Xreg = process.Xreg;
            _CPU.Yreg = process.Yreg;
            _CPU.Zflag = process.Zflag;
            _CPU.Pcb = process;
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
