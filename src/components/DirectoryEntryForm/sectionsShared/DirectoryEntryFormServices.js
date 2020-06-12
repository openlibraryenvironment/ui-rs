import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';

import {
  Accordion,
} from '@folio/stripes/components';

import { ServiceAccountListFieldArray } from '../components';

class DirectoryEntryFormServices extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    parentResources: PropTypes.shape({
      refdata: PropTypes.object,
      selectedRecord: PropTypes.shape({
        records: PropTypes.array
      }),
      custprops: PropTypes.array,
    }),
  };

  render() {
    const { id, onToggle, open, parentResources } = this.props;
    return (
      <Accordion
        id={id}
        label={<FormattedMessage id="ui-directory.information.heading.services" />}
        open={open}
        onToggle={onToggle}
      >
        <FieldArray
          name="services"
          component={ServiceAccountListFieldArray}
          parentResources={parentResources}
        />
      </Accordion>
    );
  }
}

export default DirectoryEntryFormServices;
