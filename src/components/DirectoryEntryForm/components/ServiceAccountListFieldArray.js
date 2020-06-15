import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Button,
  Col,
  Row,
  Select,
  TextField,
  TextArea,
} from '@folio/stripes/components';

import { EditCard, withKiwtFieldArray } from '@folio/stripes-erm-components';
import { required } from '../../../util/validators';

class ServiceAccountListFieldArray extends React.Component {
  static propTypes = {
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }).isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      map: PropTypes.func,
    })),
    name: PropTypes.string,
    onAddField: PropTypes.func.isRequired,
    onDeleteField: PropTypes.func.isRequired,
    parentResources: PropTypes.shape({
      refdata: PropTypes.object,
    })
  };

  renderAddService = () => {
    return (
      <Button
        id="add-service-btn"
        onClick={() => this.props.onAddField()}
      >
        <FormattedMessage id="ui-directory.information.services.add" />
      </Button>
    );
  }

  render() {
    const { items, parentResources } = this.props;
    const servicesList = parentResources?.services?.records?.map(service => ({ value: service.id, label: `${service.name} : ${service.address}` }));
    return (
      <>
        {items?.map((service, index) => {
          return (
            <EditCard
              header={<FormattedMessage id="ui-directory.information.services.header" values={{ index }} />}
              key={`${this.props.name}[${index}].editCard`}
              onDelete={() => this.props.onDeleteField(index, service)}
              deleteButtonTooltipText={<FormattedMessage id="ui-directory.information.services.deleteText" values={{ slug: service.slug ? service.slug : `[${index}]` }} />}
            >
              <Row>
                <Col xs={6}>
                  <FormattedMessage id="ui-directory.information.services.slug">
                    {placeholder => (
                      <Field
                        component={TextField}
                        id={`edit-directory-entry-service-[${index}]-slug`}
                        label={placeholder}
                        name={`${this.props.name}[${index}].slug`}
                        placeholder={placeholder}
                        required
                        validate={required}
                      />
                    )}
                  </FormattedMessage>
                </Col>
                <Col xs={6}>
                  <FormattedMessage id="ui-directory.information.services.service">
                    {placeholder => (
                      <Field
                        component={Select}
                        dataOptions={servicesList}
                        id={`edit-directory-entry-service-[${index}]-service`}
                        label={placeholder}
                        name={`${this.props.name}[${index}].service`}
                        placeholder={placeholder}
                        required
                        validate={required}
                      />
                    )}
                  </FormattedMessage>
                </Col>
              </Row>
              <Row>
                <Col xs={6}>
                  <FormattedMessage id="ui-directory.information.services.accountDetails">
                    {placeholder => (
                      <Field
                        component={TextArea}
                        id={`edit-directory-entry-service-[${index}]-account-details`}
                        label={placeholder}
                        name={`${this.props.name}[${index}].accountDetails`}
                        parse={v => v}
                        placeholder={placeholder}
                      />
                    )}
                  </FormattedMessage>
                </Col>
              </Row>
            </EditCard>
          );
        })}
        {this.renderAddService()}
      </>
    );
  }
}

export default injectIntl(withKiwtFieldArray(ServiceAccountListFieldArray));
