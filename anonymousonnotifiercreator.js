function createAnonymousOnNotifierJob (lib, mylib) {
  'use strict';

  var JobOnNotifier = mylib.JobOnNotifier;

  function AnonymousOnNotifierJob (notifier, url, req, res, defer) {
    JobOnNotifier.call(this, notifier, res, defer);
    this.url = url;
    this.req = req;
    this.params = null;
  }
  lib.inherit(AnonymousOnNotifierJob, JobOnNotifier);
  AnonymousOnNotifierJob.prototype.destroy = function () {
    this.params = null;
    this.req = null;
    this.url = null;
    JobOnNotifier.prototype.destroy.call(this);
  };
  AnonymousOnNotifierJob.prototype.go = function () {
    var ok = this.okToGo();
    if (!ok.ok) {
      return ok.val;
    }
    this.destroyable.extractRequestParams(this.url, this.req).then(
      this._onParams.bind(this),
      this.reject.bind(this)
    );
    return ok.val;
  };
  AnonymousOnNotifierJob.prototype._onParams = function (params) {
    this.params = params;
    try {
      this.processParams();
    } catch (e) {
      this.reject(e);
    }
  };

  mylib.AnonymousOnNotifierJob = AnonymousOnNotifierJob;
}
module.exports = createAnonymousOnNotifierJob;
