// var main = require("../");
let {Ci, Cu} = require("chrome");
const {before, after} = require("sdk/test/utils");
const {feature} = require("../lib/feature");

const {Services} = Cu.import("resource://gre/modules/Services.jsm", this);

const searchBranch = "browser.search.";
const searchResetPref = "reset.enabled";
const searchTelemetryMirrorPref = "experiment.search-reset.telemetry.enabled.mirror";
const telemetryEnabledPref = "toolkit.telemetry.enabled";

let prefBranch = Services.prefs.getBranch(searchBranch);

exports["test installation - reset ui"] = function(assert) {
  feature.install("reset-ui");

  assert.ok(prefBranch.getBoolPref(searchResetPref), "should have set the preference to true");
};

exports["test installation - control"] = function(assert) {
  feature.install("control");

  assert.ok(!prefBranch.getBoolPref(searchResetPref), "should not have set the preference to true");
};

exports["test installation - enable telemetry"] = function(assert) {
  feature.install("test");

  assert.ok(Services.prefs.getBoolPref(telemetryEnabledPref), "should have enabled telemetry");
  assert.ok(!prefBranch.getBoolPref(searchTelemetryMirrorPref), "should have saved the old telemtry pref");
};

exports["test uninstall"] = function(assert) {
  Services.prefs.getDefaultBranch(searchBranch).setBoolPref(searchResetPref, false);

  feature.install("reset-ui");

  feature.uninstall();

  assert.ok(!prefBranch.getBoolPref(searchResetPref), "should have reset the preference");
};

exports["test installation - reset telemetry"] = function(assert) {
  feature.install("test");

  feature.uninstall();

  assert.ok(!Services.prefs.getBoolPref(telemetryEnabledPref), "should have reset telemetry");
  assert.ok(prefBranch.getPrefType(searchTelemetryMirrorPref) === Ci.nsIPrefBranch.PREF_INVALID,
    "should have cleared the old pref");
};

exports["test eligible"] = function(assert) {
  prefBranch.setBoolPref(searchResetPref, true);

  assert.ok(!feature.isEligible(), "should not be eligible if the pref is already true");

  prefBranch.setBoolPref(searchResetPref, false);

  assert.ok(feature.isEligible(), "should be eligible if the pref is false");
};

before(exports, () => {
  prefBranch.setBoolPref(searchResetPref, false);
});

require("sdk/test").run(exports);

after(exports, () => {
  prefBranch.setBoolPref(searchResetPref, false);
});
