module TSOS {
    export class DiscAccessor {


        constructor() {
        }

        //fully formats the disk
        public fullFormat(): void {
            if (_Disc.format()) {
                TSOS.Control.hostInitDisk();
                _StdOut.putText("Hard Drive was successfully fully formatted.");
            } else {
                _StdOut.putText("Hard drive could not be formatted at this moment");
            }

        }

        //takes a track sector and branch as param and returns a file
        public readFrmDisc(TSB: string): string {
            return _Disc.storage.getItem(TSB);
        }


        //TSB : TSB of the file we are writing to
        //bytes : data we are writing
        public writeToDisc(TSB: string, bytes: string): void {
            _Disc.storage.setItem(TSB, bytes);
            TSOS.Control.hostUpdateDisk();
        }

        public getTsb(t: string, s: string, b: string): string {
            let TSB = t + ":" + s + ":" + b;
            return TSB;
        }

    }
}