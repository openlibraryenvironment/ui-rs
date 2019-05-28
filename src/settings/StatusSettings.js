import React from 'react';
import PropTypes from 'prop-types';
import {
  injectIntl,
  intlShape,
} from 'react-intl';
import { ControlledVocab } from '@folio/stripes/smart-components';
import { withStripes } from '@folio/stripes/core';

class StatusSettings extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    intl: intlShape.isRequired,
  };

  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  render() {
    const {
      stripes,
      intl,
    } = this.props;

    return (
      <this.connectedControlledVocab
        stripes={stripes}
        baseUrl="directory/refdata/DirectoryEntry/Status"
        label={intl.formatMessage({ id: 'ui-directory.objectName.statuses' })}
        labelSingular={intl.formatMessage({ id: 'ui-directory.objectName.status' })}
        objectLabel="Entries"
        visibleFields={['value', 'normValue']}
        columnMapping={{
          value: intl.formatMessage({ id: 'ui-directory.headings.value' }),
          normValue: intl.formatMessage({ id: 'ui-directory.headings.normValue' }),
        }}
        id="statuses"
        sortby="value"
        hiddenFields={['lastUpdated', 'numberOfObjects']}
        clientGeneratePk=""
        limitParam="perPage"
      />
    );
  }
}

export default injectIntl(withStripes(StatusSettings));
