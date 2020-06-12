import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Card,
  Col,
  ConfirmationModal,
  KeyValue,
  Row,
  Select,
  TextField,
} from '@folio/stripes/components';

import { Field } from 'react-final-form';

import { FormattedMessage } from 'react-intl';
import SafeHTMLMessage from '@folio/react-intl-safe-html';

class ServiceField extends React.Component {
  static propTypes = {
    input: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired,
    meta: PropTypes.shape({
      initial: PropTypes.shape({
        id: PropTypes.string
      }).isRequired,
    }).isRequired,
    mutators: PropTypes.shape({
      setServiceValue: PropTypes.func.isRequired
    }).isRequired,
    onDelete: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    serviceData: PropTypes.shape({
      functions: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string
      })).isRequired,
      types: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string
      })).isRequired,
    })
  };

  constructor(props) {
    super(props);

    const { value } = props.input;

    this.state = {
      editing: !(value.id),
      showConfirmDelete: false,
    };
  }

  handleSave = () => {
    const { onSave } = this.props;
    onSave()
      .then(() => this.setState({ editing: false }));
  }

  handleEdit = () => {
    this.setState({
      editing: true,
    });
  }

  handleCancel = () => {
    const { input, meta, mutators, onDelete } = this.props;
    if (meta.initial?.id) {
      mutators.setServiceValue(input.name, meta.initial);
      this.setState({ editing: false });
    } else {
      onDelete();
    }
  }

  renderEditButton() {
    const { editing } = this.state;
    const EditText = editing ? <FormattedMessage id="ui-directory.settings.services.finish-editing" /> :
    <FormattedMessage id="ui-directory.settings.services.edit" />;

    return (
      <Button
        bottomMargin0
        onClick={(e) => {
          e.preventDefault();
          return (
            editing ? this.handleSave() : this.handleEdit()
          );
        }}
        type={editing ? 'submit' : undefined}
      >
        {EditText}
      </Button>
    );
  }

  renderDeleteCancelButton() {
    const { editing } = this.state;
    const ButtonText = editing ? <FormattedMessage id="ui-directory.settings.services.cancel" /> :
    <FormattedMessage id="ui-directory.settings.services.delete" />;

    return (
      <Button
        bottomMargin0
        buttonStyle={editing ? undefined : 'danger'}
        onClick={(e) => {
          e.preventDefault();
          return (
            editing ? this.handleCancel() : this.showDeleteConfirmationModal()
          );
        }}
      >
        {ButtonText}
      </Button>
    );
  }

  renderCardHeader() {
    const { editing } = this.state;
    const { input: { value: currentService } } = this.props;
    return (
      editing ?
        <Col xs={10}>
          <Field
            autoFocus
            name={`${this.props.input.name}.name`}
            component={TextField}
            parse={v => v}
          />
        </Col> : <strong> {currentService?.name} </strong>
    );
  }

  renderFieldValue(value, label, refdatacat = null) {
    const { serviceData: { functions, types } } = this.props;
    return (
      <KeyValue
        label={label}
        value={!refdatacat ? value : (refdatacat === 'types' ? types.filter(obj => obj.value === value)[0]?.label : functions.filter(obj => obj.value === value)[0]?.label)}
      />
    );
  }

  renderCardContents() {
    const { editing } = this.state;
    const { input: { value: currentService }, serviceData: { functions, types } } = this.props;
    const addressLabel = <FormattedMessage id="ui-directory.information.serviceAddress" />;
    const typeLabel = <FormattedMessage id="ui-directory.information.serviceType" />;
    const functionlabel = <FormattedMessage id="ui-directory.information.serviceFunction" />;

    return (
      <>
        <Row>
          <Col xs={6}>
            {editing ?
              <Field
                name={`${this.props.input.name}.type`}
                label={typeLabel}
                component={Select}
                dataOptions={types}
                parse={v => v}
              /> : this.renderFieldValue(currentService?.type, typeLabel, 'types')
            }
          </Col>
          <Col xs={6}>
            {editing ?
              <Field
                name={`${this.props.input.name}.businessFunction`}
                label={functionlabel}
                component={Select}
                dataOptions={functions}
                parse={v => v}
              /> : this.renderFieldValue(currentService?.businessFunction, functionlabel, 'functions')
            }
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {editing ?
              <Field
                name={`${this.props.input.name}.address`}
                label={addressLabel}
                component={TextField}
                parse={v => v}
              /> : this.renderFieldValue(currentService?.address, addressLabel)
            }
          </Col>
        </Row>
      </>
    );
  }

  showDeleteConfirmationModal = () => this.setState({ showConfirmDelete: true });
  hideDeleteConfirmationModal = () => this.setState({ showConfirmDelete: false });

  render() {
    const { input: { value: currentService } } = this.props;
    return (
      <>
        <Card
          headerEnd={
            <span>
              {this.renderDeleteCancelButton()}
              {this.renderEditButton()}
            </span>
          }
          headerStart={this.renderCardHeader()}
          roundedBorder
        >
          {this.renderCardContents()}
        </Card>
        {this.state.showConfirmDelete && (
          <ConfirmationModal
            buttonStyle="danger"
            confirmLabel={<FormattedMessage id="ui-directory.settings.services.delete" />}
            data-test-confirmationModal
            heading={<FormattedMessage id="ui-directory.settings.services.delete.heading" />}
            id="delete-job-confirmation"
            message={<SafeHTMLMessage id="ui-directory.settings.services.delete.confirmMessage" values={{ name: currentService.name }} />}
            onCancel={this.hideDeleteConfirmationModal}
            onConfirm={() => {
              this.props.onDelete();
              this.hideDeleteConfirmationModal();
            }}
            open
          />
        )}
      </>
    );
  }
}

export default ServiceField;
