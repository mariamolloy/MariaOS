

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

        public createFile(fn: string): boolean{
            //check for existing file
            if (this.doesFileExist(fn)){
                _StdOut.putText("A file already exists with that name. Please choose a unique name.");
                return false;
            }
        }

        //function to take a string data and convert first to ascii then to hex
        //returns an array of each character in hex
        public toHexASCII(data: string): string[]{
            let hex = [];
            //for each character look at ascii and convert to hex string
            for (let i = 0; i < data.length; i++){
                let hexChc = data.charCodeAt(i).toString(16);
                hex.push(hexChc);
            }
            return hex;
        }

        //function to check if a file with a given file name exists or not already
        public doesFileExist(fn: string): boolean{
            let hex = this.toHexASCII(fn);
            for (let s = 0; s < _Disc.sectors; s++){
                for (let b = 0; b < _Disc.blocks; b++){
                    //first block is MBR and we will ignore it
                    if (s ==0 && b ==0){
                        continue;
                    }
                    var tsb = "0:"+s+":"+b;
                    let fileBlock = JSON.parse(_DiscAccessor.readFrmDisc(tsb));
                    let fileMatch = true;
                    //only look at blocks in use
                    if (fileBlock.avail == "1"){
                        let x = USED_BYTES;
                        for (let j = 0; j < hex.length; j++){
                            if (hex[j] != fileBlock.data[x]){
                                fileMatch = false;
                            }
                            x++;
                        }
                        //what if we reach end of hex array but theres more to the fileblock?
                        if (fileBlock.data[hex.length + USED_BYTES] != "00"){
                            fileMatch = false;
                        }
                        if (fileMatch == true){
                            return fileMatch;
                        }
                    }
                }
            }
            return false;
        }




        public readFile(fn: string): any{

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
                        let fileBlock = JSON.parse(_DiscAccessor.readFrmDisc(tsb));
                        if (fileBlock.avail == 1){

                        }
                    }
                }
            }

        }

        public getSize(tsb): number{
            return this.readFile(tsb).length;
        }


    }
}

