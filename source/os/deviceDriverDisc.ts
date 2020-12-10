

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

        public listFiles(){

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

    }
}

