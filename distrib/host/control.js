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
            // Create the disk
            _Disc = new TSOS.Disc();
            _Disc.initFormat();
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
            Control.hostInitDisk();
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
            if (_CPU.isExecuting) {
                var row_1 = cpuTable.insertRow(1);
                row_1.style.backgroundColor = "white";
                var cellPC = row_1.insertCell(0); //load in PC
                cellPC.innerHTML = _CPU.PC.toString(16).toUpperCase();
                cellPC.style.color = "lightcoral";
                cellPC.style.fontWeight = "bold";
                var cellIR = row_1.insertCell(1);
                cellIR.innerHTML = _CPU.IR.toString().toUpperCase();
                cellIR.style.color = "lightcoral";
                cellIR.style.fontWeight = "bold";
                var cellACC = row_1.insertCell(2); //load in Accumulator
                cellACC.innerHTML = _CPU.Acc.toString(10).toUpperCase();
                cellACC.style.color = "lightcoral";
                cellACC.style.fontWeight = "bold";
                var cellX = row_1.insertCell(3); //load in X register
                cellX.innerHTML = _CPU.Xreg.toString(10).toUpperCase();
                cellX.style.color = "lightcoral";
                cellX.style.fontWeight = "bold";
                var cellY = row_1.insertCell(4); //load in Y register
                cellY.innerHTML = _CPU.Yreg.toString(10).toUpperCase();
                cellY.style.color = "lightcoral";
                cellY.style.fontWeight = "bold";
                var cellZ = row_1.insertCell(5); //load in Z flag
                cellZ.innerHTML = _CPU.Zflag.toString(10).toUpperCase();
                cellZ.style.color = "lightcoral";
                cellZ.style.fontWeight = "bold";
            }
            else {
                var row = cpuTable.insertRow(1);
                var cell = row.insertCell(); //load in PC
                cell.innerHTML = _CPU.PC.toString(16).toUpperCase();
                cell = row.insertCell();
                cell.innerHTML = _CPU.IR.toString().toUpperCase();
                cell = row.insertCell(); //load in Accumulator
                cell.innerHTML = _CPU.Acc.toString(10).toUpperCase();
                cell = row.insertCell(); //load in X register
                cell.innerHTML = _CPU.Xreg.toString(10).toUpperCase();
                cell = row.insertCell(); //load in Y register
                cell.innerHTML = _CPU.Yreg.toString(10).toUpperCase();
                cell = row.insertCell(); //load in Z flag
                cell.innerHTML = _CPU.Zflag.toString(10).toUpperCase();
            }
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
        //initiaize ready queue: call at start
        Control.hostInitReadyQueue = function () {
            var readyTable = document.getElementById('readyQueueTable');
            //first row is labels
            var row = readyTable.insertRow(0);
            var cell = row.insertCell();
            cell.innerHTML = "PID";
            cell = row.insertCell();
            cell.innerHTML = "PRIORITY";
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
            //second row is empty
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
            cell = row.insertCell();
            cell.innerHTML = "--";
        };
        //call whenever theres something in ready qeueueeueueueue
        Control.hostUpdateReadyQueue = function () {
            var readyTable = document.getElementById('readyQueueTable');
            //see if we are currently running anything
            if (_ProcessManager.running !== null) {
                var size = readyTable.rows.length;
                //delete prev entries in table
                for (var d = size - 1; d > 0; d--) {
                    readyTable.deleteRow(d);
                }
                //first row is the running process
                var row = readyTable.insertRow(1);
                row.style.color = "white";
                var cellPID = row.insertCell(); //load in Pid
                cellPID.innerHTML = _ProcessManager.running.Pid.toString(10).toUpperCase();
                cellPID.style.color = "lightcoral";
                cellPID.style.fontWeight = "bold";
                var cellPri = row.insertCell(); //load in pirority
                cellPri.innerHTML = _ProcessManager.running.Priority.toString().toUpperCase();
                cellPri.style.color = "lightcoral";
                cellPri.style.fontWeight = "bold";
                var cellS = row.insertCell(); //load in state
                cellS.innerHTML = _ProcessManager.running.State.toString().toUpperCase();
                cellS.style.color = "lightcoral";
                cellS.style.fontWeight = "bold";
                var cellPar = row.insertCell(); //load in partition
                cellPar.innerHTML = _ProcessManager.running.Partition.toString(10).toUpperCase();
                cellPar.style.color = "lightcoral";
                cellPar.style.fontWeight = "bold";
                var cellBase = row.insertCell(); //load in base
                cellBase.innerHTML = _ProcessManager.running.Base.toString(10).toUpperCase();
                cellBase.style.color = "lightcoral";
                cellBase.style.fontWeight = "bold";
                var cellLim = row.insertCell(); //load in limit
                cellLim.innerHTML = _ProcessManager.running.Limit.toString(10).toUpperCase();
                cellLim.style.color = "lightcoral";
                cellLim.style.fontWeight = "bold";
                var cellPC = row.insertCell(); //load in PC
                cellPC.innerHTML = _ProcessManager.running.PC.toString(10).toUpperCase();
                cellPC.style.color = "lightcoral";
                cellPC.style.fontWeight = "bold";
                var cellIR = row.insertCell(); //load in IR
                cellIR.innerHTML = _ProcessManager.running.IR.toString().toUpperCase();
                cellIR.style.color = "lightcoral";
                cellIR.style.fontWeight = "bold";
                var cellAcc = row.insertCell(); //load in Accumulator
                cellAcc.innerHTML = _ProcessManager.running.Acc.toString(10).toUpperCase();
                cellAcc.style.color = "lightcoral";
                cellAcc.style.fontWeight = "bold";
                var cellX = row.insertCell(); //load in xreg
                cellX.innerHTML = _ProcessManager.running.Xreg.toString(10).toUpperCase();
                cellX.style.color = "lightcoral";
                cellX.style.fontWeight = "bold";
                var cellY = row.insertCell(); //load in yreg
                cellY.innerHTML = _ProcessManager.running.Yreg.toString(10).toUpperCase();
                cellY.style.color = "lightcoral";
                cellY.style.fontWeight = "bold";
                var cellZ = row.insertCell(); //load in z flag
                cellZ.innerHTML = _ProcessManager.running.Zflag.toString(10).toUpperCase();
                cellZ.style.color = "lightcoral";
                cellZ.style.fontWeight = "bold";
                //go through ready queue and print that (if there)
                for (var i = 0; i < _ProcessManager.ready.getSize(); i++) {
                    var process = _ProcessManager.ready.look(i);
                    var row = readyTable.insertRow(i + 2);
                    var cell = row.insertCell(); //load in Pid
                    cell.innerHTML = process.Pid.toString(10).toUpperCase();
                    var cell = row.insertCell(); //load in priority
                    cell.innerHTML = process.Priority.toString(10).toUpperCase();
                    cell = row.insertCell(); //load in state
                    cell.innerHTML = process.State.toString().toUpperCase();
                    cell = row.insertCell(); //load in partition
                    cell.innerHTML = process.Partition.toString(10).toUpperCase();
                    cell = row.insertCell(); //load in base
                    cell.innerHTML = process.Base.toString(10).toUpperCase();
                    cell = row.insertCell(); //load in limit
                    cell.innerHTML = process.Limit.toString(10).toUpperCase();
                    cell = row.insertCell(); //load in PC
                    cell.innerHTML = process.PC.toString(10).toUpperCase();
                    cell = row.insertCell(); //load in IR
                    cell.innerHTML = process.IR.toString().toUpperCase();
                    cell = row.insertCell(); //load in Accumulator
                    cell.innerHTML = process.Acc.toString(10).toUpperCase();
                    cell = row.insertCell(); //load in xreg
                    cell.innerHTML = process.Xreg.toString(10).toUpperCase();
                    cell = row.insertCell(); //load in yreg
                    cell.innerHTML = process.Yreg.toString(10).toUpperCase();
                    cell = row.insertCell(); //load in z flag
                    cell.innerHTML = process.Zflag.toString(10).toUpperCase();
                }
            }
            else {
                var size = readyTable.rows.length;
                //delete prev entries in table
                for (var d = size - 1; d > 0; d--) {
                    readyTable.deleteRow(d);
                }
                //second row is empty
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
                cell = row.insertCell();
                cell.innerHTML = "--";
            }
        };
        Control.hostInitDisk = function () {
            var table = document.getElementById('diskTable');
            // Remove all rows
            var rows = table.rows.length;
            var rowNumber = 0;
            for (var l = 0; l < _Disc.tracks; l++) {
                for (var m = 0; m < _Disc.sectors; m++) {
                    for (var n = 0; n < _Disc.blocks; n++) {
                        // generate tsbid?????
                        var tsbID = l + ":" + m + ":" + n;
                        var row = table.insertRow(rowNumber);
                        rowNumber++;
                        row.style.backgroundColor = "white";
                        var tsb = row.insertCell(0);
                        tsb.innerHTML = tsbID;
                        tsb.style.color = "lightcoral";
                        var ava = row.insertCell(1);
                        ava.innerHTML = "0";
                        ava.style.color = "lightgreen";
                        var p = row.insertCell(2);
                        p.innerHTML = "0:0:0";
                        p.style.color = "lightgray";
                        var data = row.insertCell(3);
                        data.innerHTML = JSON.parse(sessionStorage.getItem(tsbID)).data.join("").toString();
                        data.style.color = "lightblue";
                    }
                }
            }
        };
        Control.hostUpdateDisk = function () {
            var table = document.getElementById('diskTable');
            // Remove all rows
            var rows = table.rows.length;
            for (var i = 0; i < rows; i++) {
                table.deleteRow(0);
            }
            var rowNumber = 0;
            for (var l = 0; l < _Disc.tracks; l++) {
                for (var m = 0; m < _Disc.sectors; m++) {
                    for (var n = 0; n < _Disc.blocks; n++) {
                        // generate tsbid?????
                        var tsbID = l + ":" + m + ":" + n;
                        var row = table.insertRow(rowNumber);
                        rowNumber++;
                        row.style.backgroundColor = "white";
                        var tsb = row.insertCell(0);
                        tsb.innerHTML = tsbID;
                        tsb.style.color = "lightcoral";
                        var ava = row.insertCell(1);
                        ava.innerHTML = JSON.parse(sessionStorage.getItem(tsbID)).ava;
                        ava.style.color = "lightgreen";
                        var p = row.insertCell(2);
                        var pVal = JSON.parse(sessionStorage.getItem(tsbID)).p;
                        p.innerHTML = pVal;
                        p.style.color = "lightgray";
                        var data = row.insertCell(3);
                        data.innerHTML = JSON.parse(sessionStorage.getItem(tsbID)).data.join("").toString();
                        data.style.color = "lightblue";
                    }
                }
            }
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
