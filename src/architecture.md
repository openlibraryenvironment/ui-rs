# Architecture of a modern `<SearchAndSort>`-based app

<!-- md2toc -l 2 architecture.md -->
* [Introduction](#introduction)
* [Overview](#overview)
* [Implementation](#implementation)
    * [Callback functions received by `<SearchAndSort>`](#callback-functions-received-by-searchandsort)
    * [Rendering record details](#rendering-record-details)
    * [Creating a new record](#creating-a-new-record)
    * [Editing an existing record](#editing-an-existing-record)
    * [What's the deal with `detailProps`?](#whats-the-deal-with-detailprops)
* [Summary](#summary)
    * [By component](#by-component)
    * [By operation](#by-operation)
    * [Note](#note)
* [Appendix: is the `onSubmit` prop used in editing?](#appendix-is-the-onsubmit-prop-used-in-editing)


## Introduction

Over time, a set of conventions have emerged for how to build a FOLIO app based on the `<SearchAndSort>` framework. This document 


## Overview

The goal is to concentrate all use of mutators in a single source file -- namely, that of the top-level component representing the app (e.g. `ui-directory/src/routes/directory-entries.js` for the Directory application. This is in contrast to older arrangements of the source code, in which the PUT mutator used for record creation was in the top-level component, but the POST mutator used for editing was in the edit-record component.

In order to achieve this, it's necessary to pass a selection of callback functions down through `<SearchAndSort>` for it to pass through into the view-record and edit-record components.


## Implementation

### Callback functions received by `<SearchAndSort>`

The following `on*` props are functions:

* `onChangeIndex` -- passed down in `<SearchField>` as part of search rendering
* `onComponentWillUnmount` -- optional caller-specific unmounting code, to be run in addition to that of `<SearchAndSort>` itself.
* `onCreate` -- called from `createRecord` which is itself provided as callback in `renderCreateRecordLayer`: see below.
* `onFilterChange` -- optional caller-specific filter-changing code, to be run in addition to that of `<SearchAndSort>` itself.
* `onSelectRow` -- optional caller-specific row-selection code. If it returns a true value, the usual row-selection code is run.

### Rendering record details

The `renderRecordDetails` function renders the full record, when the relevant ID is specified in the URL, for `<SearchAndSort>` -- and the full record will itself include generally a button to edit the record. `renderRecordDetails` works by invoking the component specified by `props.viewRecordComponent`, and passing to it props including the following:

* `connectedSource`, which is a ConnectedSouce object for the stripes-connect or Apollo GraphQL source that data is taken from.
* `parentResources`, passed through from props.
* `parentMutator`, passed through from props.
* `detailProps` -- a set of additional properties which are passed individually into both the edit-record component (for record creation) and the view-record component.
* `onClose`, a callback provided by `<SearchAndSort>` for the view-record component to close its pane (which it does my modifying the URL path).
* `onEdit`, a callback provided by `<SearchAndSort>` for the view-record component to begin editing the viewed record (which it does by adding a `layer=edit` URL parameter)
* `onCloseEdit`, a callback provided by `<SearchAndSort>` for the edit layer to close itself (which it does by removing the `layer` URL parameter).

`detailProps` is a bit of an escape hatch, and warrants further analysis: see [below](XXX).

### Creating a new record

The `renderCreateRecordLayer` function renders the create-record layer, when the relevant layer is specific in the URL, for `<SearchAndSort>`. It does this by invoking the component specified by `props.editRecordComponent`, and passing to it props including the following:

* `connectedSource` -- (as above)
* `parentresources` -- (as above)
* `parentmutator` -- (as above)
* `detailProps` -- (as above)
* `onSubmit` is provided by `<SearchAndSort>` as the local method `createRecord`, which invokes `props.onCreate`.
* `onCancel` is provided by `<SearchAndSort>`.
* `initialValues`, is taken from `props.newRecordInitialValues`.

### Editing an existing record

This is an indirect operation of `<SearchAndSort>`: it displays the full record [as described above](#rendering-record-details), and it is down to the full-record display component to provide a way to invoke editing. It does this  by invoking the `onEdit` function that is passed as a prop, typically by means of a clickable item on on the action-menu or in the right-menu.

(Arguably, the component to use for editing should also be passed as a prop into the record-viewing component; but at present it is not, and it's not a big problem that the component for viewing a record of a specific type knows what component to use for editing a record od that same type.)

The view-record component's invocation of the edit-component record typically passes the following props:

* `onCancel` -- the `onCloseEdit` function passed in as a prop.
* `onSubmit` -- this seems to be unused. See [appendix](#appendix-is-the-onsubmit-prop-used-in-editing).
* `parentMutator` -- the mutator passed as `props.mutator` from `<SearchAndSort>`, which is the one passed _into_ `<SearchAndSort>`.
* `initialValues` -- a set of values representing the current state of the record to be edited.

### What's the deal with `detailProps`?

The `detailProps` property that can be passed into `<SearchAndSort>` is a set of additional properties which are passed individually into both the edit-record component (for record creation) and the view-record component. `<SearchAndSort>` itself does not use these properties at all: it merely passes them blindly into the view and edit components.

It can be used to pass _any_ props through to the edit and view components, in addition to those whose passing is explicitly supported. Arguably, no such escape-hatch should be provided, and all pass-through-able props should be explicitly supported; or alternatively, _all_ passing through should be done via `detailProps`. The present hybrid system is inelegant; and made worse by the fact that `<SearchAndSort>` also passes _all_ its own props through to the view component (though not the edit component). But this is another problem for another day.

The one important prop that is typically passed via `detailProps` is the `onUpdate` function: for example, this is the only prop passed in this way by ui-erm; ui-licenses also passes a prop specific to its own functioning. That said, other UI modules use it in various obscure ways which don't concern us here.

In ui-licenses, which is arguably our model, the top-level component file `Licences.js` defined a method `handleUpdate` which invokes the PUT mutator. This is passed into `<SearchAndSort>` as the `onUpdate` element of `detailProps`, whence it is furnished to `EditLicense.js` as the `onUpdate` prop. That callback function is invoked in the redux-form submit handler.


## Summary

### By component

Here are the key update-related props when using `<SearchAndSort>`, and their journey through the various components.

* In the top-level `<Licenses>` component:
  * the `handleCreate` method invokes the POST mutator and redirects to the newly created licence's page.
  * the `handleUpdate` method invokes the PUT mutator and updates some local state.

* In `<Licences>`'s invocation of `<SearchAndSort>`:
  * `this.handleCreate` is passed in as the `onCreate` prop
  * `this.handleUpdate` is instead passed as `detailProps.onUpdate`, since there is no `onUpdate` prop.

* Within `<SearchAndSort>`:
  * `props.onCreate` is invoked in a callback (`this.createRecord`) which is passed as the `onSubmit` prop to the edit components when a new record is to be created.
  * The contents of `props.detailProps` are passed through to both the edit-record component (irrelevantly for our purposes) and to the view-record component (to be used when editing the record) -- so `onUpdate` is included.

* Within the view-record component:
  * All props, including `detailProps`, are passed through to the edit-record component.
  * (`onSubmit` is also passed, but in error, and is ignored: see the Appendix.)

* Within the edit-record component:
  * _I think_ that the `onSubmit` function passed from `<SearchAndSort>` in the new-record case overrided the `onSubmit` defined in the redux-form invocation, and so becomes the submit handler. **XXX check this.**
  * The `props.onUpdate` function is invoked from `handleSubmit`, which is installed as the redux-form submit handler.

### By operation

This section is the same as the previous one but sliced at right-angles, so that we consider each operation (create and edit) on its journey through the various components.

* Record creation:

  * In `<Licences>`'s invocation of `<SearchAndSort>`, `this.handleCreate` is passed in as the `onCreate` prop.
  * Within `<SearchAndSort>`, `props.onCreate` is invoked in a callback (`this.createRecord`) which is passed as the `onSubmit` prop to the edit components when a new record is to be created.
  * Within the edit-record component: _I think_ that the `onSubmit` function passed from `<SearchAndSort>` in the new-record case overrides the `onSubmit` defined in the redux-form invocation, and so becomes the submit handler. **XXX check this.**
  * the `handleCreate` method in the top-level `<Licenses>` component invokes the POST mutator and redirects to the newly created licence's page.

* Record update:

  * In `<Licences>`'s invocation of `<SearchAndSort>`, `this.handleUpdate` is passed as `detailProps.onUpdate`.
  * Within `<SearchAndSort>`, `props.onUpdate` is passed through to the view-record component (since it is part of the contents of `props.detailProps`).
  * Within the view-record component, all props, including `onUpdate`, are passed through to the edit-record component.
  * Within the edit-record component, the `props.onUpdate` function is invoked from `handleSubmit`, which is installed as the redux-form submit handler.
  * the `handleUpdate` method in the top-level `<Licenses>` component invokes the PUT mutator and updates some local state.

### Note

(The `parentMutator` prop passed into `<SearchAndSort>` is directly used only to manipulate the URL query and the `resultCount` local resource. It does get passed into the edit component (via the view component in the case of editing an existing record) but is not needed there in the case where all the mutations are performed in the top-level component that has the manifest.)


## Appendix: is the `onSubmit` prop used in editing?

**Mike Taylor [6:00 PM]**  
Hey, Mark. Sorry to be dense, but can you help me out with one more piece of this jigsaw? In https://github.com/folio-org/ui-licenses/blob/5c97838ccdf4517a3c5e557647e7ec08537e9522/src/components/ViewLicense/ViewLicense.js#L150 we pass `this.handleSubmit` as the `onSubmit` prop of the editing component. But I can't see that `this.handleSubmit` is defined anywhere.  
Or ... is it that this neither defined nor used, because https://github.com/folio-org/ui-licenses/blob/5c97838ccdf4517a3c5e557647e7ec08537e9522/src/components/EditLicense/EditLicense.js#L9-L12 defines its own `handleSubmit`?  
If so, then line 150 of `ViewLicence.js` should simply be removed?



