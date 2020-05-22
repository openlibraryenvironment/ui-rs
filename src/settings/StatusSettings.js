import { get } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { ControlledVocab } from '@folio/stripes/smart-components';
import { withStripes } from '@folio/stripes/core';

class StatusSettings extends React.Component {
  static manifest = Object.freeze({
    category: {
      type: 'okapi',
      path: 'directory/refdata?filters=desc=DirectoryEntry.Status',
    },
  });

  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    intl: PropTypes.object,
    resources: PropTypes.shape({
      category: PropTypes.object,
    }),
  };

  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  render() {
    const { stripes, intl } = this.props;
    const category = get(this.props, 'resources.category.records.0');
    if (!category) return null;

    return (
      <this.connectedControlledVocab
        stripes={stripes}
        baseUrl={`directory/refdata/${category.id}`}
        records="values"
        label={intl.formatMessage({ id: 'ui-directory.objectName.statuses' })}
        labelSingular={intl.formatMessage({ id: 'ui-directory.objectName.status' })}
        objectLabel="Entries"
        visibleFields={['label', 'value']}
        columnMapping={{
          value: intl.formatMessage({ id: 'ui-directory.headings.value' }),
          normValue: intl.formatMessage({ id: 'ui-directory.headings.normValue' }),
        }}
        id="statuses"
        sortby="value"
        hiddenFields={['lastUpdated', 'numberOfObjects']}
        clientGeneratePk=""
        limitParam="perPage"
        actuatorType="refdata"
      />
    );
  }
}

export default injectIntl(withStripes(StatusSettings));
