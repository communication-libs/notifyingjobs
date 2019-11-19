function createComplaintHandlerJob (lib, mylib) {
  'use strict';

  var FailedDeliveryHandlerJob = mylib.FailedDeliveryHandlerJob;

  function ComplaintHandlerJob (notifier, complaintobj, defer) {
    FailedDeliveryHandlerJob.call(this, notifier, complaintobj, defer);
  }
  lib.inherit(ComplaintHandlerJob, FailedDeliveryHandlerJob);
  ComplaintHandlerJob.prototype.InvalidParamsErrorCode = 'INVALID_PARAMS_FROM_COMPLAINT_NOTIFICATION';

  mylib.ComplaintHandlerJob = ComplaintHandlerJob;
}
module.exports = createComplaintHandlerJob;
