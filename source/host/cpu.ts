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
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false) {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }

        //inspired and assisted by piano + coding god KaiOS
        public cycle(): void {

            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.

            //fetch and decode
            var opCode: string = _MemoryAccessor.read(this.PC);
            //for testing
            //_StdOut.putText(opCode);

            //execute
            _Kernel.krnTrace('CPU cycle: executing' + opCode);

            switch(opCode){
              case "A9":  //load the accumulator with a constant
                this.Acc = parseInt(_MemoryAccessor.read(this.PC+1), 16);
                this.PC = this.PC + 2;
                break;
              case "AD":  //Load the accumulator from memory
                //bc of little-endian we have to get the next 2 hex bytes and swap them
                var lilEndian = _MemoryAccessor.read(this.PC + 1);
                lilEndian = _MemoryAccessor.read(this.PC + 2) + lilEndian;
                //get the get the content of our lilEndian address and store it in the accumulator
                var addy = parseInt(lilEndian, 16);
                this.Acc = parseInt(_MemoryAccessor.read(addy), 16);
                this.PC = this.PC + 3;
                break;
              case "8D":  //Store the accumulator in memory

                break;
              case "6D": //Add with carry:  Adds contents of an address to the contents of the accumulator and keeps the result in the accumulator
                break;
              case "A2": //Load the X register with a constant
                this.Xreg = parseInt(_MemoryAccessor.read(this.PC+1), 16);
                this.PC = this.PC + 2;
                break;
              case "AE": //Load the X register from memory
                break;
              case "A0":  //Load the Y register with a constant
                this.Yreg = parseInt(_MemoryAccessor.read(this.PC+1), 16);
                this.PC = this.PC + 2;
                break;
              case "AC":  //Load the Y register from memory
                break;
              case "EA":  //No Operation
                this.PC++;
                break;
              case "00":  //Break (which is really a system call)
                this.isExecuting = false;
                this.PC++;
                break;
              case "EC": //Compare a byte in memory to the X reg, Sets the Z (zero) flag if equal
                break;
              case "D0":  //Branch n bytes if Z flag = 0
                break;
              case "EE":  //Increment the value of a byte
                break;
              case "FF":  //System Call: #$01 in X reg = print the integer stored in the Y register. #$02 in X reg = print the 00-terminated string stored at the address in the Y register.
                break;
              default: //terminates single process
                this.isExecuting = false;
                _StdOut.putText("hmm i don't think thats an op code honey!")
            }
        }



    }
}
