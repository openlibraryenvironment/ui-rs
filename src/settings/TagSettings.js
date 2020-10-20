import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { ControlledVocab } from '@folio/stripes/smart-components';
import { withStripes } from '@folio/stripes/core';

// Can be passed into <ControlledVocab> using: preUpdateHook={removeNormValue}
// eslint-disable-next-line no-unused-vars
function removeNormValue(obj) {
  const res = { ...obj };
  delete res.normValue;
  console.log('removeNormValue', obj, '->', res); // eslint-disable-line no-console
  return res;
}

class TagSettings extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    intl: PropTypes.object.isRequired,
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
        baseUrl="directory/tags"
        canCreate={false}
        clientGeneratePk=""
        columnMapping={{
          value: intl.formatMessage({ id: 'ui-directory.headings.value' }),
          normValue: intl.formatMessage({ id: 'ui-directory.headings.normValue' }),
        }}
        hiddenFields={['lastUpdated', 'numberOfObjects']}
        id="tags"
        label={intl.formatMessage({ id: 'ui-directory.objectName.tags' })}
        labelSingular={intl.formatMessage({ id: 'ui-directory.objectName.tag' })}
        limitParam="perPage"
        objectLabel="Entries"
        sortby="value"
        stripes={stripes}
        visibleFields={['value', 'normValue']}
      />
    );
  }
}

export default injectIntl(withStripes(TagSettings));
