# API to the Refdata system

<!-- md2toc -l 2 refdata-api.md -->
* [Introduction](#introduction)
* [Concepts](#concepts)
* [Operations](#operations)
    * [List and search for categories](#list-and-search-for-categories)
    * [Create a new category](#create-a-new-category)
    * [Delete a category](#delete-a-category)
    * [Add values to an existing category](#add-values-to-an-existing-category)
    * [Change a value within a category](#change-a-value-within-a-category)
    * [Delete a value from a category](#delete-a-value-from-a-category)
* [Syntactic sugar](#syntactic-sugar)



## Introduction

Refdata is a system implemented by several of Knowledge Integration's back-end modules (e.g. [mod-rs](https://github.com/openlibraryenvironment/mod-rs), [mod-directory](https://github.com/openlibraryenvironment/mod-directory)) to maintain sets of values (called _categories_) that may be adopted by fields in application-level records. Such fields can be restricted to accept only values that are part of the relevant Refdata category.

This document describes the API for creating new categories, adding new values to them, and editing and deleting existing values. All this is based on informal discussions with Steve Osguthorpe.

Examples can be invoked using the `okapi-cmd` command-line utility provided in the `scripts` area of mod-directory. For example:

```shell
$ mod-directory/scripts/okapi-cmd /directory/refdata/DirectoryEntry/Status
```
Or, if the default Okapi URL, tenant, username and password are not as required, then more verbosely:

```shell
$ mod-directory/scripts/okapi-cmd -o https://okapi-reshare.apps.k-int.com -t reshare -u admin -p rE0gNx7m2o /directory/refdata/DirectoryEntry/Status
```



## Concepts

The basic unit of Refdata is the _category_. A category has a unique ID (assigned by the system at creation time), a description, and a set of zero or more _values_. A value consists of two things: the value itself, which is intended to be machine-readable, and a human-readable value.

Values have no existence outside the context of a specific category. For this reason, there is no CRUD API for values: it's not possible to make a new value by POSTing it, nor to modify or delete an existing value by PUTting or DELETEing it. Instead, it's necessary to make changes to the category that the value belongs to.

The endpoint for managing each module's Refdata is `refdata` at the top level within the module's own namespace: so for example, the Directory module's Refdata is at `/directory/refdata`, and the Resource Sharing module's Refdata is at `/rs/refdata`. The examples in this document all pertain to the Directory module.



## Operations


### List and search for categories

`GET /directory/refdata` will return all Refdata categories (including their values).

This endpoint optionally takes a `filters` parameter, whose value is a query such as `desc=DirectoryEntry.Status`. We can therefore list only the DirectoryEntry.Status values using `GET "/directory/refdata?filters=desc%3DDirectoryEntry.Status"` -- or indeed `GET "/directory/refdata?filters=id%3D8a0081826a921974016a96daa1980000"`, though you need to know the ID for that.

For more detail on how to use `filters`, see [the **Searching and filtering DirectoryEntry records** section of _DirectoryEntry Resources_](https://github.com/openlibraryenvironment/mod-directory/blob/master/doc/entry.md#searching-and-filtering-directoryentry-records).


### Create a new category

XXX


### Delete a category

XXX You shouldn't be able to delete a category with a value that is used by something somewhere. But if it is a new category that you haven't used... Then I would expect it to work.


### Add values to an existing category

XXX


### Change a value within a category

XXX


### Delete a value from a category

XXX



## Syntactic sugar

XXX
.



# NOTES

I think the refdata controller will allow you to do what you want. The subject is the Category.To add a new category all together with values (probably not useful, but I'll include for completeness.
POST to `/refdata`

	{
	  "desc":"Yes/No/Other", 
	  "values":[
	    { "value":"yes", "label":"Yes" },
	    { "value":"no", "label":"No" },
	    { "value":"other", "label":"Other (see notes)" }
	  ]
	}

The "value" is optional and if omitted the label will be normalized.To add a value to an existing category (remembering that all puts in grails are patch-like. You could.PUT /refdata/{category ID}

	{
	  "values":[
	    {"label" : "Unknown" }
	  ]
	}


Where does the categoryId come from in this scenario? There doesn't seem to be one in the new category that I post to `/refdata`.
Steve Osguthorpe   [1 hour ago]
If you post a new category do you not receive the created object with an ID?
Mike Taylor   [1 hour ago]
Ah, I see.
Steve Osguthorpe   [1 hour ago]
ID's should be created on the fly. (edited)
Mike Taylor   [1 hour ago]
So the sequence is that I POST `{"desc": "Mike's category"}` to `/refdata`, and the message body that comes back in the 201 Created response includes `{"dect": "Mike's category", "id": "2345"}`?
Steve Osguthorpe   [1 hour ago]
HOwever if you are creatinga category complete with values just  PUT the values with the category fields.
Mike Taylor   [1 hour ago]
(I won't be doing it that way.)
Steve Osguthorpe   [1 hour ago]
OK.
Steve Osguthorpe   [1 hour ago]
Then yes.
Mike Taylor   [1 hour ago]
And once I have done this initial operation, I can POST new values to `/refdata/12345`, only I due to some Grails brain-damage I have to lie to the server and call it a PUT instead.
Steve Osguthorpe   [45 minutes ago]
You would `PUT` any changes to the `Category` (this includes any changes to it's values) to `/refdata/categoryID`. Values are not allowed to be put on their own as they always need a parent.
`PUT /refdata/2345`

     ```{
      "values":[
        {"label" : "Unknown" }
      ]
    }```

would add a single new value with a label of "Unknown" to the category identified by 12345
You do not need to include the full category object as it treats what you send as changes.
Steve Osguthorpe   [45 minutes ago]
You can not and should not be able to POST/PUT/DELETE a RefdataValue
Steve Osguthorpe   [44 minutes ago]
As a first class resource. As they are not treated as such. (edited)
Mike Taylor   [43 minutes ago]
This is both helpful and horrifying :slightly_smiling_face: (edited)
Mike Taylor   [42 minutes ago]
So are you saying that PUT will _add_ a value? Not replace the existing set of values?
Steve Osguthorpe   [30 minutes ago]
Well...
Databinding targets anything with an ID. So you can still edit them but the Category is still the source.PUT `/refdata/12345`

    ```{
      "values":[
        {"id":43, "label" : "Unknown" }
      ]
   }```

This would change the label of refdataValue with ID: 43 to "Unknown"
Steve Osguthorpe   [29 minutes ago]
Basically the idea is that there is always a parent context.
Steve Osguthorpe   [29 minutes ago]
In this case it is Category
Steve Osguthorpe   [29 minutes ago]
This allows us to contain all the cahnges into a single transaction
Steve Osguthorpe   [28 minutes ago]
Then if validation fails on a nested relationship you can roll back the whole database transaction
Steve Osguthorpe   [28 minutes ago]
And not commit partial data
Steve Osguthorpe   [27 minutes ago]
Being able to collect changes and send them in a single payload also means edits are un-doable before sent etc, etc
Steve Osguthorpe   [26 minutes ago]
It limits churn.
Mike Taylor   [18 minutes ago]
OK, thanks. This makes sense in its own terms, even if it's not what I wanted to hear :slightly_smiling_face:
Mike Taylor   [17 minutes ago]
I guess the way to go is to make a Stripes settings page that can be used to maintain _all_ refdata values. But I won't be able to use all that much from existing components that we use for _apparently_ similar controlled-vocab maintenance.
Mike Taylor   [17 minutes ago]
Last practical question: how can I delete a value from a category?
Steve Osguthorpe   [15 minutes ago]
Yeah I had to invent something there....

```{ "values": [ { "id":2345, "_delete": true } ] }```

Would remove refdataValue id 2345. (edited)
Steve Osguthorpe   [14 minutes ago]
Collections are additive because in many of the relationship we have thousands of related rows. We don't want to have to put the whole thing back to remove one.