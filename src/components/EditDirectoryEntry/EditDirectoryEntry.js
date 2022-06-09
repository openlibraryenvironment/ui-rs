import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { Prompt } from 'react-router-dom';

import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import {
  Button,
  ConfirmationModal,
  IconButton,
  Layout,
  Pane,
  PaneMenu,
} from '@folio/stripes/components';

import permissionToEdit from '../../util/permissionToEdit';
import { pluginMap } from '../../util/pluginMap';
import getRefdataValuesFromParentResources from '../../util/getRefdataValuesFromParentResources';
import DirectoryEntryForm from '../DirectoryEntryForm';

const defaultSubmit = (directory, dispatch, props) => {
  return props.onUpdate(directory)
    .then(() => props.onCancel());
};

const EditDirectoryEntry = (props) => {
  // Destructure this separately because onSubmit appears to take the entirety of props atm...?
  const {
    initialValues,
    onCancel,
    onSubmit = defaultSubmit,
    resources,
    stripes,
    parentResources
  } = props;
  const ky = useOkapiKy();

  const { mutateAsync: validate } = useMutation(
    ['@reshare/ui-directory', 'validateDirectoryEntry'],
    (data) => ky.post(`directory/entry/validate`, { json: data }).json()
  );

  const [rootWarning, setRootWarning] = useState(false);
  const [warnings, setWarnings] = useState([]);

  const intl = useIntl();

  const layer = resources?.query?.layer ?? parentResources?.query?.layer;

  const renderFirstMenu = () => {
    return (
      <PaneMenu>
        <FormattedMessage id="ui-directory.closeNewDirectoryEntry">
          {ariaLabel => (
            <IconButton
              icon="times"
              id="close-directory-form-button"
              onClick={onCancel}
              aria-label={ariaLabel[0]}
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  };

  const renderLastMenu = (invalid, pristine, submitting, submit, values) => {
    let id;
    let label;
    if (layer === 'edit') {
      id = 'clickable-update-directory-entry';
      label = <FormattedMessage id="ui-directory.updateDirectoryEntryNoName" />;
    } else {
      id = 'clickable-create-directory-entry';
      label = <FormattedMessage id="ui-directory.create" />;
    }

    return (
      <PaneMenu>
        <Button
          id={id}
          disabled={pristine || submitting || invalid}
          onClick={async () => {
            const submitFunc = await getSubmitWithValidateStep(submit, values)
            submitFunc();
          }} // Calculate proper submit function and execute
          buttonStyle="primary paneHeaderNewButton"
          marginBottom0
        >
          {label}
        </Button>
      </PaneMenu>
    );
  };

  // Insert validate step into submit calls to check whether or not to raise a confirmation modal
  // Returns a submit function.
  const getSubmitWithValidateStep = async (submit, values) => {
    // If this is a root entry, check validation and then raise warning modal
    // For now the only validations we care about happen on root entries,
    // so we can avoid a POST call otherwise. This may change in future.
    if (layer === 'create') {
      const validation = await validate(values);

      // TODO in future we may also pass validation.errors.
      // Those should also be handled in this logic, eg slug is not unique pre-attempt to POST
      if (validation?.warnings?.length) {
        setWarnings(validation.warnings?.map(warning => <FormattedMessage id={`ui-directory.directoryEntry.warning.${warning}`} />));
        return () => setRootWarning(true);
      }
    }
    
    // If none of the above applies, just return submit function as is
    return submit;
  };

  const selectPlugin = (domain) => {
    if (!domain) {
      return undefined;
    }

    const plugin = pluginMap[domain] ?? pluginMap.Generic;

    if (!plugin) {
      throw new Error(intl.formatMessage({ id: 'ui-directory.information.addresses.missingPlugin' }));
    }
    return plugin;
  };

  let paneTitle = <FormattedMessage id="ui-directory.notSet" />;
  switch (layer) {
    case 'edit':
      if (initialValues && initialValues.id) {
        paneTitle = <FormattedMessage id="ui-directory.updateDirectoryEntry" values={{ dirent: initialValues.name }} />;
      } else {
        paneTitle = <FormattedMessage id="ui-directory.updateDirectoryEntryNoName" />;
      }
      break;
    case 'unit':
      paneTitle = <FormattedMessage id="ui-directory.createUnitDirectoryEntry" />;
      break;
    case 'create':
      paneTitle = <FormattedMessage id="ui-directory.createDirectoryEntry" />;
      break;
    default:
      break;
  }

  if (!permissionToEdit(stripes, initialValues) && !stripes.hasPerm('ui-directory.create')) {
    // Users should never see this message, so no need to internationalize
    return 'no perm';
  }


  // TODO this seems like terrible code...
  // This allows the initial values to hold the current parent value
  if (initialValues) {
    initialValues.parent = initialValues.parent?.id ?? initialValues.parent;
    initialValues.type = initialValues.type?.id ?? initialValues.type;

    if (initialValues.services) {
      const newServices = [];
      initialValues.services.forEach(serviceacct => {
        newServices.push({ ...serviceacct, service: serviceacct.service.id });
      });
      initialValues.services = newServices;
    }

    // This part will set up the initialValues for the address in the form
    initialValues.addresses = initialValues.addresses?.map(address => {
      const plugin = selectPlugin(address.countryCode);
      const addressFields = plugin.backendToFields(address);

      return ({
        ...address,
        ...addressFields
      });
    });
  }

  // the submit handler passed in from SearchAndSort expects props as provided by redux-form
  const compatSubmit = values => {
    // Not submitting values itself because then on failure data changes shape
    const submitValues = { ...values };

    // When creating a NEW entry we want to set status to managed, but when editing an existing one we want to leave alone
    if (layer === 'create' || layer === 'unit') {
      // When creating a root or new entry, the layer is "create" or "unit", else layer is "edit"
      const managedStatus = getRefdataValuesFromParentResources(parentResources, 'DirectoryEntry.Status')
        .filter(obj => obj.label === 'Managed')[0] || {};
      submitValues.status = managedStatus.value;
    }

    if (values.parent) {
      submitValues.parent = { id: values.parent };
    }

    if (values.services) {
      const newServices = [];
      values.services.forEach(serviceacct => {
        newServices.push({ ...serviceacct, service: { id: serviceacct.service } });
      });
      submitValues.services = newServices;
    }

    submitValues.symbols = values.symbols?.map(obj => (obj?.authority?.id ? obj : ({ ...obj, authority: { id: obj.authority } })));

    if (submitValues.addresses) {
      const newAddresses = [];
      submitValues.addresses.forEach((address) => {
        if (address._delete === true) {
          // If we're deleting the address we can just leave it as is
          newAddresses.push(address);
        } else {
          const plugin = selectPlugin(address.countryCode);
          const newAddress = plugin.fieldsToBackend(address);
          // The plugins do not have the notion of seq
          // so we obtain their fieldOrder and add that manually
          const fieldOrder = plugin.fieldOrder;
          newAddress.lines.forEach(line => {
            const lineType = line.type?.value;
            line.seq = fieldOrder[lineType];
          });
          newAddresses.push(newAddress);
        }
      });
      submitValues.addresses = newAddresses;
    }
    onSubmit(submitValues, null, props);
  };

  return (
    <Form
      onSubmit={compatSubmit}
      initialValues={initialValues}
      keepDirtyOnReinitialize
      mutators={{
        ...arrayMutators,
      }}
    >
      {({ form, handleSubmit, invalid, pristine, submitting, submitSucceeded, values }) => (
        <>
          <form id="form-directory-entry">
            <Pane
              defaultWidth="100%"
              firstMenu={renderFirstMenu()}
              lastMenu={renderLastMenu(invalid, pristine, submitting, handleSubmit, values)}
              paneTitle={paneTitle}
            >
              <Layout className="centered" style={{ maxWidth: '80em' }}>
                <DirectoryEntryForm values={values} form={form} {...props} />
                <FormattedMessage id="ui-directory.confirmDirtyNavigate">
                  {prompt => <Prompt when={!pristine && !(submitting || submitSucceeded)} message={prompt[0]} />}
                </FormattedMessage>
              </Layout>
            </Pane>
          </form>
          <ConfirmationModal
            heading={<FormattedMessage id="ui-directory.directoryEntry.confirmationModal.header" />}
            message={
              <>
                <strong><FormattedMessage id="ui-directory.directoryEntry.confirmationModal.message" /></strong>
                {warnings.map(warning => <div>{warning}</div>)}
              </>
            }
            onCancel={() => {
              setRootWarning(false); // Close modal
              setWarnings([]); // Reset warnings
            }}
            onConfirm={() => {
              handleSubmit(); // Submit entry
              setRootWarning(false); // Close modal
              setWarnings([]); // Reset warnings
            }}
            open={rootWarning}
          />
        </>
      )}
    </Form>
  );
};

EditDirectoryEntry.propTypes = {
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  onUpdate: PropTypes.func.isRequired,
  parentResources:PropTypes.shape({
    query: PropTypes.shape({
      layer: PropTypes.string,
    }),
  }),
  resources: PropTypes.shape({
    query: PropTypes.shape({
      layer: PropTypes.string,
    }),
  }),
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
  }).isRequired,
};

export default EditDirectoryEntry;
