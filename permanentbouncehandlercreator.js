function createPermanentBounceHandlerJob (lib, mylib) {
  'use strict';

  var q = lib.q,
    qlib = lib.qlib,
    JobOnDestroyable = qlib.JobOnDestroyable;

  function PermanentBounceHandlerJob (notifier, params, defer) {
    JobOnDestroyable.call(this, notifier, defer);
    this.params = params;
  }
  lib.inherit(PermanentBounceHandlerJob, JobOnDestroyable);
  PermanentBounceHandlerJob.prototype.destroy = function () {
    this.params = null;
    JobOnDestroyable.prototype.destroy.call(this);
  };
  PermanentBounceHandlerJob.prototype.go = function () {
    var ok = this.okToGo();
    if (!ok.ok) {
      return ok.val;
    }
    this.markAsBounced();
    return ok.val;
  };
  PermanentBounceHandlerJob.prototype.markAsBounced = function () {
    if (!this.okToProceed()) {
      return;
    }
    this.destroyable.markCommunicationHistoryAsBouncedPermanently(this.params.sendingsystemcode, this.params.sendingsystemid, this.params.sendingsystemnotified).then(
      this.resolve.bind(this),
      this.reject.bind(this)
    );
  };

  mylib.PermanentBounceHandlerJob = PermanentBounceHandlerJob;
}
module.exports = createPermanentBounceHandlerJob;
