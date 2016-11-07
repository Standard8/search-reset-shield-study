// var main = require("../");
let {Cu} = require("chrome");
const {before, after} = require("sdk/test/utils");
const {feature} = require("../lib/feature");

const {Services} = Cu.import("resource://gre/modules/Services.jsm", this);

const searchBranch = "browser.search.";
const searchResetPref = "reset.enabled";

let prefBranch = Services.prefs.getDefaultBranch(searchBranch);

exports["test installation - reset ui"] = function(assert) {
  feature.install("reset-ui");

  assert.ok(prefBranch.getBoolPref(searchResetPref), "should have set the preference to true");
};

exports["test installation - control"] = function(assert) {
  feature.install("control");

  assert.ok(!prefBranch.getBoolPref(searchResetPref), "should not have set the preference to true");
};

exports["test cleanup"] = function(assert) {
  feature.install("reset-ui");

  feature.cleanup();

  assert.ok(!prefBranch.getBoolPref(searchResetPref), "should have reset the preference");
};

exports["test eligible"] = function(assert) {
  assert.ok(feature.isEligible(), "should be eligible by default");

  prefBranch.setBoolPref(searchResetPref, true);

  assert.ok(!feature.isEligible(), "should not be eligible if the pref is already true");
};

before(exports, () => {
  prefBranch.setBoolPref(searchResetPref, false);
});

require("sdk/test").run(exports);

after(exports, () => {
  prefBranch.setBoolPref(searchResetPref, false);
});
