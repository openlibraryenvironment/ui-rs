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
          {custprops.local_institutionalPatronId ?
            <Col xs={6}>
              <KeyValue
                label={custprops.local_institutionalPatronId.label}
                value={record.customProperties.local_institutionalPatronId ? record.customProperties.local_institutionalPatronId[0].value : '-'}
              />
            </Col>
            : null
          }
          {custprops.local_widget_2 ?
            <Col xs={6}>
              <KeyValue
                label={custprops.local_widget_2.label}
                value={record.customProperties.local_widget_2 ? record.customProperties.local_widget_2[0].value : '-'}
              />
            </Col>
            : null
          }
        </Row>
        <Row>
          {custprops.local_widget_3 ?
            <Col xs={6}>
              <KeyValue
                label={custprops.local_widget_3.label}
                value={record.customProperties.local_widget_3 ? record.customProperties.local_widget_3[0].value : '-'}
              />
            </Col>
            : null
          }
        </Row>
      </Accordion>
    );
  }
}

export default LocalDirectoryEntryInfo;
