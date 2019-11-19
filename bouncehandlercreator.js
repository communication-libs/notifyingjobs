function createBounceHandlerJob (lib, mylib) {
  'use strict';

  var FailedDeliveryHandlerJob = mylib.FailedDeliveryHandlerJob;

  function BounceHandlerJob (notifier, bounceobj, defer) {
    FailedDeliveryHandlerJob.call(this, notifier, bounceobj, defer);
  }
  lib.inherit(BounceHandlerJob, FailedDeliveryHandlerJob);
  BounceHandlerJob.prototype.InvalidParamsErrorCode = 'INVALID_PARAMS_FROM_BOUNCE_NOTIFICATION';

  mylib.BounceHandlerJob = BounceHandlerJob;
}
module.exports = createBounceHandlerJob;
