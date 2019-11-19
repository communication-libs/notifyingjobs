function createMailingNotificationHandlerJob (lib, mylib) {
  'use strict';

  var AnonymousOnNotifierJob = mylib.AnonymousOnNotifierJob;

  function MailingNotificationHandlerJob (notifier, url, req, res, defer) {
    AnonymousOnNotifierJob.call(this, notifier, url, req, res, defer);
    this.sendingsystemid = null;
    this.sendingsystemnotified = null;
  }
  lib.inherit(MailingNotificationHandlerJob, AnonymousOnNotifierJob);
  MailingNotificationHandlerJob.prototype.destroy = function () {
    this.sendingsystemnotified = null;
    this.sendingsystemid = null;
    AnonymousOnNotifierJob.prototype.destroy.call(this);
  };

  mylib.MailingNotificationHandlerJob = MailingNotificationHandlerJob;
}
module.exports = createMailingNotificationHandlerJob;
