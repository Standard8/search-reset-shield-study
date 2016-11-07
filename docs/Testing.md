# Setup

Note: On some pre-release versions of Firefox, the search reset UI is enabled by
default. Testing the add-on against those will result in nothing happening.

For beta/release versions, it is necessary to use an unbranded build (from
https://wiki.mozilla.org/Add-ons/Extension_Signing) to test this using the Shield cli.

For example, after cloning the git report and entering the add-on folder:

```shell
JPM_FIREFOX_BINARY=/path/to/firefox npm run shield <branch>
```

`branch` is one of the variations:
 * `reset-ui`: enables the Search Reset UI.
 * `control`: no changes

# Tests

Check the add-on is working:

* Visit `about:config`, skip the warning message.
* Search for `browser.search.reset.enabled`. The status will be `default` with
  a value of `true`

Test the reset UI:

* Visit https://github.com
* On the search bar, click the search icon and then `Add GitHub`
* Right-click on the newly added GitHub icon, and select `Set as default engine`
* Open the browser console, and enter:
  * `Services.search.currentEngine.wrappedJSObject.setAttr("loadPathHash", "invalid");`
* Now go back to the main window and attempt to do a search

=> Search Reset UI is shown.

* On the search reset UI, you can:
  * `Change Search Engine` (0)
  * `Don't change` (1)
  * `Settings page` (4)
  * Close the page (3)
* Do one, check the expected result
* Go to `about:telemetry`
* In Histograms, search for `SEARCH_RESET_RESULT`

=> There should be a column with a value of `1` for the selected option.
