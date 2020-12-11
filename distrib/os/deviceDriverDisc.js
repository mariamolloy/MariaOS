var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TSOS;
(function (TSOS) {
    //Inspired by and with a special thank you to Kai Wong of KaiOS and Tien Liengtiraphan of TienminatOS, Hall of Fame 2017
    // Extends DeviceDriver
    var DeviceDriverDisc = /** @class */ (function (_super) {
        __extends(DeviceDriverDisc, _super);
        function DeviceDriverDisc() {
            // Override the base method pointers.
            var _this = 
            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            _super.call(this) || this;
            _this.driverEntry = _this.krnDiscDriverEntry;
            _this.isr = _this.krnDsDispatchKeyPress; //idk what this is yet
            return _this;
        }
        DeviceDriverDisc.prototype.krnDiscDriverEntry = function () {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        };
        DeviceDriverDisc.prototype.krnDsDispatchKeyPress = function (params) {
            var command = params[0];
            var fileName = params[1];
            var fileData = params[2];
            if (command == "format") {
                _Disc.format();
            }
            else {
                if (_Disc.isFormatted == true) {
                    switch (command) {
                        case "create":
                            this.createFile(fileName);
                            break;
                        case "read":
                            this.readFile(fileName);
                            break;
                        case "write":
                            this.writeFile(fileName, fileData);
                            break;
                        case "delete":
                            this.deleteFile(fileName);
                            break;
                        case "ls":
                            if (params[1] != null) {
                                this.listFiles(true);
                            }
                            else {
                                this.listFiles(false);
                            }
                            break;
                    }
                }
                else {
                    _StdOut.putText("Uh oh! your disk isn't formatted! Use the \"format\" command to do so");
                }
            }
        };
        DeviceDriverDisc.prototype.createFile = function (fn) {
            //check for existing file with same fn
            if (this.doesFileExist(fn)) {
                _StdOut.putText("A file already exists with that name. Please choose a unique name.");
                return false;
            }
            //look for first free block in first track (which is the directory)
            // (ignore first block which is the master boot record)
            for (var s = 0; s < _Disc.sectors; s++) {
                for (var b = 0; b < _Disc.blocks; b++) {
                    if (s == 0 && b == 0) {
                        //MBR alert lets get outta here
                        continue;
                    }
                    var tsbID = "0:" + s + ":" + b;
                    var fileBlock = JSON.parse(_DiscAccessor.readFrmDisc(tsbID));
                    //obvi we can only write to an available block
                    if (fileBlock.avail == "0") {
                        //now find somewhere to put the file
                        var dbTSB = this.nextFreeBlock();
                        if (dbTSB != null) {
                            var fileDataBlock = JSON.parse(_DiscAccessor.readFrmDisc(dbTSB));
                            fileBlock.avail = "1";
                            fileDataBlock.avail = "1";
                            //clear any data that could be in both blocks
                            fileDataBlock = this.clear(fileDataBlock);
                            fileBlock = this.clear(fileBlock);
                            fileBlock.pointer = dbTSB;
                            //convert fn to hex ASCII and store it
                            var hexData = this.toHexASCII(fn);
                            var date = this.getDate();
                            //set first four directory bytes as the date the file was created
                            for (var i = 0; i < date.length; i++) {
                                fileBlock.data[i] = date[i];
                            }
                            var index = date.length;
                            //add filename to the directory data
                            for (var j = 0; j < hexData.length; j++) {
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
            _StdOut.putText("Disk is full. Please delete files before creating a new one.");
            return false;
        };
        DeviceDriverDisc.prototype.writeFile = function (fn, data) {
            //check if file we are writing to exists
            //bc if it doesnt we dont have to do anything
            if (this.doesFileExist(fn) != false) {
                //get hex but remove the " " first
                var hexData = this.toHexASCII(data.substring(1, data.length - 1));
                //get the file we are adding to
                var fileTSB = this.doesFileExist(fn) + "";
                var fnBlock = JSON.parse(_DiscAccessor.readFrmDisc(fileTSB));
                //now lets look for the file
                var fcTSB = fnBlock.pointer;
                var fileContentBlock = JSON.parse(_DiscAccessor.readFrmDisc(fcTSB));
                //make sure we can allocate enough space for it
                var space = this.allocateFileSpace(hexData, fcTSB);
                if (space) {
                    //we can actually write the data now
                    this.write(fcTSB, hexData);
                    _StdOut.putText("Success! The file has been edited");
                }
                else {
                    _StdOut.putText("There is not sufficient free space on the disk to write this content. sorry");
                    return false;
                }
            }
            else {
                _StdOut.putText("Please enter a valid filename");
                return false;
            }
        };
        //function to write file contents to the disk
        //param : tsb is the first tsb were writing data in
        //param hexTest is the data were adding
        DeviceDriverDisc.prototype.write = function (tsb, hexText) {
            var index = 0;
            var currTsb = tsb;
            var currblock = JSON.parse(_DiscAccessor.readFrmDisc(currTsb));
            currblock = this.clear(currblock);
            for (var i = 0; i < hexText.length; i++) {
                currblock.data[index] = hexText[i];
                index++;
                if (index == 60) {
                    //now we go to next block
                    _DiscAccessor.writeToDisc(currTsb, JSON.stringify(currblock));
                    currTsb = currblock.pointer;
                    currblock = JSON.parse(_DiscAccessor.readFrmDisc(currTsb));
                    index = 0;
                }
            }
            this.deleteFile(currblock.pointer);
            currblock.pointer = "0:0:0";
            _DiscAccessor.writeToDisc(currTsb, JSON.stringify(currblock));
        };
        //function to see if we have enough space for the file
        //fileData = a hex array of what we want to add to the disk
        //tsb = the tsb of the first availible block
        DeviceDriverDisc.prototype.allocateFileSpace = function (fileData, tsb) {
            var len = fileData.length; //if > 60 we need to have more than one available data block (see while loop below)
            var dataBTsb = tsb;
            var dataB = JSON.parse(_DiscAccessor.readFrmDisc(dataBTsb));
            while (len > _Disc.blockSize) {
                //if its already pointing to something were good
                if (dataB.pointer != "0:0:0" && dataB.avail == "1") {
                    len = len - _Disc.blockSize;
                    //new data blocks to write to
                    dataBTsb = dataB.pointer;
                    dataB = JSON.parse(_DiscAccessor.readFrmDisc(dataBTsb));
                }
                else {
                    //we must allocate more blocks for this file
                    dataB.avail = "1";
                    var blocksNeeded = Math.ceil(len / _Disc.blockSize);
                    var freeBlocks = this.nextFreeBlocks(blocksNeeded);
                    if (freeBlocks != null) {
                        for (var x = 0; x < freeBlocks.length; x++) {
                            dataB.pointer = freeBlocks[x];
                            dataB.avail = "1";
                            _DiscAccessor.writeToDisc(dataBTsb, JSON.stringify(dataB));
                            dataBTsb = freeBlocks[x];
                            dataB = JSON.stringify(_DiscAccessor.readFrmDisc(dataBTsb));
                        }
                        dataB.avail = "1";
                        _DiscAccessor.writeToDisc(dataBTsb, JSON.stringify(dataB));
                        return true;
                    }
                    else {
                        dataB.avail = "0";
                        _StdOut.putText("Error: not enough free space on disk to allocate to this file");
                        return false;
                    }
                }
            }
            _DiscAccessor.writeToDisc(dataBTsb, JSON.stringify(dataB));
            return true;
        };
        //function to find the next free data block in data structure (2nd and 3rd track)
        DeviceDriverDisc.prototype.nextFreeBlock = function () {
            for (var t = 1; t < _Disc.tracks; t++) {
                for (var s = 0; s < _Disc.sectors; s++) {
                    for (var b = 0; b < _Disc.blocks; b++) {
                        var tsbID = t + ":" + s + ":" + b;
                        var fileDataBlock = JSON.parse(_DiscAccessor.readFrmDisc(tsbID));
                        if (fileDataBlock.avail == "0") {
                            return tsbID;
                        }
                    }
                }
            }
            _StdOut.putText("ERROR: DISK IS FULL. There are no available blocks to store files.");
            return null;
        };
        //function to find a selected amount of free blocks
        //param : num the number of blocks we need to find
        DeviceDriverDisc.prototype.nextFreeBlocks = function (num) {
            var blocks = [];
            for (var t = 1; t < _Disc.tracks; t++) {
                for (var s = 0; s < _Disc.sectors; s++) {
                    for (var b = 0; b < _Disc.blocks; b++) {
                        var tsbID = t + ":" + s + ":" + b;
                        var fileDataBlock = JSON.parse(_DiscAccessor.readFrmDisc(tsbID));
                        if (fileDataBlock.avail == "0") {
                            blocks.push(tsbID);
                            num--;
                        }
                        if (num == 0) {
                            return blocks;
                        }
                    }
                }
            }
            if (num != 0) {
                _StdOut.putText("ERROR: DISK IS FULL. There aren't enougj available blocks to store files.");
                return null;
            }
        };
        //function to take a string data and convert first to ascii then to hex
        //returns an array of each character in hex
        DeviceDriverDisc.prototype.toHexASCII = function (data) {
            var hex = [];
            //for each character look at ascii and convert to hex string
            for (var i = 0; i < data.length; i++) {
                var hexChc = data.charCodeAt(i).toString(16);
                hex.push(hexChc);
            }
            return hex;
        };
        //function to check if a file with a given file name exists or not already
        DeviceDriverDisc.prototype.doesFileExist = function (fn) {
            var hex = this.toHexASCII(fn);
            for (var s = 0; s < _Disc.sectors; s++) {
                for (var b = 0; b < _Disc.blocks; b++) {
                    //first block is MBR and we will ignore it
                    if (s == 0 && b == 0) {
                        continue;
                    }
                    var tsbID = "0:" + s + ":" + b;
                    var fileBlock = JSON.parse(_DiscAccessor.readFrmDisc(tsbID));
                    var fileMatch = true;
                    //only look at blocks in use
                    if (fileBlock.avail == "1") {
                        var x = USED_BYTES;
                        for (var j = 0; j < hex.length; j++) {
                            if (hex[j] != fileBlock.data[x]) {
                                fileMatch = false;
                            }
                            x++;
                        }
                        //what if we reach end of hex array but theres more to the fileblock?
                        if (fileBlock.data[hex.length + USED_BYTES] != "00") {
                            fileMatch = false;
                        }
                        //file already exists
                        if (fileMatch == true) {
                            return tsbID;
                        }
                    }
                }
            }
            return false;
        };
        //read the data of a file given its name
        DeviceDriverDisc.prototype.readFile = function (fn) {
            //check if file we are reading exists
            //bc if it doesnt we dont have to do anything
            if (this.doesFileExist(fn) != false) {
                //get the file we are reading
                var dirFileTSB = this.doesFileExist(fn) + "";
                var directoryBlock = JSON.parse(_DiscAccessor.readFrmDisc(dirFileTSB));
                //now lets look for the file
                var fileContentTSB = directoryBlock.pointer;
                var hexData = this.readFileData(fileContentTSB);
                //now lets make this legible
                var index = 0;
                var fileContent = [];
                while (hexData[index] != "00") {
                    fileContent.push(String.fromCharCode(parseInt(hexData[index], 16)));
                    index++;
                }
                //print out what we just read
                for (var j = 0; j < fileContent.length; j++) {
                    //_StdOut.advanceLine();
                    _StdOut.putText(fileContent[j] + "");
                }
            }
            else {
                _StdOut.putText("Please provide a valid <filename>");
                return false;
            }
        };
        //recursive read... does this work?
        //read the hex data of a file given its starting block's tsb
        DeviceDriverDisc.prototype.readFileData = function (tsb) {
            var block = JSON.parse(_DiscAccessor.readFrmDisc(tsb));
            var content = [];
            for (var i = 0; i < block.data.length; i++) {
                content.push(block.data[i]);
            }
            if (block.pointer != "0:0:0") {
                this.readFileData(block.pointer);
            }
            else {
                return content;
            }
        };
        //deletes a file
        DeviceDriverDisc.prototype.deleteFile = function (fn) {
            //check the file we wanna delete exists
            if (this.doesFileExist(fn) != false) {
                var tsbToDelete = this.doesFileExist(fn) + "";
                var dirBlockToDelete = JSON.parse(_DiscAccessor.readFrmDisc(tsbToDelete));
                var fileTSBToDelete = dirBlockToDelete.pointer;
                //delete the file contents
                this.delete(fileTSBToDelete);
                //delete the file directory
                dirBlockToDelete = this.clear(dirBlockToDelete);
                dirBlockToDelete.pointer = "0:0:0";
                dirBlockToDelete.avail = "0";
                _DiscAccessor.writeToDisc(tsbToDelete, JSON.stringify(dirBlockToDelete));
                _StdOut.putText("Success! the file has been deleted");
            }
        };
        //recursive delete file function
        DeviceDriverDisc.prototype.delete = function (tsb) {
            var current = JSON.parse(_DiscAccessor.readFrmDisc(tsb));
            //if its pointing to another block go delete that block
            if (current.pointer != "0:0:0") {
                this.delete(current.pointer);
            }
            else {
                for (var i = 0; i < _Disc.blockSize; i++) {
                    current.data[i] = "00";
                }
                //current.data = this.clear(current);
                current.avail = "0";
                current.pointer = "0:0:0";
                _DiscAccessor.writeToDisc(tsb, JSON.stringify(current));
            }
        };
        //prints the files stored on our disk
        //if l == true then we have entered command line mode and it will print secret files too
        DeviceDriverDisc.prototype.listFiles = function (l) {
            _StdOut.putText("Files in your disk: ");
            _StdOut.advanceLine();
            var files = [];
            //go through Sectors and blocks but dont look in the MBR
            for (var s = 0; s < _Disc.sectors; s++) {
                for (var b = 0; b < _Disc.blocks; b++) {
                    if (s == 0 && b == 0) { //we found the MBR. ignore it
                        continue;
                    }
                    var tsbID = "0:" + s + ":" + b;
                    var fileBlock = JSON.parse(_DiscAccessor.readFrmDisc(tsbID));
                    //theres something here
                    if (fileBlock.avail == "1") {
                        var size = this.getSize(tsbID);
                        var metadata = {
                            data: fileBlock.data,
                            size: size
                        };
                        //add it to our array of files
                        files.push(metadata);
                    }
                }
            }
            //now we have to convert all the hex data to english
            for (var i = 0; i < files.length; i++) {
                var name_1 = [];
                var index = USED_BYTES;
                while (files[i]['data'][index] != "00") {
                    name_1.push(String.fromCharCode(parseInt(files[i]['data'][index], 16)));
                    index++;
                }
                files[i]['name'] = name_1.join("");
                files[i]['day'] = parseInt(files[i]['data'][0], 16);
                files[i]['month'] = parseInt(files[i]['data'][1], 16);
                files[i]['year'] = parseInt((files[i]['data'][2] + "" + files[i]['data'][3]), 16) + "";
            }
            if (l == true) {
                for (var i = 0; i < files.length; i++) {
                    _StdOut.putText(files[i]['name'] + " created on " + files[i]['month'] + " " + files[i]['day'] + " " +
                        files[i]['year'] + " with a size of " + files[i]['size'] + " bytes ");
                    _StdOut.advanceLine();
                }
            }
            else {
                for (var i = 0; i < files.length; i++) {
                    //dont print secret files!
                    if (files[i]['name'].substr(0, 1) != ".") {
                        _StdOut.putText(files[i]['name']);
                        _StdOut.advanceLine();
                    }
                }
            }
        };
        //returns the length of a file given its starting track sector and block
        DeviceDriverDisc.prototype.getSize = function (tsb) {
            if (this.readFileData(tsb) != null) {
                return this.readFileData(tsb).length;
            }
            return 0;
        };
        //resets a block's data to 00000.. and returns the block
        DeviceDriverDisc.prototype.clear = function (block) {
            for (var i = 0; i < _Disc.blockSize; i++) {
                block.data[i] = "00";
            }
            return block;
        };
        //function to get todays day into hex in an array we can easily put onto the disk
        DeviceDriverDisc.prototype.getDate = function () {
            var todaysDate = new Array(USED_BYTES);
            var today = new Date();
            var day = (today.getDate()).toString(16);
            if (day.length == 1) {
                day = "0" + day;
            }
            todaysDate[0] = day;
            var month = (today.getMonth() + 1).toString(16);
            if (month.length == 1) {
                month = "0" + month;
            }
            todaysDate[1] = month;
            var year = (today.getFullYear().toString(16));
            todaysDate[2] = (year.substring(0, 2));
            todaysDate[3] = (year.substring(2));
            return todaysDate;
        };
        return DeviceDriverDisc;
    }(TSOS.DeviceDriver));
    TSOS.DeviceDriverDisc = DeviceDriverDisc;
})(TSOS || (TSOS = {}));
