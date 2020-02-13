import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Card } from '@folio/stripes/components';
import formattedDateTime from '../../../util/formattedDateTime';
import css from './AuditInfo.css';


class AuditInfo extends React.Component {
  static propTypes = {
    record: PropTypes.object,
    id: PropTypes.string,
  };

  render() {
    const { record } = this.props;
    const audit = (record || {}).audit || [];

    return (
      <Card
        id={`${this.props.id}-card`}
        headerStart="Reverse chronological"
        roundedBorder
        cardClass={css.auditCard}
        headerClass={css.auditCardHeader}
      >
        <table cellPadding="4">
          <tr>
            <th align="left">#</th>
            <th align="left">Date</th>
            <th align="left">From state</th>
            <th align="left">To state</th>
            <th align="left">Message</th>
          </tr>
          {
            audit.map((entry, i) => (
              <tr>
                <td>{audit.length - i}</td>
                <td>{formattedDateTime(entry.dateCreated)}</td>
                <td>{entry.fromStatus && <FormattedMessage id={`ui-rs.states.${entry.fromStatus.code}`} />}</td>
                <td>{entry.toStatus && <FormattedMessage id={`ui-rs.states.${entry.toStatus.code}`} />}</td>
                <td>{entry.message}</td>
              </tr>
            ))
          }
        </table>
      </Card>
    );
  }
}

export default AuditInfo;
