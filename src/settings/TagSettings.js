import React from 'react';
import PropTypes from 'prop-types';
import {
  injectIntl,
  intlShape,
} from 'react-intl';
import { ControlledVocab } from '@folio/stripes/smart-components';
import { withStripes } from '@folio/stripes/core';

class TagSettings extends React.Component {
  static propTypes = {
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object, // React component
    ]).isRequired,
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
/*
    const old = (
      <Pane defaultWidth="fill" fluidContentWidth paneTitle={this.props.label}>
        <div data-test-application-settings-general-message>
          <FormattedMessage id="ui-directory.settings.tags.message" />
        </div>
      </Pane>
    );
*/

    const {
      stripes,
      intl,
    } = this.props;

    return (
      <this.connectedControlledVocab
        stripes={stripes}
        baseUrl="directory/tags"
        records="."
        label={intl.formatMessage({ id: 'ui-directory.objectName.tags' })}
        labelSingular={intl.formatMessage({ id: 'ui-directory.objectName.tag' })}
        visibleFields={['value', 'normValue']}
        columnMapping={{
          value: intl.formatMessage({ id: 'ui-directory.headings.value' }),
          normValue: intl.formatMessage({ id: 'ui-directory.headings.normValue' }),
        }}
        id="tags"
        sortby="value"
        objectLabel="this is not used, but marked mandatory"
        x_hiddenFields={['lastUpdated', 'numberOfObjects']}
      />
    );
  }
}

export default injectIntl(withStripes(TagSettings));
