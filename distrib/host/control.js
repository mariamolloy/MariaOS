/* ------------
     Control.ts

     Routines for the hardware simulation, NOT for our client OS itself.
     These are static because we are never going to instantiate them, because they represent the hardware.
     In this manner, it's A LITTLE BIT like a hypervisor, in that the Document environment inside a browser
     is the "bare metal" (so to speak) for which we write code that hosts our client OS.
     But that analogy only goes so far, and the lines are blurred, because we are using TypeScript/JavaScript
     in both the host and client environments.

     This (and other host/simulation scripts) is the only place that we should see "web" code, such as
     DOM manipulation and event handling, and so on.  (Index.html is -- obviously -- the only place for markup.)

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
//
// Control Services
//
var TSOS;
(function (TSOS) {
    var Control = /** @class */ (function () {
        function Control() {
        }
        Control.hostInit = function () {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.
            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = document.getElementById('display');
            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");
            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            TSOS.CanvasTextFunctions.enable(_DrawingContext); // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.
            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("taHostLog").value = "";
            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("btnStartOS").focus();
            //create CPU and memory <3__<3
            _CPU = new TSOS.Cpu();
            _CPU.init();
            _Memory = new TSOS.Memory();
            _Memory.init();
            _MemoryAccessor = new TSOS.MemoryAccessor();
            //load in cpu values
            //load in cpu table and memory table w zeroed values
            Control.hostInitCPU();
            Control.hostInitMemory();
            Control.hostInitReadyQueue();
            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
            _Memory = new TSOS.Memory;
            _Memory.init(); //instantiate new memory
        };
        Control.hostLog = function (msg, source) {
            if (source === void 0) { source = "?"; }
            // Note the OS CLOCK.
            var clock = _OSclock;
            // Note the REAL clock in milliseconds since January 1, 1970.
            var now = new Date().getTime();
            // Build the log string.
            var str = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now + " })" + "\n";
            // Update the log console.
            var taLog = document.getElementById("taHostLog");
            taLog.value = str + taLog.value;
            // TODO in the future: Optionally update a log database or some streaming service.
        };
        //
        // Host Events
        //
        Control.hostBtnStartOS_click = function (btn) {
            // Disable the (passed-in) start button...
            btn.disabled = true;
            // .. enable the Halt and Reset buttons ...
            document.getElementById("btnHaltOS").disabled = false;
            document.getElementById("btnReset").disabled = false;
            document.getElementById("btnStartSingleStep").disabled = false;
            // .. set focus on the OS console display ...
            document.getElementById("display").focus();
            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new TSOS.Cpu(); // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init(); //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.
            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(TSOS.Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new TSOS.Kernel();
            _Kernel.krnBootstrap(); // _GLaDOS.afterStartup() will get called in there, if configured.
        };
        //create cpu table and zero it on initialization
        Control.hostInitCPU = function () {
            var cpuTable = document.getElementById('cpuTable');
            //first row is labels
            var row = cpuTable.insertRow(0);
            var cell = row.insertCell();
            cell.innerHTML = "PC";
            cell = row.insertCell();
            cell.innerHTML = "IR";
            cell = row.insertCell();
            cell.innerHTML = "ACC";
            cell = row.insertCell();
            cell.innerHTML = "X";
            cell = row.insertCell();
            cell.innerHTML = "Y";
            cell = row.insertCell();
            cell.innerHTML = "Z";
            //second row is all zeros
            row = cpuTable.insertRow(1);
            cell = row.insertCell();
            cell.innerHTML = "0";
            cell = row.insertCell();
            cell.innerHTML = "00";
            cell = row.insertCell();
            cell.innerHTML = "0";
            cell = row.insertCell();
            cell.innerHTML = "0";
            cell = row.insertCell();
            cell.innerHTML = "0";
            cell = row.insertCell();
            cell.innerHTML = "0";
        };
        //load correct values into cpu table in index
        //this is called in kernel and should update as programs run
        Control.hostUpdateCPU = function () {
            var cpuTable = document.getElementById('cpuTable');
            cpuTable.deleteRow(1);
            var row = cpuTable.insertRow(1);
            var cell = row.insertCell(); //load in PC
            cell.innerHTML = _CPU.PC.toString(10).toUpperCase();
            cell = row.insertCell();
            cell.innerHTML = _CPU.IR.toString().toUpperCase();
            /*    if (_CPU.isExecuting){ //load in IR if were running a program
                  var current = _ProcessManager.idCounter - 1;
                 cell.innerHTML = _ProcessManager.allPcbs[current].IR.toString(16).toUpperCase();
               } else { //else no IR
                 cell.innerHTML = "0";
               } */
            cell = row.insertCell(); //load in Accumulator
            cell.innerHTML = _CPU.Acc.toString(10).toUpperCase();
            cell = row.insertCell(); //load in X register
            cell.innerHTML = _CPU.Xreg.toString(10).toUpperCase();
            cell = row.insertCell(); //load in Y register
            cell.innerHTML = _CPU.Yreg.toString(10).toUpperCase();
            cell = row.insertCell(); //load in Z flag
            cell.innerHTML = _CPU.Zflag.toString(10).toUpperCase();
        };
        Control.hostInitMemory = function () {
            var table = "<tbody>";
            var rowLabel = "0x";
            var rowNum = 0;
            var current = "";
            var index = 0;
            for (var i = 0; i < _TotalMemorySize / 8; i++) {
                table += "<tr>";
                current = rowNum.toString(16);
                while (current.length < 3) {
                    current = "0" + current;
                }
                current = current.toUpperCase();
                table += "<td style=\"font-weight:bold\">" + rowLabel + current + "</td>";
                for (var j = 0; j < 8; j++) {
                    table += "<td> 00 </td>";
                    index++;
                }
                table += "</tr>";
                rowNum = rowNum + 8;
            }
            table += "</tbody>";
            document.getElementById("memoryTable").innerHTML = table;
        };
        Control.hostUpdateMemory = function () {
            var table = "<tbody>";
            var rowLabel = "0x";
            var rowNum = 0;
            var current = "";
            var index = 0;
            for (var i = 0; i < _TotalMemorySize / 8; i++) {
                table += "<tr>";
                current = rowNum.toString(16);
                while (current.length < 3) {
                    current = "0" + current;
                }
                current = current.toUpperCase();
                table += "<td style=\"font-weight:bold\">" + rowLabel + current + "</td>";
                for (var j = 0; j < 8; j++) {
                    table += "<td>" + _MemoryAccessor.read(index) + "</td>";
                    index++;
                }
                table += "</tr>";
                rowNum = rowNum + 8;
            }
            table += "</tbody>";
            document.getElementById("memoryTable").innerHTML = table;
        };
        Control.hostInitReadyQueue = function () {
            var readyTable = document.getElementById('readyQueueTable');
            //first row is labels
            var row = readyTable.insertRow(0);
            var cell = row.insertCell();
            cell.innerHTML = "PID";
            cell = row.insertCell();
            cell.innerHTML = "STATE";
            cell = row.insertCell();
            cell.innerHTML = "PART";
            cell = row.insertCell();
            cell.innerHTML = "BASE";
            cell = row.insertCell();
            cell.innerHTML = "LIMIT";
            cell = row.insertCell();
            cell.innerHTML = "PC";
            cell = row.insertCell();
            cell.innerHTML = "IR";
            cell = row.insertCell();
            cell.innerHTML = "ACC";
            cell = row.insertCell();
            cell.innerHTML = "X";
            cell = row.insertCell();
            cell.innerHTML = "Y";
            cell = row.insertCell();
            cell.innerHTML = "Z";
            //second row is all zeros
            row = readyTable.insertRow(1);
            cell = row.insertCell();
            cell.innerHTML = "--";
            cell = row.insertCell();
            cell.innerHTML = "--";
            cell = row.insertCell();
            cell.innerHTML = "--";
            cell = row.insertCell();
            cell.innerHTML = "--";
            cell = row.insertCell();
            cell.innerHTML = "--";
            cell = row.insertCell();
            cell.innerHTML = "--";
            cell = row.insertCell();
            cell.innerHTML = "--";
            cell = row.insertCell();
            cell.innerHTML = "--";
            cell = row.insertCell();
            cell.innerHTML = "--";
            cell = row.insertCell();
            cell.innerHTML = "--";
            cell = row.insertCell();
            cell.innerHTML = "--";
        };
        Control.hostUpdateReadyQueue = function () {
        };
        Control.hostBtnHaltOS_click = function (btn) {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        };
        Control.hostBtnReset_click = function (btn) {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload(true);
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        };
        Control.hostBtnStartSingleStep_click = function (btn) {
            //starts single stepping/stops single stepping
            _SingleStep = !_SingleStep;
            if (_SingleStep) {
                document.getElementById("btnStep").disabled = false;
                _CPU.isExecuting = false;
            }
            else {
                document.getElementById("btnStep").disabled = true;
                _CPU.isExecuting = true;
            }
        };
        Control.hostBtnStep_click = function (btn) {
            _NextStep = true;
        };
        return Control;
    }());
    TSOS.Control = Control;
})(TSOS || (TSOS = {}));
