/* eslint-disable jsx-a11y/control-has-associated-label */
// (it doesn't recognise FormattedMessage as a text label for th)
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Card } from '@folio/stripes/components';
import { useOkapiQuery } from '@reshare/stripes-reshare';
import formattedDateTime from '../../../util/formattedDateTime';
import css from './AuditInfo.css';

const AuditUser = ({ id }) => {
  // react-query will smartly avoid starting multiple requests for the same key
  // and I'm expecting the same users will commonly appear on most PatronRequests
  // so while for any one list of audit entries it would be more efficient to
  // craft a single request for all the users, this lets us cache them
  // conveniently. Of course we can implement something for the best of both but
  // this is "temporary" pending a proper solution on in mod-rs and less code to
  // maintain in the interim.
  const { data: user = {}, isSuccess } = useOkapiQuery(`users/${id}`, { staleTime: 4 * 60 * 60 * 1000 });
  if (!isSuccess) return null;
  return user.username;
};

const AuditInfo = ({ record, id }) => {
  const audit = (record || {}).audit || [];

  return (
    <Card
      id={`${id}-card`}
      headerStart="Reverse chronological"
      roundedBorder
      cardClass={css.auditCard}
      headerClass={css.auditCardHeader}
    >
      <table className={css.auditEntryList}>
        <thead>
          <tr>
            <th>#</th>
            <th><FormattedMessage id="ui-rs.audit.user" /></th>
            <th><FormattedMessage id="ui-rs.audit.date" /></th>
            <th><FormattedMessage id="ui-rs.audit.from" /></th>
            <th><FormattedMessage id="ui-rs.audit.to" /></th>
            <th><FormattedMessage id="ui-rs.audit.message" /></th>
          </tr>
        </thead>
        <tbody>
          {
            audit.map((entry, i) => (
              <tr key={i}>
                <td>{audit.length - i}</td>
                <td>{entry.user && <AuditUser id={entry.user} />}</td>
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
};


export default AuditInfo;
