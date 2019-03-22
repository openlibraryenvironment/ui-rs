import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
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
        {directoryEntry.fullyQualifiedName === directoryEntry.name ? '' :
        <React.Fragment>
          <Row>
            <Col xs={12}>
              <KeyValue
                label={<FormattedMessage id="ui-directory.information.qualifiedName" />}
                value={directoryEntry.fullyQualifiedName}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Link to={directoryEntry.parent.id}>
                <KeyValue
                  label={<FormattedMessage id="ui-directory.information.parent" />}
                  value={directoryEntry.parent.name}
                />
              </Link>
            </Col>
          </Row>
        </React.Fragment>
        }
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-directory.information.tags" />}
              value={directoryEntry.tagSummary}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-directory.information.symbols" />}
              value={directoryEntry.symbolSummary}
            />
          </Col>
        </Row>
      </Accordion>
    );
  }
}

export default DirectoryEntryInfo;
