var TSOS;
(function (TSOS) {
    var Scheduler = /** @class */ (function () {
        function Scheduler() {
            this.quantum = _DefaultQuantum;
            this.rrCounter = 0;
            this.alg = "rr";
        }
        //main process that runs every cpu cycle
        Scheduler.prototype.schedule = function () {
            //idt we need to do anything if theres nothing in da ready qeueueueue
            if (!_ProcessManager.ready.isEmpty()) {
                switch (this.alg) {
                    case "rr":
                        this.roundRobin();
                        break;
                    case "fcfs":
                        this.setQuantum(500000);
                        this.fcfs();
                        break;
                    case "priority":
                        this.priority();
                        break;
                }
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
            }
        };
        Scheduler.prototype.roundRobin = function () {
            this.rrCounter++;
        };
        //to do for project 4
        Scheduler.prototype.fcfs = function () {
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
