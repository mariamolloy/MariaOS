var TSOS;
(function (TSOS) {
    var scheduler = /** @class */ (function () {
        function scheduler() {
            //to do add cpu, quantum etc
        }
        scheduler.prototype.algorithm = function () {
        };
        scheduler.prototype.roundRobin = function () {
        };
        scheduler.prototype.fcfs = function () {
            this.quantum = 5000;
        };
        return scheduler;
    }());
    TSOS.scheduler = scheduler;
})(TSOS || (TSOS = {}));
