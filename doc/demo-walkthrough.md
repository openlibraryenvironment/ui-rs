# Demo walkthrough &mdash; _Rough sketch_

## 1. Discovery

* Go to http://vufind.aws.indexdata.com/vufindfolio
* Open top-right hamburger, choose **Login**
* Log in as (say) `diku_admin` with the usual password
* Find a record -- any record
* Click the **Get it!** button

This generates an OpenURL at http://openurl.indexdata.com/idVuFind
which POSTs a patron request for the specified title.

The OpenURL with have `req_id` set to the UUID of the user you are logged in
and `rft_id` set to the UUID of the instance record for title you chose.

## 2. ReShare

* Go to https://reshare.apps.k-int.com/
* Choose the **Request** app in the top bar
* Sort the list of requests by date, so your new request is at the top
* Click on the request

The display in the right pane should include various cards:

1. **Requesting institution.**
   This should be correctly looked up in directory.
2. **Requesting user.**
   This will in general _not_ be filled in,
   because the user ID from the Shared Index (which is used in discovery)
   is not valid within the ReShare node. That will change in future.
3. **Citation metadata**. This is derived directly from the OpenURL.
4. More complete bibliographic details, looked up from the Shared Index
   (XXX not yet implemented: see
   [PR-229](https://openlibraryenvironment.atlassian.net/browse/PR-229).)
5. *Suppliers** These are cards representing the dummied-up rota,
   each listing a supplier institution and a status.

## 3. Shared Index catalog

* Click on the **[Link to Shared Index]** link in the patron-request display.

You should now be at the relevant title's page within the Shared Index catalog at
http://shared-index.reshare-dev.indexdata.com/inventory/

