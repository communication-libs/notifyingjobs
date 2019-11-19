function createOnNotifierJob (lib, mylib) {
  'use strict';

  var JobOnDestroyable = lib.qlib.JobOnDestroyable;

  function JobOnNotifier (notifier, res, defer) {
    JobOnDestroyable.call(this, notifier, defer);
    this.res = res;
  }
  lib.inherit(JobOnNotifier, JobOnDestroyable);
  JobOnNotifier.prototype.destroy = function () {
    this.res = null;
    JobOnDestroyable.prototype.destroy.call(this);
  };
  JobOnNotifier.prototype.resolve = function (result) {
    if (!this.okToProceed()) {
      return;
    }
    this.res.end(result ? 'ok' : 'nok');
    JobOnDestroyable.prototype.resolve.call(this, result);
  };
  JobOnNotifier.prototype.reject = function (reason) {
    if (!this.okToProceed()) {
      return;
    }
    this.res.end('err');
    JobOnDestroyable.prototype.reject.call(this, reason);
  };
  JobOnNotifier.prototype._destroyableOk = function () {
    var ok = JobOnDestroyable.prototype._destroyableOk.call(this);
    if (!ok) {
      return ok;
    }
    if (!this.destroyable.mailingNotificationJobs) {
      return false;
    }
    if (!this.res) {
      return false;
    }
    if (this.res.finished) {
      return false;
    }
    return true;
  };

  mylib.JobOnNotifier = JobOnNotifier;
}
module.exports = createOnNotifierJob;
