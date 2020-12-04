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
module TSOS {

    export class Control {

        public static hostInit(): void {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.

            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = <HTMLCanvasElement>document.getElementById('display');

            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");

            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            CanvasTextFunctions.enable(_DrawingContext);   // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.

            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("taHostLog")).value="";

            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("btnStartOS")).focus();

            //create CPU and memory <3__<3
              _CPU	=	new	Cpu();
              _CPU.init();
              _Memory	=	new	Memory();
              _Memory.init();
              _MemoryAccessor	=	new	MemoryAccessor();


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

            _Memory = new Memory;
            _Memory.init();//instantiate new memory

        }

        public static hostLog(msg: string, source: string = "?"): void {
            // Note the OS CLOCK.
            var clock: number = _OSclock;

            // Note the REAL clock in milliseconds since January 1, 1970.
            var now: number = new Date().getTime();

            // Build the log string.
            var str: string = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now  + " })"  + "\n";

            // Update the log console.
            var taLog = <HTMLInputElement> document.getElementById("taHostLog");
            taLog.value = str + taLog.value;

            // TODO in the future: Optionally update a log database or some streaming service.
        }



        //
        // Host Events
        //
        public static hostBtnStartOS_click(btn): void {
            // Disable the (passed-in) start button...
            btn.disabled = true;

            // .. enable the Halt and Reset buttons ...
            (<HTMLButtonElement>document.getElementById("btnHaltOS")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnReset")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnStartSingleStep")).disabled = false;

            // .. set focus on the OS console display ...
            document.getElementById("display").focus();

            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new Cpu();  // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init();       //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.


            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new Kernel();
            _Kernel.krnBootstrap();  // _GLaDOS.afterStartup() will get called in there, if configured.

        }

        //create cpu table and zero it on initialization
        public static hostInitCPU(): void {
          var cpuTable = (<HTMLTableElement>document.getElementById('cpuTable'));

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


        }

        //load correct values into cpu table in index
        //this is called in kernel and should update as programs run
       public static hostUpdateCPU(): void {
          var cpuTable = (<HTMLTableElement>document.getElementById('cpuTable'));


          cpuTable.deleteRow(1);
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

       public static hostInitMemory(): void {
         var table = "<tbody>";
         var rowLabel = "0x";
         var rowNum = 0;
         var current = "";
         var index = 0;
         for (var i = 0; i < _TotalMemorySize / 8; i++){
           table += "<tr>";
           current = rowNum.toString(16);
           while (current.length < 3){
             current = "0" + current;
           }
           current = current.toUpperCase();
           table += "<td style=\"font-weight:bold\">" + rowLabel + current + "</td>";
           for (var j = 0; j < 8; j++){
             table += "<td> 00 </td>";
             index++;
           }
           table += "</tr>";
           rowNum = rowNum + 8;
         }
         table += "</tbody>";
         document.getElementById("memoryTable").innerHTML = table;
       }

       public static hostUpdateMemory(): void{
         var table = "<tbody>";
         var rowLabel = "0x";
         var rowNum = 0;
         var current = "";
         var index = 0;
         for (var i = 0; i < _TotalMemorySize / 8; i++){
           table += "<tr>";
           current = rowNum.toString(16);
           while (current.length < 3){
             current = "0" + current;
           }
           current = current.toUpperCase();
           table += "<td style=\"font-weight:bold\">" + rowLabel + current + "</td>";
           for (var j = 0; j < 8; j++){
             table += "<td>" + _MemoryAccessor.read(index) + "</td>";
             index++;
           }
           table += "</tr>";
           rowNum = rowNum + 8;
         }
         table += "</tbody>";
         document.getElementById("memoryTable").innerHTML = table;
       }

       //initiaize ready queue: call at start
       public static hostInitReadyQueue(): void {
         var readyTable = (<HTMLTableElement>document.getElementById('readyQueueTable'));

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
       }

       //call whenever theres something in ready qeueueeueueueue
       public static hostUpdateReadyQueue(): void{
         var readyTable = (<HTMLTableElement>document.getElementById('readyQueueTable'));

         //see if we are currently running anything
         if (_ProcessManager.running !== null){
           var size = readyTable.rows.length;

           //delete prev entries in table
           for (var d = size - 1; d > 0; d--) {
             readyTable.deleteRow(d);
           }

           //first row is the running process
             var row = readyTable.insertRow(1);
             var cell = row.insertCell(); //load in Pid
             cell.innerHTML = _ProcessManager.running.Pid.toString(10).toUpperCase();

             cell = row.insertCell(); //load in pirority
             cell.innerHTML = _ProcessManager.running.Priority.toString().toUpperCase();

             cell = row.insertCell(); //load in state
             cell.innerHTML = _ProcessManager.running.State.toString().toUpperCase();

            cell = row.insertCell(); //load in partition
            cell.innerHTML = _ProcessManager.running.Partition.toString(10).toUpperCase();

            cell = row.insertCell(); //load in base
            cell.innerHTML = _ProcessManager.running.Base.toString(10).toUpperCase();

            cell = row.insertCell(); //load in limit
            cell.innerHTML = _ProcessManager.running.Limit.toString(10).toUpperCase();

            cell = row.insertCell(); //load in PC
            cell.innerHTML = _ProcessManager.running.PC.toString(10).toUpperCase();

            cell = row.insertCell(); //load in IR
            cell.innerHTML = _ProcessManager.running.IR.toString().toUpperCase();

            cell = row.insertCell(); //load in Accumulator
            cell.innerHTML = _ProcessManager.running.Acc.toString(10).toUpperCase();

            cell = row.insertCell(); //load in xreg
            cell.innerHTML = _ProcessManager.running.Xreg.toString(10).toUpperCase();

            cell = row.insertCell(); //load in yreg
            cell.innerHTML = _ProcessManager.running.Yreg.toString(10).toUpperCase();

            cell = row.insertCell(); //load in z flag
            cell.innerHTML = _ProcessManager.running.Zflag.toString(10).toUpperCase();

            //go through ready queue and print that (if there)
             for (var i = 0; i < _ProcessManager.ready.getSize(); i++){
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
          } else {
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
       }



        public static hostBtnHaltOS_click(btn): void {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        }

        public static hostBtnReset_click(btn): void {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload(true);
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        }

        public static hostBtnStartSingleStep_click(btn): void {
          //starts single stepping/stops single stepping
          _SingleStep = !_SingleStep;
          if (_SingleStep){
            (<HTMLButtonElement>document.getElementById("btnStep")).disabled = false;
            _CPU.isExecuting = false;
          }else{
            (<HTMLButtonElement>document.getElementById("btnStep")).disabled = true;
            _CPU.isExecuting = true;
          }
        }

        public static hostBtnStep_click(btn): void {
          _NextStep = true;
        }


    }
}
