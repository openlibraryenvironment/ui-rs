import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';

import { ConfirmationModal } from '@folio/stripes/components';
import { CalloutContext } from '@folio/stripes/core';

import { ActionList, required, parseErrorResponse, selectorSafe, useKintIntl, useMutateRefdataValue, useRefdata } from '@k-int/stripes-kint-components';

const propTypes = {
  afterQueryCalls: PropTypes.object,
  allowSpecial: PropTypes.bool,
  catchQueryCalls: PropTypes.object,
  desc: PropTypes.string,
  displayConditions: PropTypes.shape({
    create: PropTypes.bool,
    delete: PropTypes.bool,
    view: PropTypes.bool,
  }),
  intlKey: PropTypes.string,
  intlNS: PropTypes.string,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  labelOverrides: PropTypes.object,
  refdataEndpoint: PropTypes.string
};

const EditableRefdataList = ({
  afterQueryCalls,
  allowSpecial = false, // special characters will be directly stripped out of the value before it is sent to the backend
  catchQueryCalls,
  desc,
  /*
   * Set of extra booleans for controlling access to actions
   * edit/create/delete (View should be handled externally)
   * This will not overwrite "internal" behaviour, ie setting
   * delete to 'true' here would still not render a delete button
   * for an internal refdata value
   */
  displayConditions = {
    create: true,
    edit: true,
    delete: true,
  },
  intlKey: passedIntlKey,
  intlNS: passedIntlNS,
  label,
  labelOverrides = {}, // An object containing translation alternatives
  refdataEndpoint
}) => {
  const {
    create: createCondition = true,
    delete: deleteCondition = true,
    edit: editCondition = true
  } = displayConditions;

  /* A component that allows for editing of refdata values */
  const callout = useContext(CalloutContext);
  const kintIntl = useKintIntl(passedIntlKey, passedIntlNS);

  // fetch refdata values
  const { data: { 0: refdata } = {}, isLoading: isRefdataLoading } = useRefdata({
    desc,
    endpoint: refdataEndpoint,
    returnQueryObject: true
  });

  const [contentData, setContentData] = useState([]);
  const [deleteModal, setDeleteModal] = useState({
    visible: false,
    refdata: null,
  });

  const sortByLabel = (a, b) => (a.label.localeCompare(b.label));

  useEffect(() => {
    if (!isRefdataLoading) {
      setContentData(refdata?.values?.sort(sortByLabel) ?? []);
    }
  }, [isRefdataLoading, refdata]);

  // Edit and Create will use the same PUT mutation
  const { delete: deleteRefdataValue, put: editRefdataValue } = useMutateRefdataValue({
    afterQueryCalls: {
      delete: json => {
        setContentData(json?.values?.sort(sortByLabel) ?? []);
        if (afterQueryCalls?.delete) {
          afterQueryCalls.delete(json);
        }
      },
      put: json => {
        setContentData(json?.values?.sort(sortByLabel) ?? []);
        if (afterQueryCalls?.put) {
          afterQueryCalls.put(json);
        }
      }
    },
    catchQueryCalls: {
      // Default delete behaviour is to fire a callout, either with kint-components default message
      // or one provided in labelOverrides, which is passed the error message and refdata in question
      delete: async (err) => {
        const errorResp = await parseErrorResponse(err.response);
        callout.sendCallout({
          message: kintIntl.formatKintMessage({
            id: 'refdata.deleteRefdataValue.errorMessage',
            overrideValue: labelOverrides?.deleteError
          },
          {
            label: deleteModal?.refdata?.label,
            error: errorResp?.message
          }),
          type: 'error',
        });
      },
      ...catchQueryCalls // override defaults here
    },
    endpoint: refdataEndpoint,
    id: refdata?.id,
    queryParams: {
      delete: {
        enabled: !!refdata
      },
      put: {
        enabled: !!refdata
      }
    }
  });

  if (isRefdataLoading) {
    return 'loading';
  }

  // This is the function which will take a row in the table and assign the relevant actions to it
  const actionAssigner = () => {
    const actionArray = [];

    if (editCondition) {
      actionArray.push(
        {
          name: 'edit',
          label: kintIntl.formatKintMessage({
            id: 'edit',
            overrideValue: labelOverrides?.edit
          }),
          icon: 'edit',
          callback: (data) => editRefdataValue(data),
          ariaLabel: (data) => kintIntl.formatKintMessage(
            {
              id: 'refdata.editAriaLabel',
              overrideValue: labelOverrides?.editAriaLabel
            },
            { label: data?.label }
          ),
        }
      );
    }

    if (!refdata?.internal && deleteCondition) {
      actionArray.push({
        name: 'delete',
        label: kintIntl.formatKintMessage({
          id: 'delete',
          overrideValue: labelOverrides?.delete
        }),
        icon: 'trash',
        callback: (data) => setDeleteModal({ visible: true, refdata: data }),
        ariaLabel: (data) => kintIntl.formatKintMessage(
          {
            id: 'refdata.deleteAriaLabel',
            overrideValue: labelOverrides?.deleteAriaLabel
          },
          { label: data?.label }
        ),
      });
    }
    return actionArray;
  };

  return (
    <>
      <ActionList
        actionAssigner={actionAssigner}
        columnMapping={{
          label: kintIntl.formatKintMessage({
            id: 'refdata.label',
            overrideValue: labelOverrides?.label
          }),
          value: kintIntl.formatKintMessage({
            id: 'refdata.value',
            overrideValue: labelOverrides?.value
          }),
        }}
        contentData={contentData}
        createCallback={
          (!createCondition || refdata?.internal) ?
            null :
            (data) => {
              if (allowSpecial) {
                editRefdataValue(data);
              } else {
                editRefdataValue({ ...data, value: selectorSafe(data?.value)?.replaceAll('%20', ' ') });
              }
            }
        }
        editableFields={{
          value: () => false
        }}
        hideActionsColumn={!deleteCondition && !editCondition}
        hideCreateButton={!createCondition}
        label={label}
        validateFields={{
          label: required
        }}
        visibleFields={['label', 'value']}
      />
      <ConfirmationModal
        confirmLabel={
          kintIntl.formatKintMessage({
            id: 'delete',
            overrideValue: labelOverrides?.delete
          })
        }
        heading={
          kintIntl.formatKintMessage({
            id: 'refdata.deleteRefdataValue',
            overrideValue: labelOverrides?.deleteRefdataValue
          })
        }
        message={
          kintIntl.formatKintMessage({
            id: 'refdata.deleteRefdataValue.confirmMessage',
            overrideValue: labelOverrides?.deleteRefdataValueMessage
          }, { name: deleteModal?.refdata?.label })
        }
        onCancel={() => setDeleteModal({ visible: false, refdata: null })}
        onConfirm={() => {
          deleteRefdataValue(deleteModal?.refdata?.id);
          setDeleteModal({ visible: false, refdata: null });
        }}
        open={deleteModal?.visible}
      />
    </>
  );
};

EditableRefdataList.propTypes = propTypes;

export default EditableRefdataList;
