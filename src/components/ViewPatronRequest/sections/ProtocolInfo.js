/* eslint-disable jsx-a11y/control-has-associated-label */
// (it doesn't recognise FormattedMessage as a text label for th)
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Card } from '@folio/stripes/components';
import formattedDateTime from '../../../util/formattedDateTime';
import css from './ProtocolInfo.css';

const ProtocolInfo = ({ record, id }) => {
  const protocolMessages = (record || {}).protocolAudit || [];

  return (
    <Card
      id={`${id}-card`}
      headerStart="Reverse chronological"
      roundedBorder
      cardClass={css.protocolCard}
      headerClass={css.protocolCardHeader}
    >
      <table className={css.protocolEntryList}>
        <thead>
          <tr>
            <th>#</th>
            <th><FormattedMessage id="ui-rs.protocol.date" /></th>
            <th><FormattedMessage id="ui-rs.protocol.duration" /></th>
            <th><FormattedMessage id="ui-rs.protocol.protocol" /></th>
            <th><FormattedMessage id="ui-rs.protocol.url" /></th>
          </tr>
        </thead>
        <tbody>
          {
            protocolMessages.map((entry, i) => (
              <>
                <tr key={i}>
                  <td>{protocolMessages.length - i}</td>
                  <td>{formattedDateTime(entry.dateCreated)}</td>
                  <td>{entry.duration}</td>
                  <td>{entry.protocolType}</td>
                  <td>{entry.url}</td>
                </tr>
                <tr key={i + protocolMessages.length}>
                  <td />
                  <td><FormattedMessage id="ui-rs.protocol.request" /></td>
                  <td colSpan="3">{entry.requestBody}</td>
                </tr>
                <tr key={i + (protocolMessages.length * 2)}>
                  <td />
                  <td><FormattedMessage id="ui-rs.protocol.response" /></td>
                  <td colSpan="3">{entry.responseBody}</td>
                </tr>
              </>
            ))
          }
        </tbody>
      </table>
    </Card>
  );
};


export default ProtocolInfo;
