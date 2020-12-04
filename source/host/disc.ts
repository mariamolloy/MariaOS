module TSOS {
    export class Disc {//change all of these to globals
        public tracks: number = 4; //  tracks on the disk
        public sectors: number = 8; // sectors in each track
        public blocks: number = 8; //  blocks in each sector
        public totalBytes: number = 60; // actual amt of bytes to write to
        constructor(){
        }
    }
}