# gate
Creates a "Gate" object with multiple "locks" that can be locked and unlocked. Useful for controlling async events.

In addition to using this to determine when multiple async events have completed, this is also useful when something needs to happen only when multiple things are all true, particularly when interacting with the real world, such as for IoT devices.

It was originally developed to help control VISCA cameras where the command buffer needed to wait until multiple things were true before issuing the next command:
- A minimum amount of time had passed. 
- The camera had returned an ACK.
- The camera had returned that the pan/tilt action had completed.

Another example imagines an IoT device that does something like opening/closing a valve, but only under these circumstances:
- At least 10 minutes have passed since the last open/close function.
- At least 1 user has requested an open/close operation.
- The remote system has confirmed the cycle is completed.
- The remote system has confirmed that it is in a ready state. (Maybe the valve controller shouldn't be opened if it senses a dangerous environment).

Only when all 4 of these things are true will the update take place.

### Example:
```
var Gate = require('./gate');

var gate = new Gate.Gate(
    ['time','request','safe','ready'],
    true
); //it's locked to start

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
```




