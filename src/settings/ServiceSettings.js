import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';
import {
  Callout,
  Pane,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';

import ServiceListFieldArray from './components/ServiceListFieldArray';

class ServiceSettings extends React.Component {
  static manifest = Object.freeze({
    services: {
      type: 'okapi',
      path: 'directory/service',
      params: {
        filters: 'status.value=managed',
        perPage: '100',
        sort: 'id'
      },
      throwErrors: false,
      resourceShouldRefresh: true,
    },
    type: {
      type: 'okapi',
      path: 'directory/refdata?filters=desc=Service.Type',
    },
    businessFunction: {
      type: 'okapi',
      path: 'directory/refdata?filters=desc=Service.BusinessFunction',
    },
    direntStatus: {
      type: 'okapi',
      path: 'directory/refdata?filters=desc=DirectoryEntry.Status',
    },
  });

  static propTypes = {
    mutator: PropTypes.shape({
      services: PropTypes.shape({
        DELETE: PropTypes.func.isRequired,
        POST: PropTypes.func.isRequired,
        PUT: PropTypes.func.isRequired
      }).isRequired
    }).isRequired,
    resources: PropTypes.shape({
      services: PropTypes.object,
    }),
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
  };

  sendCallout = (operation, outcome, error = '', custPropName = '') => {
    this.callout.sendCallout({
      type: outcome,
      message: (
        <FormattedMessage
          id={`ui-directory.settings.services.callout.${operation}.${outcome}`}
          values={{ error, name: custPropName }}
        />
      ),
      timeout: error ? 0 : undefined, // Don't autohide callouts with a specified error message.
    });
  };

  sendCalloutInUse = (serviceName) => {
    return this.callout.sendCallout({
      type: 'error',
      message: (
        <FormattedMessage id="ui-directory.settings.services.callout.delete.serviceInUse" values={{ name: serviceName }} />
      ),
      timeout: 0,
    });
  };

  submitPromise = (service, reinitialize) => {
    const mutator = this.props.mutator.services;
    const promise = service.id ?
      mutator.PUT(service) :
      mutator.POST(service)
        .then(reinitialize());
    return promise;
  }

  handleSubmit = (service, reinitialize) => {
    const { resources: { direntStatus: { records: { 0: { values: managedValues = [] } = {} } } = [] } } = this.props;
    const managed = managedValues.filter(obj => obj.label === 'Managed')[0] || {};
    service.status = managed.value;

    return this.submitPromise(service, reinitialize)
      .then(() => this.sendCallout('save', 'success', '', service?.name))
      .catch(response => {
        // Attempt to show an error message if we got JSON back with a message.
        // If json()ification fails, show the generic error callout.
        response
          .json()
          .then(error => this.sendCallout('save', 'error', error.message, service?.name))
          .catch(() => this.sendCallout('save', 'error', '', service?.name));

        // Return a rejected promise to break any downstream Promise chains.
        return Promise.reject();
      });
  }

  handleDelete = (service, reinitialize) => {
    const mutator = this.props.mutator.services;
    return mutator.DELETE(service)
      .then(reinitialize())
      .then(() => this.sendCallout('delete', 'success', '', service?.name))
      .catch(response => {
        // Attempt to show an error message if we got JSON back with a message.
        // If json()ification fails, show the generic error callout.
        response
          .json()
          .then(error => {
            const pattern = new RegExp(
              'violates foreign key constraint.*is still referenced from table',
              's'
            );
            if (pattern.test(error.message)) {
              this.sendCalloutInUse(service?.name);
            } else {
              this.sendCallout('delete', 'error', error.message, service?.name);
            }
          })
          .catch(() => this.sendCallout('delete', 'error', '', service?.name));

        // Return a rejected promise to break any downstream Promise chains.
        return Promise.reject();
      });
  }

  render() {
    const { resources: {
      services: { records: serviceRecords } = [],
      type : { records: { 0: { values: typeValues } = {} } } = [],
      businessFunction: { records: { 0: { values: businessFunctionValues } = {} } } = []
    } } = this.props;

    // We need to store the IDs of the refdata values rather than objects
    const initialValues = { 'services': serviceRecords?.map(obj => ({ ...obj, type: obj.type?.id, businessFunction: obj.businessFunction?.id })) };
    return (
      <Form
        onSubmit={this.handleSubmit}
        initialValues={initialValues}
        keepDirtyOnReinitialize
        mutators={{
          setServiceValue: (args, state, tools) => {
            tools.changeValue(state, args[0], () => args[1]);
          },
          ...arrayMutators
        }}
        subscription={{ meta: true, value: true }}
        navigationCheck
      >
        {({ form }) => {
          return (
            <>
              <Pane
                defaultWidth="fill"
                id="services"
                paneTitle={<FormattedMessage id="ui-directory.settings.services" />}
              >
                <form>
                  <FieldArray
                    component={ServiceListFieldArray}
                    name="services"
                    onSave={service => this.handleSubmit(service, form.initialize)}
                    onDelete={service => this.handleDelete(service, form.initialize)}
                    mutators={form.mutators}
                    data={{
                      functions: businessFunctionValues,
                      types: typeValues
                    }}
                    initialValues={initialValues}
                  />
                </form>
                <Callout
                  ref={ref => {
                    this.callout = ref;
                  }}
                />
              </Pane>
            </>
          );
        }}
      </Form>
    );
  }
}

export default stripesConnect(ServiceSettings);
