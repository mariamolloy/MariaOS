

module TSOS {
    //Inspired by and with a special thank you to Kai Wong of KaiOS and Tien Liengtiraphan of TienminatOS, Hall of Fame 2017

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
            //check for existing file with same fn
            if (this.doesFileExist(fn)){
                _StdOut.putText("A file already exists with that name. Please choose a unique name.");
                return false;
            }
            //look for first free block in first track (which is the directory)
            // (ignore first block which is the master boot record)
            for (let s = 0; s < _Disc.sectors; s++){
                for (let b = 0; b < _Disc.blocks; b++){
                    if(s == 0 && b == 0){
                        //MBR alert lets get outta here
                        continue;
                    }
                    let tsbID = "0:"+ s + ":" + b;
                    let fileBlock = JSON.parse(_DiscAccessor.readFrmDisc(tsbID));
                    //obvi we can only write to an available block
                    if (fileBlock.avail == "0"){
                        //now find somewhere to put the file
                        let dbTSB = this.nextFreeBlock();
                        if (dbTSB != null){
                            let fileDataBlock = JSON.parse(_DiscAccessor.readFrmDisc(dbTSB));
                            fileBlock.avail = "1";
                            fileDataBlock.avail = "1";
                            //clear any data that could be in both blocks
                            fileDataBlock = this.clear(fileDataBlock);
                            fileBlock = this.clear(fileBlock);
                            fileBlock.pointer = dbTSB;
                            //convert fn to hex ASCII and store it
                            let hexData = this.toHexASCII(fn);

                            let date = this.getDate();
                            //set first four directory bytes as the date the file was created
                            for (let i = 0; i < date.length; i++){
                                fileBlock.data[i] = date[i];
                            }
                            let index = date.length;
                            //add filename to the directory data
                            for (let j = 0; j < hexData.length; j++){
                                fileBlock.data[index] = hexData[j];
                                index++;
                            }

                            _DiscAccessor.writeToDisc(tsbID, JSON.stringify(fileBlock));
                            _DiscAccessor.writeToDisc(dbTSB, JSON.stringify(fileDataBlock));
                            _StdOut.putText("Success! You have a new file: " + fn);
                            return true;
                        }

                    }
                }
            }
            //if we get here it means the directory was full and we couldnt create a file
            _StdOut.putText("Disk is full. Please delete files before creating a new one.")
            return false;
        }

        //function to find the next free data block in data structure (2nd and 3rd track)
        public nextFreeBlock() {
            for (let t = 1; t < _Disc.tracks; t++){
                for (let s = 0; s < _Disc.sectors; s++){
                    for (let b = 0; b<_Disc.blocks; b++){
                        let tsbID = t+":"+s+":"+b;
                        let fileDataBlock = JSON.parse(_DiscAccessor.readFrmDisc(tsbID));
                        if (fileDataBlock.avail == "0"){
                            return tsbID;
                        }
                    }
                }
            }
            _StdOut.putText("ERROR: DISK IS FULL. There are no available blocks to store files.")
            return null;
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
                    var tsbID = "0:"+s+":"+b;
                    let fileBlock = JSON.parse(_DiscAccessor.readFrmDisc(tsbID));
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
                        //file already exists
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
                        var tsbID = "0:" + s + ":" + b;
                        let fileBlock = JSON.parse(_DiscAccessor.readFrmDisc(tsbID));
                        if (fileBlock.avail == "1"){

                        }
                    }
                }
            }

        }

        public getSize(tsb): number{
            return this.readFile(tsb).length;
        }

        //resets a block's data to 00000.. and returns the block
        public clear(block){
            for (let i = 0; i < _Disc.blockSize; i++){
                block.data[i] = "00";
            }
            return block;
        }

        //function to get todays day into hex in an array we can easily put onto the disk
        public getDate(){
            let todaysDate: string[];
            let today = new Date();
            let day = (today.getDate()).toString(16);
            if (day.length == 1){
                day = "0" + day;
            }
            todaysDate[0] = day;
            let month = (today.getMonth()+ 1).toString(16);
            if (month.length == 1){
                month = "0" + month;
            }
            todaysDate[1] = month;
            let year = (today.getFullYear().toString(16));
            todaysDate[2] = year.substr(0,2);
            todaysDate[3] = year.substr(2, 2);

            return todaysDate;
        }


    }
}

