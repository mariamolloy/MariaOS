/* ------------
     CPU.ts

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

module TSOS {

    export class Cpu {

        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public IR: string = "",
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false) {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.IR = "--";
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }

        //inspired by piano + coding god KaiOS
        public cycle(): void {
          //check if executing fetch decode execute, update state, update accounts pc counter is > than limit then set pc back to 0

            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.

            //fetch and decode
            var opCode: string = _MemoryAccessor.read(this.PC);
            //for testing
            //_StdOut.putText(opCode);

            //execute
            _Kernel.krnTrace('CPU cycle: executing' + opCode);
            var ir = opCode;
            this.IR = opCode;
            _ProcessManager.allPcbs[_ProcessManager.idCounter-1].Pid = ir;
            switch(opCode){
              case "A9":  //load the accumulator with a constant
                this.Acc = parseInt(_MemoryAccessor.read(this.PC+1), 16);
                this.PC = this.PC + 2;
                break;
              case "AD":  //Load the accumulator from memory
                this.Acc = parseInt(_MemoryAccessor.read(this.lilEndianTranslator()), 16);
                this.PC = this.PC + 3;
                break;
              case "8D":  //Store the accumulator in memory
                //save contents of accumulator
                var accStr = this.Acc.toString(16);
                //save it in memory at specified location
                _MemoryAccessor.write(this.lilEndianTranslator(), accStr);
                this.PC = this.PC + 3;
                break;
              case "6D": //Add with carry:  Adds contents of an address to the contents of the accumulator and keeps the result in the accumulator
                //get value stored at address in memory
                var addend = parseInt(_MemoryAccessor.read(this.lilEndianTranslator()),16);
                //add to accumulator
                this.Acc = this.Acc + addend;
                this.PC = this.PC + 3;
                break;
              case "A2": //Load the X register with a constant
                this.Xreg = parseInt(_MemoryAccessor.read(this.PC+1), 16);
                this.PC = this.PC + 2;
                break;
              case "AE": //Load the X register from memory
                //read content from memory address specified into xreg
                this.Xreg = parseInt(_MemoryAccessor.read(this.lilEndianTranslator()), 16);
                this.PC = this.PC + 3;
                break;
              case "A0":  //Load the Y register with a constant
                this.Yreg = parseInt(_MemoryAccessor.read(this.PC+1), 16);
                this.PC = this.PC + 2;
                break;
              case "AC":  //Load the Y register from memory
                this.Yreg = parseInt(_MemoryAccessor.read(this.lilEndianTranslator()), 16);
                this.PC = this.PC + 3;
                break;
              case "EA":  //No Operation do nothing lol
                this.PC++;
                break;
              case "00":  //Break (which is really a system call)
                this.isExecuting = false;
                
                break;
              case "EC": //Compare a byte in memory to the X reg, Sets the Z (zero) flag if equal
                var bite = parseInt(_MemoryAccessor.read(this.lilEndianTranslator()), 16);
                if (bite == this.Xreg){
                  this.Zflag = 1;
                } else {
                  this.Zflag = 0;
                }
                this.PC = this.PC + 3;
                break;
              case "D0":  //Branch n bytes if Z flag = 0
                if (this.Zflag == 0){
                  //branch to amt specified in next byte but if its > 255, then wrap around back to start
                  var amt = parseInt(_MemoryAccessor.read(this.PC + 1), 16);
                  var loc = amt + (this.PC + 2);
                  if (loc < 256){
                    this.PC = loc;
                  }
                  else {
                    var diff = loc - 256;
                    this.PC = diff;
                  }
                }else { //if z != 0 then we just skip and move on to the next op code
                  this.PC=this.PC + 2;
                }
                break;
              case "EE":  //Increment the value of a byte
                var bite = parseInt(_MemoryAccessor.read(this.lilEndianTranslator()), 16);
                bite++;
                var bight = bite.toString(16);
                _MemoryAccessor.write(this.lilEndianTranslator(), bight);
                this.PC = this.PC + 3;
                break;
              case "FF":  //System Call: #$01 in X reg = print the integer stored in the Y register. #$02 in X reg = print the 00-terminated string stored at the address in the Y register.
                //check if x reg is 1 or 2
                //print y reg or print string at address in y reg, respectively
                if (this.Xreg == 1){
                  _StdOut.putText("" + this.Yreg);
                } else if (this.Xreg == 2){
                  var addy = this.Yreg;
                  var print = "";
                  while (_MemoryAccessor.read(addy) != "00"){
                  //  var data = _MemoryAccessor.read(addy);
                     var decimal = parseInt(_MemoryAccessor.read(addy), 16);
                     var letter = String.fromCharCode(decimal);
                     print += letter;
                     addy++;
                  }
                  _StdOut.putText(print);
                }
                this.PC++;
                break;
              default: //terminates single process
                this.isExecuting = false;
                _StdOut.putText("sorry ur op code isnt valid :()");
            }
        }

      //method to get next two bytes from memory and swap them
        private lilEndianTranslator(): number {
          var memAdd = _MemoryAccessor.read(this.PC + 1);
          memAdd = _MemoryAccessor.read(this.PC + 2) + memAdd;
          var addy = parseInt(memAdd, 16);
          return addy;
        }

    }
}
