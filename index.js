function createJobs (execlib) {
  'use strict';

  var lib = execlib.lib,
    ret = {};

  /*
  require('./onnotifiercreator')(lib, ret);
  require('./anonymousonnotifiercreator')(lib, ret);
  require('./mailingnotificationhandlercreator')(lib, ret);
  */
  require('./deliveryhandlercreator')(lib, ret);
  require('./faileddeliveryhandlercreator')(lib, ret);
  require('./bouncehandlercreator')(lib, ret);
  require('./blacklistercreator')(lib, ret);
  require('./permanentbouncehandlercreator')(lib, ret);
  require('./temporarybouncehandlercreator')(lib, ret);
  require('./complainthandlercreator')(lib, ret);

  return ret;
}
module.exports = createJobs;
