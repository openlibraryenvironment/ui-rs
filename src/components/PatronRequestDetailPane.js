import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import { Link } from 'react-router-dom';

import {
  Icon,
  Pane,
  Layer,
  Button,
} from '@folio/stripes/components';

import EditPatronRequest from './EditPatronRequest';
import ViewPatronRequest from './ViewPatronRequest';


class PatronRequestDetailPane extends React.Component {
  static manifest = Object.freeze({
    selectedRecord: {
      type: 'okapi',
      path: 'rs/patronrequests/:{id}',
    },
    query: {},
  });

  static propTypes = {
    resources: PropTypes.shape({
      query: PropTypes.shape({
        layer: PropTypes.string,
      }),
      selectedRecord: PropTypes.shape({
        records: PropTypes.array,
      }),
    }),
    paneWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onClose: PropTypes.func,
    onEdit: PropTypes.func,
    editLink: PropTypes.string,
    onCloseEdit: PropTypes.func,
  };

  getRecord() {
    return get(this.props.resources.selectedRecord, ['records', 0], {});
  }

  getInitialValues = () => {
    const record = this.getRecord();
    return Object.assign({}, record, { shortId: record.id && record.id.substring(0, 8) });
  };

  renderEditLayer() {
    const { resources: { query } } = this.props;

    return (
      <FormattedMessage id="ui-rs.editPatronRequest">
        {layerContentLabel => (
          <Layer
            isOpen={query.layer === 'edit'}
            contentLabel={layerContentLabel}
          >
            <EditPatronRequest
              {...this.props}
              onCancel={this.props.onCloseEdit}
              onSubmit={this.handleSubmit}
              initialValues={this.getInitialValues()}
            />
          </Layer>
        )}
      </FormattedMessage>
    );
  }

  getActionMenu = ({ onToggle }) => {
    return (
      <Button
        buttonStyle="dropdownItem"
        href={this.props.editLink}
        id="clickable-edit-patronrequest"
        onClick={() => {
          this.props.onEdit();
          onToggle();
        }}
      >
        <Icon icon="edit">
          <FormattedMessage id="ui-rs.edit" />
        </Icon>
      </Button>
    );
  };

  render() {
    const record = this.getRecord();
    const title = record.title || record.id;

    return (
      <Pane
        id="pane-view-patronrequest"
        defaultWidth={this.props.paneWidth}
        paneTitle={title}
        dismissible
        onClose={this.props.onClose}
        actionMenu={this.getActionMenu}
      >
        <Link to={`/request/view/${record.id}/flow`}>[flow]</Link>
        &nbsp;
        <Link to={`/request/view/${record.id}/pullslip`}>[pull slip]</Link>
        <ViewPatronRequest record={record} />
        {this.renderEditLayer()}
      </Pane>
    );
  }
}

export default PatronRequestDetailPane;
