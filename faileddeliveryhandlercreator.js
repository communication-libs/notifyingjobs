function createFailedDeliveryHandlerJob (lib, mylib) {
  'use strict';

  var qlib = lib.qlib;

  var JobOnDestroyable = qlib.JobOnDestroyable;

  function FailedDeliveryHandlerJob (notifier, failobj, defer) {
    JobOnDestroyable.call(this, notifier, defer);
    this.failobj = failobj;
  }
  lib.inherit(FailedDeliveryHandlerJob, JobOnDestroyable);
  FailedDeliveryHandlerJob.prototype.destroy = function () {
    this.failobj = null;
    JobOnDestroyable.prototype.destroy.call(this);
  };
  FailedDeliveryHandlerJob.prototype.go = function () {
    var ok = this.okToGo(), ps;
    if (!ok.ok) {
      return ok.val;
    }
    ps = this.failobj;
    try {
      this.checkObj();
    } catch(e) {
      console.log(e);
      this.reject(e);
      return;
    }
    if (lib.isArray(ps.toblacklist) && ps.toblacklist.length) {
      (new mylib.BlacklisterJob(this.destroyable, ps.sendingsystemcode, ps.toblacklist)).go().then(
        this.handleHistory.bind(this),
        this.reject.bind(this)
      );
      return;
    }
    this.handleHistory();
  };
  FailedDeliveryHandlerJob.prototype.handleHistory = function () {
    if (!this.okToProceed()) {
      return;
    }
    if (!lib.isNumber(this.failobj.retryin)) {
      this.handlePermanentBounce();
      return;
    }
    this.handleTemporaryBounce();
  };
  FailedDeliveryHandlerJob.prototype.handlePermanentBounce = function () {
    if (!this.okToProceed()){
      return;
    }
    (new mylib.PermanentBounceHandlerJob(this.destroyable, this.failobj)).go().then(
      this.resolve.bind(this, true),
      this.reject.bind(this)
    );
  };
  FailedDeliveryHandlerJob.prototype.handleTemporaryBounce = function () {
    if (!this.okToProceed()) {
      return;
    }
    (new mylib.TemporaryBounceHandlerJob(this.destroyable, this.failobj)).go().then(
      this.resolve.bind(this, true),
      this.reject.bind(this)
    );
  };
  FailedDeliveryHandlerJob.prototype.checkObj = function () {
    if (!(
      this.failobj &&
      this.failobj.sendingsystemcode &&
      this.failobj.sendingsystemid &&
      this.failobj.sendingsystemnotified
    )) {
      console.log(this.constructor.name, 'params no no', this.params); 
      throw new lib.Error(this.InvalidParamsErrorCode, this.constructor.name+' needs an Object with the following properties: "sendingsystemcode", "sendingsystemid", "sendingsystemnotified"');
    }
  };
  FailedDeliveryHandlerJob.prototype.InvalidParamsErrorCode;

  mylib.FailedDeliveryHandlerJob = FailedDeliveryHandlerJob;
}
module.exports = createFailedDeliveryHandlerJob;
