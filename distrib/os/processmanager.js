var TSOS;
(function (TSOS) {
    var ProcessManager = /** @class */ (function () {
        function ProcessManager() {
            //counter to create processIDs starting with 0
            this.idCounter = 0;
            this.resident = new TSOS.Queue();
            this.ready = new TSOS.Queue();
            this.running = null;
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
                newPcb.init(part); //initialize the PCB we just made with the free partition we found earlier
                //  _ProcessManager.running = newPcb; //set this as current PCB to put into memory
                //add initalized PCB to resident queue now that it is loaded
                this.resident.enqueue(newPcb);
                this.idCounter++; //increment pcb id counter
                //go through the array and load into memory at location $0000
                _MemoryManager.writingTime(0, input, part);
                //return	the	PID	to	the	console	and	display	it.
                _StdOut.putText("Loaded Process " + processID);
            }
            else {
                _StdOut.putText("Memory full!!¡¡!! Please delete a loaded program before loading in a new one.");
            }
        };
        //in run shell command make it go through resident queue to find proper element to add to ready enqueue
        ProcessManager.prototype.run = function () {
            //to do: scheduling and priorities and all that fun stuff
            this.running = this.ready.dequeue();
            //take all pcb stuff and make it cpu stuff
            _CPU.PC = this.running.PC;
            _CPU.Acc = this.running.Acc;
            _CPU.Xreg = this.running.Xreg;
            _CPU.Yreg = this.running.Yreg;
            _CPU.Zflag = this.running.Zflag;
            _CPU.Pcb = this.running;
            this.running.State = "running";
            _CurrentPartition = this.running.Partition;
            // Update host log and console log
            TSOS.Control.hostLog("Running process " + this.running.Pid, "OS");
            console.log("running process " + this.running.Pid);
        };
        ProcessManager.prototype.terminate = function (process) {
            //this.ready.dequeue();
            console.log("process " + process.Pid + " is over");
            _MemoryManager.clearPart(process.Partition);
            process.State = "terminated";
            TSOS.Control.hostLog("Exiting process" + process.Pid, "OS");
            _StdOut.advanceLine();
            //print stats
            _StdOut.putText("Process ID: " + process.Pid);
            _StdOut.advanceLine();
            _StdOut.putText("Turnaround time: " + process.TurnAroundTime + " cycles, wait time: "
                + process.WaitTime + " cycles.");
            //reset cursor to new line
            _StdOut.advanceLine();
            _OsShell.putPrompt();
            this.running = null;
            if (this.ready.isEmpty()) {
                _CPU.isExecuting = false;
            }
        };
        ProcessManager.prototype.kill = function (process) {
            console.log("killing process " + process.Pid);
            _MemoryManager.clearPart(process.Partition);
            process.State = "terminated";
            TSOS.Control.hostLog("Exiting process" + process.Pid, "OS");
            _StdOut.advanceLine();
            //print stats
            _StdOut.putText("Process ID: " + process.Pid);
            _StdOut.advanceLine();
            _StdOut.putText("Turnaround time: " + process.TurnAroundTime + " cycles, wait time: "
                + process.WaitTime + " cycles.");
            //reset cursor to new line
            _StdOut.advanceLine();
            _OsShell.putPrompt();
            if (process.Pid == this.running.Pid) {
                this.running = null;
            }
        };
        //  WE MAY NOT EVEN NEED THIS????
        //function to check if anything is in the ready queues
        //--> to check if we
        ProcessManager.prototype.checkReady = function () {
            if (!this.ready.isEmpty()) {
                this.run();
            }
            else {
                //  _CPU.isExecuting
            }
        };
        ProcessManager.prototype.trackStats = function () {
            //to do
            //increment turnaround time of running prog
            this.running.TurnAroundTime++;
            for (var i = 0; i < this.ready.getSize(); i++) {
                //increment turnaround time and wait time of everything in ready queue
                var currentPCB = this.ready.dequeue();
                currentPCB.TurnAroundTime++;
                currentPCB.WaitTime++;
                this.ready.enqueue(currentPCB);
            }
        };
        return ProcessManager;
    }());
    TSOS.ProcessManager = ProcessManager;
})(TSOS || (TSOS = {}));
