module TSOS {
    export class Swapper {
        constructor() {}

        public writeProcessToDisc(input: string[], procId: number){
            let fn = "#PROCESS" + procId;
            _krnDiscDriver.createFile(fn);
            for (let i = input.length; i < _PartitionSize; i++){
                input.push("00");
            }
           if (_krnDiscDriver.writeProcess(fn, input)) {
               _StdOut.putText("Loaded Process " + procId);
           } else {
               _StdOut.putText("Could not load Process " + procId);
           }
        }



        public swapIn(){

        }

        public swapOut(){

        }

    }
}