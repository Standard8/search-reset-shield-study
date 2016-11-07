/** feature.js **/
const prefSvc = require("sdk/preferences/service");

const searchResetPref = "browser.search.reset.enabled";

exports.isEligible = function() {
  return !prefSvc.isSet(searchResetPref);
};

exports.reset = function() {
  return prefSvc.reset(searchResetPref);
};

exports.install = function(variation) {
  if (variation === "reset-ui") {
    prefSvc.set(searchResetPref, true);
  }
};
