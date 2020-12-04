var TSOS;
(function (TSOS) {
    var Scheduler = /** @class */ (function () {
        function Scheduler() {
            this.quantum = _DefaultQuantum;
            this.rrCounter = 0;
            this.alg = "rr";
        }
        //resets counter
        //called at run and runall
        Scheduler.prototype.init = function () {
            this.rrCounter = 0;
            this.pCounter = 0;
        };
        //Scheduling inspired by PhazonOS
        //schedule function is called every clock tick
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
        //sets scheduling algorithm to input
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
        //context switch!!! switch from one program to another
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
                _CPU.setCPU(_ProcessManager.running); //reset cpu to correct values
                console.log("Switching to process " + _ProcessManager.running.Pid);
                if (_CPU.isExecuting) {
                    this.schedule(); //we r always scheduling
                }
            }
            else {
                console.log("jk no need");
                this.schedule(); //we r always scheduling
            }
        };
        //round robin function
        Scheduler.prototype.roundRobin = function () {
            console.log("Scheduler: Round Robin");
            //loading a new process in
            if (_ProcessManager.running === null || _ProcessManager.running.State === "terminated") {
                //to do for proj 4:
                //add disk driver stuff here
                //load in new program from ready queue
                if (!_ProcessManager.isEmpty) {
                    //lets see if this will work
                    _ProcessManager.run();
                }
            }
            else { //currently running a process
                console.log("Scheduler cycle " + this.rrCounter); //log current cycle
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
                    if (_CPU.isExecuting && !(_ProcessManager.running == null)) {
                        _ProcessManager.trackStats(); //increment wait time / turn around time as needed
                        _CPU.cycle(); //call cpu cycle
                        TSOS.Control.hostUpdateCPU(); //update cpu display
                    }
                }
            }
        };
        //to do for project 4
        Scheduler.prototype.priority = function () {
            console.log("Scheduler: Priority");
            //nothing to do if ready queue is empty
            if (_ProcessManager.ready.getSize() > 0) {
                if (_ProcessManager.running === null || _ProcessManager.running.State === "terminated") {
                    this.pCounter = 0;
                    _ProcessManager.priorityRun();
                }
                else { //currently running a process
                    console.log("Scheduler cycle " + this.pCounter + "; running program " + _ProcessManager.running.Pid + " with priority " + _ProcessManager.running.Priority); //log current cycle
                }
                this.pCounter++;
                if (_CPU.isExecuting && !(_ProcessManager.running == null)) {
                    _ProcessManager.trackStats(); //increment wait time / turn around time as needed
                    _CPU.cycle(); //call cpu cycle
                    TSOS.Control.hostUpdateCPU(); //update cpu display
                }
            }
            else {
                if (_CPU.isExecuting && !(_ProcessManager.running == null)) {
                    _ProcessManager.trackStats(); //increment wait time / turn around time as needed
                    _CPU.cycle(); //call cpu cycle
                    TSOS.Control.hostUpdateCPU(); //update cpu display
                }
            }
        };
        //sets quantum to param
        Scheduler.prototype.setQuantum = function (q) {
            this.quantum = q;
        };
        return Scheduler;
    }());
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
