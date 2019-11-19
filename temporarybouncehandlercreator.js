function createTemporaryBounceHandlerJob (lib, mylib) {
  'use strict';

  var q = lib.q,
    qlib = lib.qlib,
    JobOnDestroyable = qlib.JobOnDestroyable;

  function TemporaryBounceHandlerJob (notifier, params, defer) {
    JobOnDestroyable.call(this, notifier, defer);
    this.params = params;
    this.originalHistory = null;
  }
  lib.inherit(TemporaryBounceHandlerJob, JobOnDestroyable);
  TemporaryBounceHandlerJob.prototype.destroy = function () {
    this.originalHistory = null;
    this.params = null;
    JobOnDestroyable.prototype.destroy.call(this);
  };
  TemporaryBounceHandlerJob.prototype.go = function () {
    var ok = this.okToGo();
    if (!ok.ok) {
      return ok.val;
    }
    this.markAsBounced();
    return ok.val;
  };
  TemporaryBounceHandlerJob.prototype.markAsBounced = function () {
    if (!this.okToProceed()) {
      return;
    }
    this.destroyable.markCommunicationHistoryAsBouncedTemporarily(this.params.sendingsystemcode, this.params.sendingsystemid, this.params.sendingsystemnotified).then(
      this.fetchOriginal.bind(this),
      this.reject.bind(this)
    );
  };
  TemporaryBounceHandlerJob.prototype.fetchOriginal = function () {
    if (!this.okToProceed()) {
      return;
    }
    if (!lib.isNumber(this.params.retryin)) {
      this.resolve(true);
      true;
    }
    this.destroyable.getCommunicationHistoryForSendingSystem(this.params.sendingsystemcode, this.params.sendingsystemid).then(
      this.onOriginal.bind(this),
      this.reject.bind(this)
    );
  };
  TemporaryBounceHandlerJob.prototype.onOriginal = function (rec) {
    if (!this.okToProceed()) {
      return;
    }
    if (!rec) {
      this.resolve(false);
      return;
    }
    this.originalHistory = rec;
    this.prepareResend();
  };
  TemporaryBounceHandlerJob.prototype.prepareResend = function () {
    var oh;
    if (!this.okToProceed()) {
      return;
    }
    oh = this.originalHistory;
    //inconsistency: asking for a send!
    this.destroyable.resendSingleMessage(oh.from, oh.to, oh.subject, {text: oh.text, html: oh.html}, Date.now()+this.params.retryin, oh.notsendafter, oh.id).then(
      this.onResend.bind(this),
      this.reject.bind(this)
    );
  };
  TemporaryBounceHandlerJob.prototype.onResend = function (res) {
    var id;
    if (!this.okToProceed()) {
      return;
    }
    id = res.id;
    this.destroyable.updateCommunicationHistoryForwardReferenceFromSendingSystem(this.params.sendingsystemcode, this.params.sendingsystemid, id).then(
      this.resolve.bind(this, id),
      this.reject.bind(this)
    );
    id = null;
  };

  mylib.TemporaryBounceHandlerJob = TemporaryBounceHandlerJob;
}
module.exports = createTemporaryBounceHandlerJob;
