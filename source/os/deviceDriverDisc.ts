

module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverDisc extends DeviceDriver {

        constructor() {
            // Override the base method pointers.

            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            super();
            this.driverEntry = this.krnDiscDriverEntry;
             this.isr = this.krnDsDispatchKeyPress; //idk what this is yet
        }

        public krnDiscDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?


        }


        public krnDsDispatchKeyPress(params){
            let command: string = params[0];
            let fileName: string = params[1];
            let fileData: string = params[2];

            if (command == "format"){
                _Disc.format();
            } else {
                if (_Disc.isFormatted == true){
                    switch(command){
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

                } else {
                    _StdOut.putText("Uh oh! your disk isn't formatted! Use the \"format\" command to do so");
                }
            }
        }


        public createFile(fn: string){

        }

        public doesFileExist(fn: string): boolean{
            return false;
        }

        public readFile(fn: string){

        }

        public  writeFile(fn: string, data: string){

        }

        public deleteFile(fn: string): void{

        }

        public listFiles(l: boolean): void{
            let files: string[];
            if (l == true){
                //to do: -l
            }else {
                //go through Sectors and blocks but dont look in the MBR
                for (var s = 0; s < _Disc.sectors; s ++){
                    for (var b = 0; b < _Disc.blocks; b++){
                        if (s == 0 && b ==0){ //we found the MBR. ignore it
                            continue;
                        }
                        var tsb = "0:" + s + ":" + b;
                        let fileBlock = JSON.parse(_Disc.storage.getItem(tsb));
                    }
                }
            }

        }


    }
}

