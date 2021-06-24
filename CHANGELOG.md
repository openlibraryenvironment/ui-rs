# Change history for ui-rs

## [1.2.0](https://github.com/openlibraryenvironment/ui-rs/tree/v1.2.0) (IN PROGRESS)

* Display item barcode in Request app search results. Fixes PR-819.
* Add search by item barcode to Request app. Fixes PR-820.
* Partial support for settings help in translations file. Towards PR-828.
* Set up permissions for settings pages. Fixes PR-813. XXX NOT COMPLETE.
* Fix legend-alignment problems in pull-slip notification editor. Fixes PR-723.
* Layout improvements to pull slip delivery settings screen. Fixes PR-843.
* Display due date on Requester view. Fixes PR-853.
* Add a dummy "none" option to list of LMS locations when editing a pull-slip notification schedule. Fixes PR-847.
* Rename "Chat" to "Messages" in helper app. Fixes PR-991.
* Remove _all_ translations from `en_US.json`, which is not presently maintained and had become and accidental dumping ground for translations intended for `en.json`. Fixes PR-996.

## [1.1.0](https://github.com/openlibraryenvironment/ui-rs/tree/v1.1.0) (2020-08-24)

* Initial release
* Support "sub-applications" such as `ui-supply` by the top-level component determining the app-name from the route and passing it as the `appName` prop to the top-level and settings components.
* Support creation of new patron-request records from the UI (PR-264).

## 1.0.0 (NEVER RELEASED)

* New app created with stripes-cli
