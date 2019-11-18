import React from 'react';
import PropTypes from 'prop-types';
import { withStripes } from '@folio/stripes/core';
import { ControlledVocab, EditableList } from '@folio/stripes/smart-components';
import { FormattedMessage } from 'react-intl';

class LocalNCIPSettings extends React.Component {
  static propTypes = {
    stripes: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }
  
  render() {
    const { stripes } = this.props;
    return (
      <this.connectedControlledVocab
        {...this.props}
        stripes={stripes}
        baseUrl={`rs/settings/appSettings`}
        label={<FormattedMessage id="ui-rs.settings.local-ncip" />}
        labelSingular={<FormattedMessage id="ui-rs.settings.local-ncip.singular" />}
        objectLabel={<FormattedMessage id="ui-rs.settings.local-ncip.objectLabel" />}
        visibleFields={['key', 'value']}
        columnMapping={{
          st_key: <FormattedMessage id="ui-rs.settings.name" />,
          st_value: <FormattedMessage id="ui-rs.settings.value" />,
        }}
        rowFilterFunction={(row) => {
          return (
            row.section === "Local NCIP"
          );
        }
        }
        id="local-ncip-settings"
        sortby="value"
        hiddenFields={['id', 'version', 'section', 'settingType', 'vocab', 'defValue', 'lastUpdated', 'numberOfObjects']}
        limitParam="perPage"
      />
    );
  }
}

export default withStripes(LocalNCIPSettings);
