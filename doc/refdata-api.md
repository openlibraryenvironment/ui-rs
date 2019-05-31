# API to the Refdata system

<!-- md2toc -l 2 refdata-api.md -->
* [Introduction](#introduction)
* [Concepts](#concepts)
* [Operations](#operations)
    * [Operations on categories](#operations-on-categories)
        * [List and search for categories](#list-and-search-for-categories)
        * [Create a new category](#create-a-new-category)
        * [Delete a category](#delete-a-category)
    * [Operations on values](#operations-on-values)
        * [Add values to an existing category](#add-values-to-an-existing-category)
        * [Change a value within a category](#change-a-value-within-a-category)
        * [Delete a value from a category](#delete-a-value-from-a-category)
        * [Combining operations on values](#combining-operations-on-values)
* [Syntactic sugar](#syntactic-sugar)



## Introduction

Refdata is a system implemented by several of Knowledge Integration's back-end modules (e.g. [mod-rs](https://github.com/openlibraryenvironment/mod-rs), [mod-directory](https://github.com/openlibraryenvironment/mod-directory)) to maintain sets of values (called _categories_) that may be adopted by fields in application-level records. Such fields can be restricted to accept only values that are part of the relevant Refdata category.

This document describes the API for creating new categories, adding new values to them, and editing and deleting existing values. All this is based on informal discussions with Steve Osguthorpe.

Examples can be invoked using the `okapi-cmd` command-line utility provided in the `scripts` area of mod-directory. For example:

	$ mod-directory/scripts/okapi-cmd /directory/refdata/DirectoryEntry/Status

(The default Okapi URL, tenant, username and password can be specified in a `.okapirc` file, either in the working directory or in the home directory.)



## Concepts

The basic unit of Refdata is the _category_. A category has a unique ID (assigned by the system at creation time), a description, and a set of zero or more _values_. A value consists of two things: the value itself, which is intended to be machine-readable, and a human-readable value.

Values have no existence outside the context of a specific category. For this reason, there is no CRUD API for values: it's not possible to make a new value by POSTing it, nor to modify or delete an existing value by PUTting or DELETEing it. Instead, it's necessary to make changes to the category that the value belongs to.

The endpoint for managing each module's Refdata is `refdata` at the top level within the module's own namespace: so for example, the Directory module's Refdata is at `/directory/refdata`, and the Resource Sharing module's Refdata is at `/rs/refdata`. The examples in this document all pertain to the Directory module.



## Operations


### Operations on categories

#### List and search for categories

`GET /directory/refdata` will return all Refdata categories (including their values).

This endpoint optionally takes a `filters` parameter, whose value is a query such as `desc=DirectoryEntry.Status`. We can therefore list only the DirectoryEntry.Status values using `GET /directory/refdata?filters=desc%3DDirectoryEntry.Status` -- or indeed `GET /directory/refdata?filters=id%3D12345`, though you need to know the ID for that.

For more detail on how to use `filters`, see [the **Searching and filtering DirectoryEntry records** section of _DirectoryEntry Resources_](https://github.com/openlibraryenvironment/mod-directory/blob/master/doc/entry.md#searching-and-filtering-directoryentry-records).

#### Create a new category

To add a new category, POST it to `/directory/refdata`. It must contain as human-readable `desc` field, and may also contain an initial set of `values`. If that is provided, it must be an array of objects each with a `value` and a `label`: for example:

	{
	  "desc": "Yes/No/Other",
	  "values": [
	    { "value": "yes", "label": "Yes" },
	    { "value": "no", "label": "No" },
	    { "value": "other", "label": "Other (see notes)" }
	  ]
	}

(As when adding values to an existing category (see [below](#add-values-to-an-existing-category)), the `value` in each value is optional: if omitted, the label will be normalized and the result used as the value.)

The response to this POST should be 201 Created, with the new category (including its server-generated `id`) included as the content. Server-generated IDs will also be included for the individual values. For example, the response to the POST above might be:

	{
	  "id" : "8a0081546b0eba8f016b0f4adc820000",
	  "desc" : "Yes/No/Other",
	  "values" : [
	    {
	      "id" : "8a0081546b0eba8f016b0f4adc890001",
	      "label" : "Other (see notes)",
	      "value" : "other"
	    },
	    {
	      "id" : "8a0081546b0eba8f016b0f4adc8a0002",
	      "value" : "no",
	      "label" : "No"
	    },
	    {
	      "id" : "8a0081546b0eba8f016b0f4adc8a0003",
	      "label" : "Yes",
	      "value" : "yes"
	    }
	  ]
	}

#### Delete a category

A category can be deleted by reference to its ID. For example, `DELETE /directory/refdata/12345`.

Deletion will fail (by design) if any of the values of the category are in use in any application-level records. In this case, the HTTP request is rejected with status 500 Internal Server Error (though 400 Bad Request, 409 Conflict or 422 Unprocessable Entity would be more appropriate).


### Operations on values

#### Add values to an existing category

To add a value to an existing category, you must PUT the modified category. (You cannot POST the new value, as values do not have their own existence separate from that of the category.) All PUTs in grails have PATCH-like semantics, so it is not necessary to include the existing values in the set that is part of the PUT record, only the new values. For example, `PUT /directory/refdata/12345` with the payload

	{
	  "values": [
	    { "label": "Unknown" }
	  ]
	}

will add the "Unknown" value to the existing set.

Categories are additive in this way because in many cases there are thousands of values, and it would be inefficient to have to send all those values back every time it's necessary to make a change.

(As when creating a new category with an initial set of values (see [above](#create-a-new-category)), the `value` in each value is optional: if omitted, the label will be normalized and the result used as the value.)

The content of the response to a successful operation is the entire new value of the category, including its `values` array which now contains the newly added value or values as well as all the old values. From this, it is possible to obtain the server-assigned ID of the new value.

#### Change a value within a category

Because values are not directly addressable but only as part of the category they belong to, changing an existing value is very much like adding a new one. In both cases, this is done by a PUT to the category -- for example `PUT /directory/refdata/12345`. The difference is that in the case of changing an existing value, the `id` of that value is specified along with the new label or value. For example:

	{
	  "values": [
	    { "id": 43, "label": "Unknowable" }
	  ]
	}

The result of this _is supposed to be_ that the label of the Refdata value with ID 43 changes to "Unknowable".

XXX However, at present this does not work: instead, a new value is created (and is allocated a new ID), and both the old and new versions now exist in the category.

#### Delete a value from a category

Deletion is a special case. Once more, it is achieved by a `PUT` to the category, since the values are not individually adressable, but this time the value must be specified via ID, and the special `_delete` key must be provided with value `true`:

	{
	  "values": [
	    { "id": 6789, "_delete": true }
	  ]
	}

This should remove the value with ID 6789 from the category whose ID was specified in the PUT URL.

XXX However, at present this does not work: the value is not removed, and the whole category is returned unchanged in the response.

#### Combining operations on values

Because the addition, modification and deletion of values within a single category are all accomplished by a PUT to that category, it should be possible to perform compound operations in a single shot: adding some values, modifying others, and deleting yet others. For example, `PUT /directory/refdata/12345` with the following payload:

	{
	  "values": [
	    { "label": "Red" },
	    { "label": "Blue" },
	    { "label": "Yellow" },
	    { "id": 6789, label: "Cyan" },
	    { "id": 7890, "_delete": true },
	    { "id": 8901, "_delete": true }
	  ]
	}

Should add three new values with labels "Red", "Blue" and "Yellow"; change the label of existing value 6789 to "Cyan"; and delete two existing values, 7890 and 8901.

XXX I will test this once the Change and Delete bugs have been fixed.



## Syntactic sugar

Rather than having to search for a specific category by name using `/directory/refdata?filters=desc%3DDirectoryEntry.Status`, it is possible to use the more elegant URL `directory/refdata/DirectoryEntry/Status`. However, note the following restrictions:

* The response content consists on of the `values` array of the category, so the ID and description are not available.
* While it is possible to GET such URLs, it is not possible to PUT to it. In fact, the HTTP method and any request content is simply ignored and a GET performed.
* It is not possible to POST to such URLs in order to add values to the specific category.
* For some reason, the period in the description "Directoryentry.Status" becomes a forward slash in the path `/directory/refdata/DirectoryEntry/Status`. Among other things, this means that it is impossible to successfully use this syntax to access a category whose name contains a forward slash, such as "Yes/No/Other" above.

These limitations mean that the sugared version of the API is best not relied on for most purposes. It _is_ however useful when invoking `<ControlledVocab>` from stripes-smart-components, as the `baseURL` passed into that component must consist of a path only, and may not include query parameters.



