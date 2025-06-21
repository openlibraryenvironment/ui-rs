import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import { injectIntl, FormattedMessage } from 'react-intl';
import { stripesConnect, useStripes } from '@folio/stripes/core';
import { Button, Col, Label, Layout, Modal, ModalFooter, Row, Select, TextArea, TextField } from '@folio/stripes/components';
import { RefdataButtons, useIsActionPending } from '@projectreshare/stripes-reshare';
import { required } from '@folio/stripes/util';
import { CancelModalButton } from '../../ModalButtons';
import { useModal } from '../../MessageModalState';

import { REFDATA_ENDPOINT } from '../../../constants/endpoints';

const AddCondition = props => {
  const { request, performAction, resources: { refdatavalues } } = props;
  const actionPending = !!useIsActionPending(request.id);
  const [currentModal, setModal] = useModal();
  const closeModal = () => setModal(null);
  const stripes = useStripes();

  const onSubmit = values => {
    return performAction('supplierAddCondition', { ...values, costCurrency: stripes.currency }, {
      error: 'ui-rs.actions.addCondition.error',
      success: 'ui-rs.actions.addCondition.success',
    })
      .then(closeModal);
  };

  const Footer = ({ disableSubmit, submit }) => (
    <ModalFooter>
      {/* These appear in the reverse order? */}
      <Button buttonStyle="danger" onClick={submit} disabled={disableSubmit}>
        <FormattedMessage id="ui-rs.actions.addCondition" />
      </Button>
      <CancelModalButton><FormattedMessage id="ui-rs.button.goBack" /></CancelModalButton>
    </ModalFooter>
  );
  Footer.propTypes = {
    disableSubmit: PropTypes.bool,
    submit: PropTypes.func.isRequired,
  };
  const listOfConditions = refdatavalues ? refdatavalues.records.filter(obj => obj.desc === 'loanConditions').map(obj => obj.values)[0] : [];

  const { formatMessage } = props.intl;
  const displayId = request.hrid ? request.hrid : request.id;
  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting, pristine, form }) => (
        <form onSubmit={handleSubmit}>
          <Modal
            label={<FormattedMessage id="ui-rs.actions.conditionalSupply" />}
            open={currentModal === 'AddCondition'}
            onClose={closeModal}
            dismissible
            footer={<Footer disableSubmit={submitting || pristine || actionPending} submit={form.submit} />}
          >
            <FormattedMessage id="ui-rs.actions.conditionalSupply.confirm" values={{ id: displayId, item: request.title }} />
            <Row>
              <Col xs={6}>
                <Layout className="padding-bottom-gutter padding-top-gutter">
                  <Label>
                    <FormattedMessage id="ui-rs.actions.conditionalSupply.condition" />
                  </Label>
                  <Field
                    name="loanCondition"
                    component={RefdataButtons}
                    dataOptions={listOfConditions}
                    labelTranslations={{ key: 'ui-rs.settings.customiseListSelect.loanConditions' }}
                    maxCols={1}
                    required
                    validate={required}
                  />
                </Layout>
                <Field
                  name="cost"
                  label={<FormattedMessage id="ui-rs.flow.loanConditions.cost" />}
                  component={TextField}
                />
              </Col>
              <Col xs={6}>
                <Layout className="padding-top-gutter">
                  <strong><FormattedMessage id="ui-rs.actions.addNote" /></strong>
                </Layout>
                <Row>
                  <Col xs={11}>
                    <Field name="note" component={TextArea} autoFocus />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Layout className="padding-top-gutter">
              <strong><FormattedMessage id="ui-rs.actions.conditionalSupply.holdingState" /></strong>
            </Layout>
            <Field
              name="holdingState"
              component={Select}
              placeholder={formatMessage({ id: 'ui-rs.actions.conditionalSupply.holdingState.select', defaultMessage: 'Select "Yes" or "No"' })}
              dataOptions={[
                { value: 'yes', label: formatMessage({ id: 'ui-rs.actions.conditionalSupply.holdingState.yes', defaultMessage: 'yes' }) },
                { value: 'no', label: formatMessage({ id: 'ui-rs.actions.conditionalSupply.holdingState.no', defaultMessage: 'no' }) }
              ]}
              initialValue="yes"
              required
              validate={required}
            />
          </Modal>
        </form>
      )}
    />
  );
};

AddCondition.manifest = {
  refdatavalues: {
    type: 'okapi',
    path: REFDATA_ENDPOINT,
    params: {
      max: '500',
    },
  }
};

AddCondition.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired
  }),
  request: PropTypes.object.isRequired,
  performAction: PropTypes.func.isRequired,
  resources: PropTypes.shape({
    refdatavalues: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        desc: PropTypes.string,
        values: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.string,
          value: PropTypes.string,
          label: PropTypes.string,
        })),
      })),
    }),
  })
};

export default stripesConnect(injectIntl(AddCondition));
