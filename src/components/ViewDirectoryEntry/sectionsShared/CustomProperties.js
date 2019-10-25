import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion } from '@folio/stripes/components';


class CustomProperties extends React.Component {
  static propTypes = {
    record: PropTypes.object,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  render() {
    const pFull = this.props.record.customProperties || {};
    const pSharedKeys = Object.keys(pFull).filter(key => pFull[key][0].type.defaultInternal === false)
    const p = _.pick(pFull, pSharedKeys)

    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-directory.information.heading.customProps" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <ul>
          {
            Object.keys(p).sort().map(key => (
              <li key={key}>
                <b>{key}</b>
                :
                <pre>{JSON.stringify(p[key], null, 2)}</pre>
              </li>
            ))
          }
        </ul>
      </Accordion>
    );
  }
}

export default CustomProperties;
