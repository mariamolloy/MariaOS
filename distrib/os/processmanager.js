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
            //check to make sure there is an empty partition we can load this into
            if (_MemoryManager.checkEmptyPart()) {
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
            }
            else {
                _StdOut.putText("Memory full!!¡¡!! Please delete a loaded program before loading in a new one.");
            }
        };
        //make this generic to run through ready queue
        //in run shell command make it go through resident queue to find proper element to add to ready enqueue
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
            // Update host log
            TSOS.Control.hostLog("Running process " + this.running.Pid, "os");
        };
        ProcessManager.prototype.terminate = function (process) {
            this.ready.dequeue();
            _MemoryManager.clearPart(process.Partition);
            process.State = "terminated";
        };
        ProcessManager.prototype.trackStats = function () {
            //to do
            //increment turnaround time and wait time when appropriate
            //  this.running.TurnAroundTime++;
            for (var i = 0; i < this.ready.getSize(); i++) {
                //if ()
                var currentPCB = this.ready.dequeue();
                currentPCB.TurnAroundTime++;
            }
        };
        return ProcessManager;
    }());
    TSOS.ProcessManager = ProcessManager;
})(TSOS || (TSOS = {}));
