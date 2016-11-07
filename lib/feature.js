/** feature.js **/
let {Cu} = require("chrome");

const {Services} = Cu.import("resource://gre/modules/Services.jsm", this);

const searchBranch = "browser.search.";
const searchResetPref = "reset.enabled";

const feature = {
  get _defaultBranch() {
    return Services.prefs.getDefaultBranch(searchBranch);
  },

  isEligible() {
    return !this._defaultBranch.getBoolPref(searchResetPref);
  },

  cleanup() {
    return this._defaultBranch.setBoolPref(searchResetPref, false);
  },

  // Note: install runs on startup as well.
  install(variation) {
    if (variation === "reset-ui") {
      this._defaultBranch.setBoolPref(searchResetPref, true);
    }
  }
};

exports.feature = feature;
