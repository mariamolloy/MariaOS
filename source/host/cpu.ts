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

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
        }

  //might have to do fetch and decode separately bc of clock cycles

        public fetchNDecode(){
          //fetch
          var prog = _MemoryManager.readingTime(this.PC, this.PC+1,); //figure out how to get correct pcb from load);

          //to do: decode
          //if string starts w an op code that doesnt require more data.. then u can return String
          //else if string is an op code that requires a certain amt of data then read that data
          //and save as vars so we can use it when we exxecute

        }
          public execute(opCode){
          var opCode = opCode.toUpperCase();
          //execute
          switch(opCode){
            case "A9": { //load the accumulator with a constant
              //do i have to use mmu? or can i use ma
              this.Acc = parseInt(_MemoryAccessor.read(this.PC+1), 16);
              this.PC = this.PC + 2;
              break;
            }
            case "AD": { //Load the accumulator from memory
              this.Acc = 1;
              break;
            }
            case "8D": { //Store the accumulator in memory
              break;
            }
            case "6D": { //Add with carry:  Adds contents of an address to the contents of the accumulator and keeps the result in the accumulator
              break;
            }
            case "A2": { //Load the X register with a constant
              this.Xreg = parseInt(_MemoryAccessor.read(this.PC+1), 16);
              this.PC = this.PC + 2;
              break;
            }
            case "AE": { //Load the X register from memory
              break;
            }
            case "A0": { //Load the Y register with a constant
              this.Yreg = parseInt(_MemoryAccessor.read(this.PC+1), 16);
              this.PC = this.PC + 2;
              break;
            }
            case "AC": { //Load the Y register from memory
              break;
            }
            case "EA": { //No Operation
              this.PC++;
              break;
            }
            case "00": { //Break (which is really a system call)
              break;
            }
            case "EC": { //Compare a byte in memory to the X reg, Sets the Z (zero) flag if equal
              break;
            }
            case "D0": { //Branch n bytes if Z flag = 0
              break;
            }
            case "EE": { //Increment the value of a byte
              break;
            }
            case "FF": { //System Call: #$01 in X reg = print the integer stored in the Y register. #$02 in X reg = print the 00-terminated string stored at the address in the Y register.
              break;
            }
          }
        }
    }
}
