/** feature.js **/
let {Cu} = require("chrome");

const {Services} = Cu.import("resource://gre/modules/Services.jsm", this);

const searchBranch = "browser.search.";
const searchResetPref = "reset.enabled";

function defaultBranch() {
  return Services.prefs.getDefaultBranch(searchBranch);
}

exports.isEligible = function() {
  return !defaultBranch().getBoolPref(searchResetPref);
};

exports.reset = function() {
  return defaultBranch().clearUserPref(searchResetPref);
};

exports.install = function(variation) {
  if (variation === "reset-ui") {
    defaultBranch().setBoolPref(searchResetPref, true);
  }
};
