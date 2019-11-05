import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

class LocalDirectoryEntryInfo extends React.Component {
  static propTypes = {
    record: PropTypes.object,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    custprops: PropTypes.object,
  };

  render() {
    const { record, custprops } = this.props;
    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-directory.information.local.heading.directoryEntry" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Row>
          <Col xs={6}>
            <KeyValue
              label={custprops.local_patronAccountBarcode.label}
              value={record.customProperties.local_patronAccountBarcode ? record.customProperties.local_patronAccountBarcode[0].value : '-'}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={custprops.local_institutionalPatronAccount.label}
              value={record.customProperties.local_institutionalPatronAccount ? record.customProperties.local_institutionalPatronAccount[0].value : '-'}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <KeyValue
              label={custprops.local_widget_2.label}
              value={record.customProperties.local_widget_2 ? record.customProperties.local_widget_2[0].value : '-'}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={custprops.local_widget_3.label}
              value={record.customProperties.local_widget_3 ? record.customProperties.local_widget_3[0].value : '-'}
            />
          </Col>
        </Row>
      </Accordion>
    );
  }
}

export default LocalDirectoryEntryInfo;
