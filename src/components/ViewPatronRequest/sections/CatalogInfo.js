// http://shared-index.reshare-dev.indexdata.com/inventory/view/7c4420ad-a946-4099-b616-aff3e9f581e4
// http://ec2-34-229-181-20.compute-1.amazonaws.com:9130/inventory/instances/7c4420ad-a946-4099-b616-aff3e9f581e4

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { withStripes } from '@folio/stripes/core';
import {
  Accordion,
  Card,
  Col,
  Row,
} from '@folio/stripes/components';

import css from './CatalogInfo.css';

class CatalogInfo extends React.Component {
  static propTypes = {
    record: PropTypes.object,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    stripes: PropTypes.shape({
      config: PropTypes.shape({
        sharedIndexUI: PropTypes.string.isRequired,
      }),
    }),
  };

  render() {
    const { record, stripes } = this.props;
    const id = record.systemInstanceIdentifier;

    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-rs.information.heading.catalogInfo" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Card
          id={`${this.props.id}-card`}
          headerStart="Catalog"
          roundedBorder
          cardClass={css.catalogCard}
          headerClass={css.catalogCardHeader}
        >
          <Row>
            <Col xs={12}>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`${stripes.config.sharedIndexUI}/inventory/view/${id}`}
              >
                [Link to Shared Index]
              </a>
            </Col>
          </Row>
        </Card>
      </Accordion>
    );
  }
}

export default withStripes(CatalogInfo);
