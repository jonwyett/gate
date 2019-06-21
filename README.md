# gate
Creates a "Gate" object with multiple "locks" that can be locked and unlocked. Useful for controlling async events.

In addition to using this to determine when multiple async events have completed, this is also useful when something needs to happen only when multiple things are all true, particularly when interacting with the real world, such as for IoT devices.

It was originally developed to help control VISCA cameras where the command buffer needed to wait until multiple things were true before issuing the next command:
- A minimum amount of time had passed. 
- The camera had returned an ACK.
- The camera had returned that the pan/tilt action had completed.

Another example might be something like if a server needs to update a remote system under these circumstances:
- At least 1 minute has passed.
- At least 1 user has requested an update.
- The remote system has confirmed the last update is completed.
- The remote system has confirmed that it is a ready state. (maybe it's an IoT device that regularly loses internet connection and send a heartbeat to the clients when it comes back online)

Only when all 4 of these things are true will the update take place.

### Example:
```
var Gate = require('./gate');

var gate = new Gate.Gate(
    ['time','request','online','ready'],
    true
); //it's locked to start

gate.on('unlocked', function() {
    //Send the update to the remote system
    updateRemoteSystem();

    //re-lock the user request lock
    gate.lock('request',true);

    //re-lock the ready lock
    gate.lock('ready', true);

    //Start a time delay and lock the 'time' lock
    gate.lock('time', true);
    setTimeout(function() {
        gate.lock('time', false); //after 60 secs the time lock is unlocked
    }, 6000);
});

//Imagine the following functions actually do the thing they need to do

function listenForUserRequest() {
    //since a user requested an update, unlock the request lock
    gate.lock('request', false); 
}

function listenForHeartBeat() {
    if (true) {
        //we heard a heartbeat, so unlock that lock
        gate.lock('online', false); 
    } else {
        //no heartbeat, remote system offline, lock it.
        gate.lock('online', true); 
    }
}

function listenForUpdateComplete() {
    //the update is complete so unlock the ready lock    
    gate.lock('ready', false); 
}

function updateRemoteSystem() {
    //update the remote system
}

```




