import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import css from './CustomIdentifiers.css';

class CustomIdentifiersInfo extends React.Component {
  static propTypes = {
    record: PropTypes.object,
    id: PropTypes.string,
  };

  render() {
    const { record } = this.props;
    const { customIdentifiers } = record;
    const summary = 'ZFL identifiers';
    let identifiers = [];
    if (customIdentifiers) {
      const parsedResponse = JSON.parse(customIdentifiers);
      if (parsedResponse.customIdentifiers && parsedResponse.customIdentifiers.length > 0) {
        identifiers = parsedResponse.customIdentifiers
      }
    }

    if (identifiers && identifiers.length > 0) {
      return (
          <Card
              id={`${this.props.id}-card`}
              headerStart={summary}
              roundedBorder
              cardClass={css.citationMetadataCard}
              headerClass={css.citationMetadataCardHeader}
          >
            {identifiers.map(id =>
                <React.Fragment>
                  <Row>
                    <Col xs={6}>
                      <KeyValue
                          label={id.key}
                          value={id.value}
                      />
                    </Col>
                  </Row>
                </React.Fragment>
            )}
          </Card>
      );
    } else {
      return (<React.Fragment></React.Fragment>)
    }
  }
}

export default CustomIdentifiersInfo;