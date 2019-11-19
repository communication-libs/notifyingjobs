function createBlacklisterJob (lib, mylib) {
  'use strict';

  var q = lib.q,
    qlib = lib.qlib,
    JobOnDestroyable = qlib.JobOnDestroyable;

  function BlacklisterJob (notifier, sendingsystemcode, blacklist, defer) {
    JobOnDestroyable.call(this, notifier, defer);
    this.sendingsystemcode = sendingsystemcode;
    this.blacklist = blacklist;
  }
  lib.inherit(BlacklisterJob, JobOnDestroyable);
  BlacklisterJob.prototype.destroy = function () {
    this.blacklist = null;
    this.sendingsystemcode = null;
    JobOnDestroyable.prototype.destroy.call(this);
  };
  BlacklisterJob.prototype.go = function () {
    var ok = this.okToGo();
    if (!ok.ok) {
      return ok.val;
    }
    if (!lib.isArray(this.blacklist)) {
      this.resolve(true);
      return ok.val;
    }
    this.writeToBlacklist();
    return ok.val;
  };
  BlacklisterJob.prototype.writeToBlacklist = function () {
    if (!this.okToProceed()) {
      return;
    }
    q.all(this.blacklist.map(this.writeOneToBlacklist.bind(this))).then(
      this.resolve.bind(this),
      this.reject.bind(this)
    );
  };
  BlacklisterJob.prototype.writeOneToBlacklist = function (recipient) {
    if (lib.isString(recipient)) {
      return this.destroyable.doBlacklist(recipient, this.sendingsystemcode);
    }
    if (!lib.isVal(recipient)) {
      return q(true);
    }
    if (!recipient.recipient) {
      return q(true);
    }
    if ('invalid' === recipient.reason) {
      return this.destroyable.doBlacklistBecauseInvalid(recipient.recipient, this.sendingsystemcode);
    }
    if ('untrusted' === recipient.reason) {
      return this.destroyable.doBlacklistBecauseNotTrusted(recipient.recipient, this.sendingsystemcode);
    }
    if ('complained' === recipient.reason) {
      return this.destroyable.doBlacklistBecauseComplained(recipient.recipient, this.sendingsystemcode);
    }
    return this.destroyable.doBlacklist(recipient.recipient, this.sendingsystemcode);
  };

  mylib.BlacklisterJob = BlacklisterJob;
}
module.exports = createBlacklisterJob;
