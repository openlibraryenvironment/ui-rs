# Making sense of the directory-entry structure


## Introduction

There are several sources of truth regarding the directory-entry structure that the code in this directory is trying to provide a UI for:

1. [The JSON Schema in mod-directory](https://github.com/openlibraryenvironment/mod-directory/blob/master/ramls/dirent.json)
2. [The Grovvy data-model that this is based on](https://github.com/openlibraryenvironment/mod-directory/blob/master/service/grails-app/domain/org/olf/okapi/modules/directory/DirectoryEntry.groovy)
3. The actual records that come back from the service

The first of these is most definitive, but not easy to read if you're not used to the code conventions. The JSON Schema is, or should be, the most explicit statement of structure, but it's rather incomplete and out of date, so not hugely useful. Ultimately, the data that comes back from the service is reality, so when a data field is present in such a response that's the best guide of all.


## Fields

In the following table, "Kind" indicates what can be inferred about the field's type from a combination of the JSON Schema and actual responses; "Response 1" indicates what is included in the whole-record response for a top-level institution such as DIKU; and "Response 2" indicates what is included in for a branch such as Allegheny College Annex Library.

Field                | Kind      | In JSON Schema?  | Response 1 | Response 2 | In UI?
------               | --------- | ---------------  | ---------- | ---------- | ------
`addresses`          | array     | --               | Y          | empty      | Y
`announcements`      | structure | --               | empty      | empty      |
`customProperties`   | structure | (See below)      | Y          | empty      | Y
`description`        | scalar    | string           | Y          |            | Y
`entries`            | array     | --               | Y          |            | Y
`friends`            | array     | (See below)      | empty      | empty      |
`fullyQualifiedName` | scalar    | --               | Y          | Y          | Y
`id`                 | scalar    | string           | Y          | Y          | _Not needed_
`items`              | array     | --               |            |            | _Probably superseded by `entries`_
`name`               | scalar    | string           | Y          | Y          | Y
`parent`             | structure | --               |            | Y          | Y
`services`           | structure | --               | Y          |            | Y
`slug`               | scalar    | string           | Y          | Y          | Y
`status`             | structure | object           | Y          |            | Y
`symbolSummary`      | scalar    | --               | null       | null       | Y
`symbols`            | array     | (See below)      | empty      | empty      | _redundant_
`tagSummary`         | scalar    | --               | Y          | Y           | Y
`tags`               | array     | (See below)      | Y          | Y          | _redundant_
`units`              | array     | (See below)      |            |            | _Probably omitted to prefer `entries`_


## Notes

* `customProperties`: although the JSON Schema describes this only as an object, a comment adds: "Custom properties are a runtime defined set of name:value pairs, where values are themselves arbitrarily scalar types or complex objects."

* `entries`, `items` and `units` all seem to be alternative names for the same thing, the list of child institutions (i.e. those of which the current institution is the parent). This was originally called `items` and was (I think) intended to be renamed `units`, but got accidentally renamed `entries` instead.

* `friends`: described in the JSON Schema as an array of `Friend`, which defined as an object in which the only defined field is the string `id`. No example data yet.

* `symbols`: described in the JSON Schema as an array of `Symbol`, which defined as an object with string fields `id`, `authority` and `priority`, and a `symbol` field which can be either a string of an `Authority`. The latter is defined as an object with string fields `id` and `symbol`.

* `tags`: described in the JSON Schema as an array of elements each of which can be either a string or a `Tag`; the latter is defined as an object in which the only defined field is the string `id`.


## To Do

* Check all translation-key names and make consistent.
* Update mod-directory and switch from `entries` to `units`.
* Update this document.
* Support the `announcements` array when it becomes available.
* Support the `friends` array when it becomes available.


