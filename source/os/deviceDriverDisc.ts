

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


        public  writeFile(fn: string, data: string): boolean {
            //check if file we are writing to exists
            //bc if it doesnt we dont have to do anything
            if (this.doesFileExist(fn) != false) {
                //get hex but remove the " " first
                let hexData = this.toHexASCII(data.substring(1, data.length - 2));
                //get the file we are adding to
                let fileTSB = this.doesFileExist(fn) + "";
                let fnBlock = JSON.parse(_DiscAccessor.readFrmDisc(fileTSB));
                //now lets look for the file
                let fcTSB = fnBlock.pointer;
                let fileContentBlock = JSON.parse(_DiscAccessor.readFrmDisc(fcTSB));
                //make sure its not too long for the block
                for (let i = 0; i < hexData.length; i++){

                }
                fileContentBlock.data
            }
            return false;
        }

        //function to see if we have enough space for the file
        //fileData = a hex array of what we want to add to the disk
        //tsb = the tsb of the first availible block
        public allocateFileSpace(fileData: string[], tsb: string) {

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
        public doesFileExist(fn: string) {
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
                            return tsbID;
                        }
                    }
                }
            }
            return false;
        }




        //read the data of a file given its name
        public readFile(fn: string): any{
            //check if file we are reading exists
            //bc if it doesnt we dont have to do anything
            if (this.doesFileExist(fn) != false) {
                //get the file we are reading
                let fileTSB = this.doesFileExist(fn) + "";
                let fnBlock = JSON.parse(_DiscAccessor.readFrmDisc(fileTSB));
                //now lets look for the file
                let fcTSB = fnBlock.pointer;
                return(this.readFileData(fcTSB));
            } else {
                _StdOut.putText("Please provide a valid <filename>");
                return false;
            }

        }

        //read the hex data of a file given its starting block's tsb
        public readFileData(tsb: string): any{

        }


        //deletes a file
        public deleteFile(fn: string): void{
            //check the file we wanna delete exists
            if (this.doesFileExist(fn) != false){
                let tsbToDelete = this.doesFileExist(fn) + "";
                let dirBlockToDelete = JSON.parse(_DiscAccessor.readFrmDisc(tsbToDelete));
                let fileTSBToDelete = dirBlockToDelete.pointer;
                //delete the file contents
                this.delete(fileTSBToDelete);
                //delete the file directory
                dirBlockToDelete = this.clear(dirBlockToDelete);
                dirBlockToDelete.pointer = "0:0:0";
                dirBlockToDelete.avail = "0";
                _DiscAccessor.writeToDisc(tsbToDelete, JSON.stringify(dirBlockToDelete));

                _StdOut.putText("Success! the file has been deleted");
            }else {
                _StdOut.putText("Error: File not found. Please input a valid <filename>");
            }
        }

        //recursive delete file function
        public delete(tsb){
            let current = JSON.parse(_DiscAccessor.readFrmDisc(tsb));
            //if its pointing to another block go delete that block
            if(current.pointer != "0:0:0"){
                this.delete(current.pointer);
            } else {
                for (let i = 0; i < _Disc.blockSize; i++){
                    current.data[i] = "00";
                }
                //current.data = this.clear(current);
                current.avail = "0";
                current.pointer = "0:0:0";
                _DiscAccessor.writeToDisc(tsb, JSON.stringify(current));
            }
        }

        //prints the files stored on our disk
        //if l == true then we have entered command line mode and it will print secret files too
        public listFiles(l: boolean){
            _StdOut.putText("Files in your disk: ")
            _StdOut.advanceLine();
            let files = [];
                //go through Sectors and blocks but dont look in the MBR
                for (var s = 0; s < _Disc.sectors; s ++){
                    for (var b = 0; b < _Disc.blocks; b++){
                        if (s == 0 && b ==0){ //we found the MBR. ignore it
                            continue;
                        }
                        var tsbID = "0:" + s + ":" + b;
                        let fileBlock = JSON.parse(_DiscAccessor.readFrmDisc(tsbID));
                        //theres something here
                        if (fileBlock.avail == "1"){
                            let size = this.getSize(tsbID);
                            let metadata = {
                                data: fileBlock.data,
                                size: 5
                            }
                            //add it to our array of files
                            files.push(metadata);
                        }
                    }
                }
                //now we have to convert all the hex data to english
                for (let i = 0 ; i < files.length; i++){
                    let name = [];
                    let index = USED_BYTES;
                    while (files[i]['data'][index] != "00"){
                        name.push(String.fromCharCode(parseInt(files[i]['data'][index], 16)));
                        index++;
                    }
                    files[i]['name']= name.join("");
                    files[i]['day'] = parseInt(files[i]['data'][0], 16);
                    files[i]['month'] = parseInt(files[i]['data'][1], 16);
                    files[i]['year'] = parseInt((files[i]['data'][2] + "" + files[i]['data'][3]), 16) +"";
                }
            if (l == true){
                for (let i = 0; i < files.length; i++){
                    _StdOut.putText(files[i]['name'] + " created on " + files[i]['month'] + " " + files[i]['day'] + " " +
                    files[i]['year']+ " with a size of " + files[i]['size'] + " bytes ");
                    _StdOut.advanceLine();
                }
            } else {
               for (let i = 0; i < files.length; i++){
                   //dont print secret files!
                   if (files[i]['name'].substr(0, 1) != "."){
                       _StdOut.putText(files[i]['name'] );
                       _StdOut.advanceLine();
                   }
               }
            }

        }

        //returns the length of a file given its starting track sector and block
        public getSize(tsb): number{
         //   return this.readFileData(tsb).length;
            return 0;
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
            let todaysDate: string[] = new Array(USED_BYTES);
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
            todaysDate[2] = (year.substring(0,2));
            todaysDate[3]= (year.substring(2));

            return todaysDate;
        }


    }
}

