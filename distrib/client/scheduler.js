var TSOS;
(function (TSOS) {
    var Scheduler = /** @class */ (function () {
        function Scheduler() {
            this.quantum = _DefaultQuantum;
            this.rrCounter = 0;
            this.alg = "ROUND_ROBIN";
        }
        //the eyes of the scheduler are always watching and waiting
        Scheduler.prototype.schedulerEyes = function () {
            if (!_ProcessManager.ready.isEmpty()) {
            }
        };
        Scheduler.prototype.setAlg = function (a) {
            switch (a) {
                case "ROUND_ROBIN":
                    this.alg = "ROUND_ROBIN";
                    break;
                case "FCFS":
                    this.alg = "FCFS";
                    this.setQuantum(500000);
                    break;
                case "PRIORITY":
                    this.alg = "PRIORITY";
                    break;
                default:
                    return false;
            }
            return true;
        };
        Scheduler.prototype.roundRobin = function () {
        };
        Scheduler.prototype.fcfs = function () {
        };
        Scheduler.prototype.setQuantum = function (q) {
            this.quantum = q;
        };
        return Scheduler;
    }());
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
