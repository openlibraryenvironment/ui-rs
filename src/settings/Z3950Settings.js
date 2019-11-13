import React from 'react';
import PropTypes from 'prop-types';
import { withStripes } from '@folio/stripes/core';
import { ControlledVocab } from '@folio/stripes/smart-components';
import { FormattedMessage } from 'react-intl';

class Z3950Settings extends React.Component {
  static manifest = Object.freeze({
    setting: {
      type: 'okapi',
      path: 'rs/settings/appSettings?stats=true&filters=section%3Dz3950',
    },
  });

  static propTypes = {
    stripes: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  render() {
    const { stripes } = this.props;
    console.log("Props: %o", this.props)
    return (
      <this.connectedControlledVocab
        stripes={stripes}
        baseUrl='rs/settings/appSettings?stats=true&filters=section%3Dz3950'
        label={<FormattedMessage id="ui-rs.settings.z3950" />}
        labelSingular={<FormattedMessage id="ui-rs.settings.z3950.singular" />}
        objectLabel={<FormattedMessage id="ui-rs.settings.z3950.objectLabel" />}
        visibleFields={['key', 'value']}
        columnMapping={{
          st_key: <FormattedMessage id="ui-rs.settings.name" />,
          st_value: <FormattedMessage id="ui-rs.settings.value" />,
        }}
        id="z3950-settings"
        sortby="value"
        hiddenFields={['id', 'version', 'section', 'settingType', 'vocab', 'defValue', 'lastUpdated', 'numberOfObjects']}
        limitParam="perPage"
      />
    );
  }
}

export default withStripes(Z3950Settings);
