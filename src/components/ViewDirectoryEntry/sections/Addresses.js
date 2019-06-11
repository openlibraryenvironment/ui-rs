import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion, KeyValue, Headline } from '@folio/stripes/components';


function renderAddress(address, index, count) {
  const header = address.addressLabel ||
    <FormattedMessage id="ui-directory.information.addressNofM" values={{ index, count }} />;

  return (
    <React.Fragment key={index}>
      <Headline>{header}</Headline>
      <ul>
        {
          _.sortBy(address.lines, e => e.seq).map((line, j) => (
            <li key={j}>
              {line.seq}. {line.value}
            </li>
          ))
        }
      </ul>
      <KeyValue
        label={<FormattedMessage id="ui-directory.information.tags" />}
        value={address.tags.map(t => t.value).sort().join(', ')}
      />
    </React.Fragment>
  );
}


class Addresses extends React.Component {
  static propTypes = {
    record: PropTypes.object,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  render() {
    const addresses = this.props.record.addresses || [];

    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-directory.information.heading.addresses" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        {addresses.map((address, i) => renderAddress(address, i + 1, addresses.length))}
      </Accordion>
    );
  }
}

export default Addresses;
