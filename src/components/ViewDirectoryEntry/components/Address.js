import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Card } from '@folio/stripes/components';

import css from './Address.css';


class Address extends React.Component {
  static propTypes = {
    address: PropTypes.shape({
      lines: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
      })),
    }),
    count: PropTypes.number,
    index: PropTypes.number,
  };

  sortBySeq(lineA, lineB) {
    return lineA.seq - lineB.seq;
  }

  renderAddress(address) {
    address.lines.sort((a, b) => this.sortBySeq(a, b));
    return (
      <ul className={css.addressList}>
        {address.lines.map((line) => {
          return (
            <li key={`addressLine[${line.seq}]`}>{line.value}</li>
          );
        })}
      </ul>
    );
  }

  render() {
    const { address, index, count } = this.props;

    const header = address.addressLabel ||
    <FormattedMessage id="ui-directory.information.addressNofM" values={{ index, count }} />;
    return (
      <>
        <Card
          headerStart={header}
        >
          {this.renderAddress(address)}
        </Card>
      </>
    );
  }
}

export default Address;
