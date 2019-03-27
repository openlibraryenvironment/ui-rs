import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';


function makeEntryList(entries) {
  if (!entries || entries.length === 0) return null;

  return (
    <ul>
      {entries.map(e => (
        <li key={e.id}><Link to={e.id}>{e.name}</Link></li>
      ))}
    </ul>
  );
}


class DirectoryEntryInfo extends React.Component {
  static propTypes = {
    directoryEntry: PropTypes.object,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  render() {
    const { directoryEntry } = this.props;
    const entryList = makeEntryList(directoryEntry.entries);

    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-directory.information.heading.directoryEntry" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Row>
          <Col xs={5}>
            <KeyValue
              label={<FormattedMessage id="ui-directory.information.name" />}
              value={directoryEntry.name}
            />
          </Col>
          <Col xs={2}>
            <KeyValue
              label={<FormattedMessage id="ui-directory.information.status" />}
              value={(directoryEntry.status || {}).label}
            />
          </Col>
          <Col xs={5}>
            <KeyValue
              label={<FormattedMessage id="ui-directory.information.slug" />}
              value={directoryEntry.slug}
            />
          </Col>
        </Row>

        {!directoryEntry.description ? '' :
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-directory.information.description" />}
              value={directoryEntry.description}
            />
          </Col>
        </Row>
        }

        {!directoryEntry.symbolSummary ? '' :
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-directory.information.symbols" />}
              value={directoryEntry.symbolSummary}
            />
          </Col>
        </Row>
        }

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

        {!entryList ? '' :
        <React.Fragment>
          <Row>
            <Col xs={12}>
              <KeyValue
                label={<FormattedMessage id="ui-directory.information.entries" />}
                value={entryList}
              />
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
      </Accordion>
    );
  }
}

export default DirectoryEntryInfo;
