var TSOS;
(function (TSOS) {
    var Scheduler = /** @class */ (function () {
        function Scheduler() {
            this.quantum = _DefaultQuantum;
            this.rrCounter = 0;
            this.alg = "rr";
        }
        //called when cpu is not executing
        //main process that runs every cpu cycle
        Scheduler.prototype.schedule = function () {
            switch (this.alg) {
                //round robin
                case "rr":
                    this.roundRobin();
                    break;
                //fcfs is just round robin w huge quantum
                case "fcfs":
                    this.setQuantum(500000);
                    this.roundRobin();
                    break;
                //priority
                case "priority":
                    this.priority();
                    break;
            }
        };
        Scheduler.prototype.setAlg = function (a) {
            switch (a) {
                case "rr":
                    this.alg = "rr";
                    break;
                case "fcfs":
                    this.alg = "fcfs";
                    this.setQuantum(500000);
                    break;
                case "priority":
                    this.alg = "priority";
                    break;
                default:
                    return false;
            }
            return true;
        };
        Scheduler.prototype.contextSwitch = function () {
            //no need to do anything if ready queue is isEmpty
            if (!_ProcessManager.ready.isEmpty()) {
                //if current process isnt done running, add it to the back of the queue
                if (_ProcessManager.running.State !== "terminated") {
                    _ProcessManager.running.State = "ready";
                    console.log("Enqueuing Process " + _ProcessManager.running.Pid);
                    _ProcessManager.ready.enqueue(_ProcessManager.running);
                }
                //get next process and run it
                _ProcessManager.running = _ProcessManager.ready.dequeue();
                _CPU.setCPU(_ProcessManager.running);
                console.log("Switching to process " + _ProcessManager.running.Pid);
                if (_CPU.isExecuting) {
                    this.schedule();
                }
            }
            else {
                console.log("done scheduling for now");
                this.schedule();
            }
        };
        Scheduler.prototype.roundRobin = function () {
            //loading a new process in (could  be after a context switch?)
            if (_ProcessManager.running == null) {
                //to do for proj 4:
                //add disk driver stuff here
                //load in new program from ready queue
                if (!_ProcessManager.isEmpty) {
                    //lets see if this will work
                    _ProcessManager.run();
                }
            }
            else { //currently running a process
                console.log("Round Robin cycle " + this.rrCounter); //log current cycle
                //check if we have reached the end of our quantum cycle
                if (this.rrCounter >= this.quantum && _CPU.isExecuting) {
                    //big if so... time for a context switch
                    console.log("Performing Context Switch");
                    //to do for proj 4:
                    //add disk driver stuff here
                    this.rrCounter = 0;
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH, ["idk"]));
                }
                else { //otherwise we increment counter
                    this.rrCounter++;
                    if (_CPU.isExecuting) {
                        _CPU.cycle(); //call cpu cycle
                        console.log("cpu cycle " + _ProcessManager.running.Pid + " ran.");
                        TSOS.Control.hostUpdateCPU(); //update cpu display
                        TSOS.Control.hostUpdateReadyQueue(); //update ready queue display
                        _ProcessManager.trackStats(); //increment wait time / turn around time as needed
                    }
                    //maybe add calling cpu cycle if executing??
                }
            }
        };
        //to do for project 4
        Scheduler.prototype.priority = function () {
        };
        Scheduler.prototype.setQuantum = function (q) {
            this.quantum = q;
        };
        return Scheduler;
    }());
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
