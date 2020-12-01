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
        <table className={css.auditEntryList}>
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>From state</th>
              <th>To state</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {
              audit.map((entry, i) => (
                <tr key={i}>
                  <td>{audit.length - i}</td>
                  <td>{formattedDateTime(entry.dateCreated)}</td>
                  <td>{entry.fromStatus && <FormattedMessage id={`stripes-reshare.states.${entry.fromStatus.code}`} />}</td>
                  <td>{entry.toStatus && <FormattedMessage id={`stripes-reshare.states.${entry.toStatus.code}`} />}</td>
                  <td>{entry.message}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </Card>
    );
  }
}

export default AuditInfo;
