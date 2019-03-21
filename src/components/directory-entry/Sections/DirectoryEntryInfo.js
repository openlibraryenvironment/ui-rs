import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';
import {
  Accordion,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

class DirectoryEntryInfo extends React.Component {
  static propTypes = {
    directoryEntry: PropTypes.object,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  render() {
    // eslint-disable-next-line no-console
    console.log('DirectoryEntryInfo::render', this.props);

    const { directoryEntry } = this.props;

    return (
      <Accordion
        id={this.props.id}
        label="Directory entry info"
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Row>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-directory.information.name" />}
              value={directoryEntry.name}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-directory.information.slug" />}
              value={directoryEntry.slug}
            />
          </Col>
        </Row>
      </Accordion>
    );
  }
}

export default DirectoryEntryInfo;
