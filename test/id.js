var machineId = require('../');
if (process.send) {
  process.send(machineId());
}
