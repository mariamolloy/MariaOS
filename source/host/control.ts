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



            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }

            _Memory = new Memory; //instantiate new memory

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

        public static hostMemInit(): void{
           var table = (<HTMLTableElement>document.getElementById('memoryTable'));

           //go through add rows of 8 bytes each all initialized to zero
           var counter = 0;
           for (var i = 0; i < (_memSize/8); i++){
             var roww = table.insertRow(i);
             var celll = roww.insertCell(0);
             var addy = i*8;
             var label = "0x" + addy.toString(16);
             for(var k=0; k<3-addy.toString(16).length; k++){
                    label += "0";
                }
                label += addy.toString(16).toUpperCase();
                celll.innerHTML = label;
             for (var j = 1; i < 9; j++){
              celll = roww.insertCell(j);
                 celll.innerHTML = "00";
               }
             }
        }

        public static hostMemUpdate(){
          var table = (<HTMLTableElement>document.getElementById('memoryTable'));

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

            //Control.hostMemInit();
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
          if (_CPU.isExecuting){ //load in IR if were running a program
            var current = _ProcessManager.idCounter - 1;
           cell.innerHTML = _ProcessManager.allPcbs[current].IR.toString(16).toUpperCase();
         } else { //else no IR
           cell.innerHTML = "0";
         }

         cell = row.insertCell(); //load in Accumulator
         cell.innerHTML = _CPU.Acc.toString(16).toUpperCase();

         cell = row.insertCell(); //load in X register
         cell.innerHTML = _CPU.Xreg.toString(16).toUpperCase();

         cell = row.insertCell(); //load in Y register
         cell.innerHTML = _CPU.Yreg.toString(16).toUpperCase();

         cell = row.insertCell(); //load in Z flag
         cell.innerHTML = _CPU.Zflag.toString(16).toUpperCase();
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
            _CPU.isExecuting = true;
          }
        }

        public static hostBtnStep_click(btn): void {
          //to do: each time you click button you increase clock tick by 1
        }


    }
}
