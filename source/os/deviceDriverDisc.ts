

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
          //  this.isr = this.krnKbdDispatchKeyPress; //idk what this is yet
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

                }
            }
        }

        public create(fn: string){

        }

        public read(fn: string){

        }

        public  write(fn: string, data: string){

        }

        public list(){

        }
        //create <filename>	—	Create	the	Eile	"ilename	and	display	a	message
        // denoting	success	or	failure.
        // read <filename>	—	Read	and	display	the	contents	of	"ilename	or
        // display	an	error	if	something	went	wrong.
        // write <filename> “data”	—	Write	the	data	inside	the	quotes	to
        // "ilename	and	display	a	message	denoting	success	or	failure.
        // delete <filename>	—	Remove	"ilename	from	storage	and	display	a
        // message	denoting	success	or	failure.
        // format	—	Initialize	all	blocks	in	all	sectors	in	all	tracks	and	display	a
        // message	denoting	success	or	failure.
        // Add	a	shell	command,	ls,	to	list	the	Eiles	currently	stored	on	the	disk.
        /*
        public krnKbdDispatchKeyPress(params) {
            // Parse the params.  TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if ((keyCode >= 65) && (keyCode <= 90)) { // letter
                if (isShifted === true) {
                    chr = String.fromCharCode(keyCode); // Uppercase A-Z
                } else {
                    chr = String.fromCharCode(keyCode + 32); // Lowercase a-z
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            } else if ((keyCode == 32)      ||   // space
                (keyCode == 13)) {      // enter
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);

                //to deal with symbols and numbers and shift characters
                //logic inspired by KaiOS
            } else if (((keyCode >= 44) && (keyCode <= 57)) || //digits and punctuation
                ((keyCode >= 91) && (keyCode <= 93)) || //square brackets
                (keyCode == 59) || //semi-colon
                (keyCode == 61) || //equals sign
                (keyCode == 96)){
                if (isShifted === true){
                    var spec_Char = {
                        '44':'60',
                        '45':'95',
                        '46':'62',
                        '47':'63',
                        '48':'41',
                        '49':'33',
                        '50':'64',
                        '51':'35',
                        '52':'36',
                        '53':'37',
                        '54':'94',
                        '55':'38',
                        '56':'42',
                        '57':'40',
                        '59':'58',
                        '61':'43',
                        '91':'123',
                        '92':'124',
                        '93':'125',
                        '96':'126'
                    }
                    chr = String.fromCharCode(spec_Char[keyCode]);
                } else {
                    chr = String.fromCharCode(keyCode);
                }
                _KernelInputQueue.enqueue(chr);
            } else if (keyCode == 8){      //backspace key
                _StdOut.deleteText(chr);
                //_KernelInputQueue.dequeue();
            }
        }*/
    }
}

