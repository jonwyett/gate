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

//Imagine the following functions:

//function listenForUserRequest() {
    //since a user requested an update, unlock the request lock
    gate.lock('request', false); 
// }

//function listenForHeartBeat() {
    if (true) {
        //we heard a heartbeat, so unlock that lock
        gate.lock('online', false); 
    } else {
        //no heartbeat, remote system offline, lock it.
        gate.lock('online', true); 
    }
//}

//function listenForUpdateComplete() {
//the update is complete so unlock the ready lock    
    gate.lock('ready', false); 
//}

//function updateRemoteSystem() {
    //update the remote system
//}
