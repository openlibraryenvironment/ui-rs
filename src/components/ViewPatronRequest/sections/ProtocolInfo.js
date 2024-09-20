/* eslint-disable jsx-a11y/control-has-associated-label */
// (it doesn't recognise FormattedMessage as a text label for th)
import { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { github as githubStyle } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import XmlBeautify from 'xml-beautify';
import { Card, ErrorBoundary } from '@folio/stripes/components';
import formattedDateTime from '../../../util/formattedDateTime';
import css from './ProtocolInfo.css';

const FormatEntry = ({ entry, property }) => {
  const txt = entry[property];
  if (!txt) return null;
  switch (entry.protocolType) {
    case 'NCIP':
    case 'ISO18626': {
      if (txt.startsWith('<')) {
        const formatted = new XmlBeautify().beautify(txt);
        return <SyntaxHighlighter language="xml" style={githubStyle} wrapLongLines>{formatted}</SyntaxHighlighter>;
      }
      return txt;
    }
    case 'Z3950_RESPONDER': {
      if (txt.startsWith('{')) {
        const parsed = JSON.parse(txt);
        const xmlSnippets = [];
        if (Array.isArray(parsed.searches)) {
          parsed.searches.forEach((search, i) => {
            if (search.searchRequest) {
              xmlSnippets.push(<span key={'span' + i}>Search #{i} <code>searchRequest</code></span>);
              xmlSnippets.push(
                <SyntaxHighlighter language="xml" style={githubStyle} wrapLongLines key={'xml' + i}>
                  {new XmlBeautify().beautify(search?.searchRequest)}
                </SyntaxHighlighter>
              );
              parsed.searches[i].searchRequest = 'See below';
            }
            if (Array.isArray(search.records)) {
              search.records.forEach((record, j) => {
                xmlSnippets.push(<span key={'span' + i + 'r' + j}>Search #{i}, record #{j}</span>);
                xmlSnippets.push(
                  <SyntaxHighlighter language="xml" style={githubStyle} wrapLongLines key={'xml' + i + 'r' + j}>
                    {new XmlBeautify().beautify(record)}
                  </SyntaxHighlighter>
                );
              });
              parsed.searches[i].records = 'See below';
            }
          });
        }
        const formatted = JSON.stringify(parsed, null, 2);
        return (
          <>
            <SyntaxHighlighter language="json" style={githubStyle} wrapLongLines key="json">{formatted}</SyntaxHighlighter>
            {xmlSnippets}
          </>
        );
      }
      return txt;
    }
    default: {
      return txt;
    }
  }
};

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
              <Fragment key={i}>
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
                  <td colSpan="3"><ErrorBoundary><FormatEntry entry={entry} property="requestBody" /></ErrorBoundary></td>
                </tr>
                <tr key={i + (protocolMessages.length * 2)}>
                  <td />
                  <td><FormattedMessage id="ui-rs.protocol.response" /></td>
                  <td colSpan="3"><ErrorBoundary><FormatEntry entry={entry} property="responseBody" /></ErrorBoundary></td>
                </tr>
              </Fragment>
            ))
          }
        </tbody>
      </table>
    </Card>
  );
};


export default ProtocolInfo;
