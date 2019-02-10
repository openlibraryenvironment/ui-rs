import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
  Accordion,
  AccordionSet,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import css from './DirectoryEntryInfo.css';

class DirectoryEntryInfo extends React.Component {

  static propTypes = {
    directoryEntry: PropTypes.object,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    stripes: PropTypes.object,
  };

  constructor(props) {
    super(props);
  }

  render() {

    console.log("DirectoryEntryInfo::render %o,%o",this.props,this.props.stripes);

    const { directoryEntry, stripes } = this.props;

    return (
      <Accordion
        id={this.props.id}
        label='label'
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Row>
          <Col xs={12}>
            <KeyValue
              label='label'
              value={directoryEntry.name}
            />
          </Col>
        </Row>
      </Accordion>
    );
  }
}

export default DirectoryEntryInfo;

