/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    var Shell = /** @class */ (function () {
        function Shell() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
        }
        Shell.prototype.init = function () {
            var sc;
            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;
            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            // date
            sc = new TSOS.ShellCommand(this.shellDate, "date", "- Displays the current time and date.");
            this.commandList[this.commandList.length] = sc;
            // whereami
            sc = new TSOS.ShellCommand(this.shellWhereami, "whereami", "-Displays the user's current location.");
            this.commandList[this.commandList.length] = sc;
            // horoscope
            sc = new TSOS.ShellCommand(this.shellHoroscope, "horoscope", "-Displays a daily horoscope for the user.");
            this.commandList[this.commandList.length] = sc;
            //status <string>
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "<string> - Sets the status.");
            this.commandList[this.commandList.length] = sc;
            //load
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "- Validates and loads the user program.");
            this.commandList[this.commandList.length] = sc;
            //run
            sc = new TSOS.ShellCommand(this.shellRun, "run", "<pid> - Runs a program loaded in memory corresponding to the provided process id");
            this.commandList[this.commandList.length] = sc;
            //BSOD test
            sc = new TSOS.ShellCommand(this.shellBsod, "bsod", "- Tests an error message");
            this.commandList[this.commandList.length] = sc;
            //to do:
            //to do: run <pid> program in memory
            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.
            // Display the initial prompt.
            this.putPrompt();
        };
        Shell.prototype.putPrompt = function () {
            _StdOut.putText(this.promptStr);
        };
        Shell.prototype.handleInput = function (buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match.
            // TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args); // Note that args is always supplied, though it might be empty.
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) { // Check for curses.
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) { // Check for apologies.
                    this.execute(this.shellApology);
                }
                else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        };
        // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
        Shell.prototype.execute = function (fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        };
        Shell.prototype.parseInput = function (buffer) {
            var retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            // 2. Lower-case it.
            buffer = buffer.toLowerCase();
            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript. See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        };
        //
        // Shell Command Functions. Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        Shell.prototype.shellInvalidCommand = function () {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        };
        Shell.prototype.shellCurse = function () {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        };
        Shell.prototype.shellApology = function () {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        };
        // Although args is unused in some of these functions, it is always provided in the
        // actual parameter list when this function is called, so I feel like we need it.
        Shell.prototype.shellVer = function (args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        };
        Shell.prototype.shellHelp = function (args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        };
        Shell.prototype.shellShutdown = function (args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
        };
        Shell.prototype.shellCls = function (args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        };
        Shell.prototype.shellMan = function (args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    case "ver":
                        _StdOut.putText("Ver displays the current version of this OS.");
                        break;
                    case "shutdown":
                        _StdOut.putText("This stops the OS running.");
                        break;
                    case "cls":
                        _StdOut.putText("Cls clears the screen and resets the cursor to the top of the page.");
                        break;
                    case "date":
                        _StdOut.putText("Date displays the current date and time... if time is even real that is.");
                        break;
                    case "whereami":
                        _StdOut.putText("Whereami displays the users current location.");
                        break;
                    case "horoscope":
                        _StdOut.putText("Horoscope confers with the stars to display the user's daily horoscope.");
                        break;
                    case "status":
                        _StdOut.putText("Status <string> sets the OS task bar status to <string>.");
                        break;
                    case "bsod":
                        _StdOut.putText("BSOD is a test command for a kernel OS error message.");
                        break;
                    case "load":
                        _StdOut.putText("Load validates that the user input is hex characters and loads it into the memory.");
                        break;
                    case "run":
                        _StdOut.putText("Run <pid> runs the program loaded into memory with the given process ID.");
                        break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        };
        Shell.prototype.shellTrace = function (args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        };
        Shell.prototype.shellRot13 = function (args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellPrompt = function (args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellDate = function (args) {
            var today = new Date();
            _StdOut.putText("Today is " + today);
        };
        Shell.prototype.shellWhereami = function (args) {
            _StdOut.putText("You are currently up my butt");
        };
        Shell.prototype.shellHoroscope = function (args) {
            _StdOut.putText("Today you have power in spirituality, self, and love. Try to get in touch with the areas in your life where you still have some growing to do.");
        };
        Shell.prototype.shellStatus = function (args) {
            if (args.length > 0) {
                _Status = args[0];
                _StdOut.putText("New status: " + _Status);
                document.getElementById('status').innerHTML = _Status;
            }
            else {
                _StdOut.putText("Usage: status <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellBsod = function (args) {
            _StdOut.putText("ERROR SOS ERROR SOS ERROR SOS ERROR SOS ERROR SOS ERROR SOS ERROR");
        };
        Shell.prototype.shellLoad = function (args) {
            //create an array of input letter by letter to check for valid input
            //and create an array of input bytes to pass on to memory
            var userInp = (document.getElementById("taProgramInput")).value.trim().toUpperCase();
            var inp = new Array();
            var bytes = new Array();
            //remove allllllll whitespace from input
            userInp = userInp.replace(/\s+/g, '');
            for (var i = 0; i < userInp.length; i++) {
                var char = userInp.substring(i, i + 1);
                inp.push(char);
            }
            if (userInp.length == 0) {
                _StdOut.putText("No User Input was entered.");
            }
            else if (userInp.length % 2 == 0) { //check that its all full bytes entered
                var inputLength = 0;
                for (var i = 0; i < inp.length; i++) {
                    var letter = inp[i];
                    if (letter == "0" || letter == "1" || letter == "2" || letter == "3" || letter == "4" || letter == "5" || letter == "6"
                        || letter == "7" || letter == "8" || letter == "9" || letter == "A" || letter == "B" || letter == "C" ||
                        letter == "D" || letter == "E" || letter == "F") {
                        inputLength++;
                    }
                    else {
                        _StdOut.putText(letter);
                    }
                }
                if (inputLength == inp.length) {
                    //this means all input is valid hex and we can continue and load into memory
                    //prints user input for testing purposes
                    /*  for (var i = 0; i < inp.length; i++){
                        _StdOut.putText(inp[i]);
                    } */
                    for (var i = 0; i < userInp.length; i += 2) {
                        var newBite = userInp.substring(i, i + 2);
                        bytes.push(newBite);
                    }
                    //assign	a	Process	ID	(PID) and create	a	Process	Control	Block	(PCB)
                    var processID = _ProcessManager.idCounter;
                    var newPcb = new TSOS.PCB(processID);
                    _ProcessManager.allPcbs.push(newPcb);
                    _ProcessManager.idCounter++;
                    newPcb.init(0); //to do for iProj3 once we have partitions, for now just set partition to 0
                    //return	the	PID	to	the	console	and	display	it.
                    _StdOut.putText("Loaded Process " + processID);
                    //go through the array and load into memory at location $0000
                    _MemoryManager.writingTime(0, bytes);
                    //for testing
                    //_StdOut.putText(_MemoryManager.readingTime(0, 5, 0));
                }
                else {
                    _StdOut.putText("Please enter valid input");
                }
            }
            else {
                _StdOut.putText("Please enter BYTES thank u");
            }
        };
        //this takes the pid and looks for the pcb w that pid and then calls _ProcessManager.run w found pcb
        //args is the pid of the pcb u want to run
        Shell.prototype.shellRun = function (args) {
            if (args.length > 0) {
                var inputPID = parseInt(args, 10);
                for (var i = 0; i < _ProcessManager.allPcbs.length; i++) {
                    var pcbToRun = _ProcessManager.allPcbs[i];
                    if (pcbToRun.Pid == inputPID) {
                        _ProcessManager.run(pcbToRun);
                    }
                    else {
                        _StdOut.putText("Sorry :( thats not a process id");
                    }
                }
            }
            else {
                _StdOut.putText("Error pls say run <pid>");
            }
        };
        return Shell;
    }());
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
