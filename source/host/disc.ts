module TSOS {
    export class Disc {//change all of these to globals
        public tracks: number = 4; //  tracks on the disk
        public sectors: number = 8; // sectors in each track
        public blocks: number = 8; //  blocks in each sector
        public totalBytes: number = 60; // actual amt of bytes to write to
        public isFormatted: boolean = false; //its not formatted yet
        constructor(){
        }

        //function to initialize all storage to 0s
        public format(): void{
            //make matrix with array lists
            for (let i = 0; i < this.tracks; i++){
                for (let j = 0; j < this.sectors; j++){
                    for (let k = 0; k < this.blocks; k++){
                        let key = i + ":" + j + ":" + k;
                        let emptyDisc = Array<String>();
                        for (let n = 0; n < this.totalBytes; n++){
                            emptyDisc.push("00");
                        }
                        let block = {
                            avail : "0", // is block available or not?
                            pointer: "0:0:0", // pointer
                            data: emptyDisc // make it empty
                        }
                        sessionStorage.setItem(key, JSON.stringify(block));
                        this.isFormatted = true;
                    }
                }
            }
        }

    }
}