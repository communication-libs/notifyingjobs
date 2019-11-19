function createDeliveryHandlerJob (lib, mylib) {
  'use strict';

  var JobOnDestroyable = lib.qlib.JobOnDestroyable;

  function DeliveryHandlerJob (notifier, sendingsystemcode, sendingsystemid, sendingsystemnotified, defer) {
    JobOnDestroyable.call(this, notifier, defer);
    this.code = sendingsystemcode;
    this.id = sendingsystemid;
    this.notified = sendingsystemnotified;
  }
  lib.inherit(DeliveryHandlerJob, JobOnDestroyable);
  DeliveryHandlerJob.prototype.destroy = function () {
    this.notified = null;
    this.id = null;
    this.code = null;
    JobOnDestroyable.prototype.destroy.call(this);
  };
  DeliveryHandlerJob.prototype.go = function () {
    var ok = this.okToGo();
    if (!ok.ok) {
      return ok.val;
    }
    this.destroyable.markCommunicationHistoryAsDelivered(this.code, this.id, this.notified).then(
      this.resolve.bind(this),
      this.reject.bind(this)
    );
    return ok.val;
  };

  mylib.DeliveryHandlerJob = DeliveryHandlerJob;
}
module.exports = createDeliveryHandlerJob;
