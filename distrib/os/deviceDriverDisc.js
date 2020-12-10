var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    var DeviceDriverDisc = /** @class */ (function (_super) {
        __extends(DeviceDriverDisc, _super);
        function DeviceDriverDisc() {
            // Override the base method pointers.
            var _this = 
            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            _super.call(this) || this;
            _this.driverEntry = _this.krnDiscDriverEntry;
            return _this;
            //  this.isr = this.krnKbdDispatchKeyPress; //idk what this is yet
        }
        DeviceDriverDisc.prototype.krnDiscDriverEntry = function () {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        };
        DeviceDriverDisc.prototype.krnDsDispatchKeyPress = function (params) {
            var command = params[0];
            var fileName = params[1];
            var fileData = params[2];
            if (command == "format") {
                _Disc.format();
            }
            else {
                if (_Disc.isFormatted == true) {
                    switch (command) {
                        case "create":
                            break;
                        case "read":
                            break;
                        case "write":
                            break;
                        case "delete":
                            break;
                        case "ls":
                            break;
                    }
                }
            }
        };
        DeviceDriverDisc.prototype.create = function (fn) {
        };
        DeviceDriverDisc.prototype.read = function (fn) {
        };
        DeviceDriverDisc.prototype.write = function (fn, data) {
        };
        DeviceDriverDisc.prototype.list = function () {
        };
        return DeviceDriverDisc;
    }(TSOS.DeviceDriver));
    TSOS.DeviceDriverDisc = DeviceDriverDisc;
})(TSOS || (TSOS = {}));
