import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Card, Col, KeyValue, Row } from '@folio/stripes/components';


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

  findIndexBySeq(seq) {
    // This function is in place to ensure that the array getting jumbled up doesn't break the edit order
    const { address: { lines } } = this.props;
    return lines.findIndex(item => item.seq === seq);
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
          <Row>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-directory.information.addresses.houseName" />}
                value={address ? address.lines[this.findIndexBySeq(0)]?.value : '-'}
              />
            </Col>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-directory.information.addresses.street" />}
                value={address ? address.lines[this.findIndexBySeq(1)]?.value : '-'}
              />
            </Col>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-directory.information.addresses.city" />}
                value={address ? address.lines[this.findIndexBySeq(2)]?.value : '-'}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-directory.information.addresses.administrativeArea" />}
                value={address ? address.lines[this.findIndexBySeq(3)]?.value : '-'}
              />
            </Col>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-directory.information.addresses.postalCode" />}
                value={address ? address.lines[this.findIndexBySeq(4)]?.value : '-'}
              />
            </Col>
            {address.tags.length > 0 &&
              <Col xs={4}>
                <KeyValue
                  label={<FormattedMessage id="ui-directory.information.tags" />}
                  value={address.tags.map(t => t.value).sort().join(', ')}
                />
              </Col>
            }
          </Row>
        </Card>
      </>
    );
  }
}

export default Address;
