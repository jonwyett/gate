var Gate = require('./gate');

var gate = new Gate.Gate(
    ['time','request','safe','ready'],
    true //it's locked to start
); 

gate.on('unlocked', function() {
    //Send the cycle valve command
    cycleValve();

    //re-lock the user request lock
    gate.lock('request',true);

    //re-lock the ready lock
    gate.lock('ready', true);

    //Start a time delay and lock the 'time' lock
    gate.lock('time', true);
    setTimeout(function() {
        gate.lock('time', false); //after 10 mins the time lock is unlocked
    }, 10000);
});

//Imagine the following functions:

function listenForUserRequest() {
    //since a user requested an update, unlock the request lock
    gate.lock('request', false); 
}

function listenForSafeState(safe) {
    if (safe) {
        //the valve has notified us that it's safe to operate
        gate.lock('safe', false); 
    } else {
        //not safe to operate, lock the "safe" lock
        gate.lock('safe', true); 
    }
}

function listenForCycleComplete() {
    //the update is complete so unlock the ready lock    
    gate.lock('ready', false); 
}

function cycleValve() {
    //send the command to cycle the valve
}
