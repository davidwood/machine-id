var assert = require('assert'),
    path = require('path'),
    fork = require('child_process').fork,
    machineId = require(path.join(__dirname, '..'));

describe('machine-id', function() {

  it('should return a machine ID', function() {
    assert.strictEqual(/^[a-f0-9]{32}$/.test(machineId()), true);
  });

  it('should return the ID formatted if the argument is true', function() {
    var id = machineId(),
        formatted = machineId(true);
    assert.strictEqual(/^[a-f0-9]{8}[-]([a-f0-9]{4}[-]){3}[a-f0-9]{12}$/.test(formatted), true);
    assert.strictEqual(formatted.replace(/-/g, ''), id);
  });

  it('should return the same machine ID across processes', function(done) {
    var ids = [],
        complete = 0;
    [1, 2].forEach(function() {
      var child = fork(path.join(__dirname, 'id.js'), { cwd: __dirname }).on('message', function(id) {
        ids.push(id);
      }).on('exit', function() {
        child.removeAllListeners();
        if (++complete === 2) {
          assert.strictEqual(ids.length, 2);
          assert.strictEqual(/^[a-f0-9]{32}$/.test(ids[0]), true);
          assert.strictEqual(ids[0], ids[1]);
          done();
        }
      });
    });
  });

});
