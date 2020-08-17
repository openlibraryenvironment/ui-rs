import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import { injectIntl, FormattedMessage } from 'react-intl';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import { stripesConnect } from '@folio/stripes/core';
import { RefdataButtons } from '@folio/stripes-reshare';
import { Button, Col, Layout, Modal, ModalFooter, Row, TextArea } from '@folio/stripes/components';
import { required } from '@folio/stripes/util';
import { ActionContext } from '../ActionContext';
import { CancelModalButton } from '../../ModalButtons';
import { useModal } from '../../MessageModalState';

const CannotSupply = props => {
  const { request, performAction, resources: { refdatavalues } } = props;
  const [actions] = useContext(ActionContext);
  const [currentModal, setModal] = useModal();

  const onSubmit = values => {
    return performAction(
      'supplierCannotSupply',
      values,
      'ui-rs.actions.cannotSupply.success',
      'ui-rs.actions.cannotSupply.error',
    )
      .then(() => setModal(null))
      // Currently displaying errors with this via the route-level MessageBanner rather than within the modal
      .catch(() => setModal(null));
  };

  const Footer = ({ disableSubmit, submit }) => (
    <ModalFooter>
      {/* These appear in the reverse order? */}
      <Button buttonStyle="danger" onClick={submit} disabled={disableSubmit}>
        <FormattedMessage id="ui-rs.actions.cannotSupply" />
      </Button>
      <CancelModalButton><FormattedMessage id="ui-rs.button.goBack" /></CancelModalButton>
    </ModalFooter>
  );
  Footer.propTypes = {
    disableSubmit: PropTypes.bool,
    submit: PropTypes.func.isRequired,
  };
  const listOfReasons = refdatavalues ? refdatavalues.records.filter(obj => obj.desc === 'cannotSupplyReasons').map(obj => obj.values)[0] : [];

  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting, pristine, form }) => (
        <form onSubmit={handleSubmit}>
          <Modal
            label={<FormattedMessage id="ui-rs.actions.cannotSupply" />}
            open={currentModal === 'CannotSupply'}
            footer={<Footer disableSubmit={submitting || pristine || actions.pending} submit={form.submit} />}
          >
            <SafeHTMLMessage id="ui-rs.actions.cannotSupply.confirm" values={{ id: request.id, item: request.title }} />
            <Layout className="padding-top-gutter">
              <strong><FormattedMessage id="ui-rs.actions.cannotSupply.reason" /></strong>
            </Layout>
            <Row>
              <Col>
                <Field
                  name="reason"
                  component={RefdataButtons}
                  dataOptions={listOfReasons}
                  labelTranslations={{ key: 'ui-rs.settings.customiseListSelect.cannotSupplyReasons' }}
                  maxCols={1}
                  required
                  validate={required}
                />
              </Col>
            </Row>
            <Layout className="padding-top-gutter">
              <strong><SafeHTMLMessage id="ui-rs.actions.addNote" /></strong>
            </Layout>
            <Row>
              <Col xs={11}>
                <Field name="note" component={TextArea} autoFocus />
              </Col>
            </Row>
          </Modal>
        </form>
      )}
    />
  );
};

CannotSupply.manifest = {
  refdatavalues: {
    type: 'okapi',
    path: 'rs/refdata',
    params: {
      max: '500',
    },
  }
};

CannotSupply.propTypes = {
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

export default stripesConnect(injectIntl(CannotSupply));
