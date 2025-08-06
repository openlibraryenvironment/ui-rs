import { FormattedMessage } from 'react-intl';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { github as githubStyle } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import XmlBeautify from 'xml-beautify';
import { AccordionSet, Accordion, Card, ErrorBoundary, Layout } from '@folio/stripes/components';
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
      headerStart={<FormattedMessage id="ui-rs.reverseChronological" />}
      roundedBorder
      cardClass={css.protocolCard}
      headerClass={css.protocolCardHeader}
    >
      <Layout className={`flex full ${css.protocolCardHeadings}`}>
        <span style={{ width: '1.5em' }}>&nbsp;</span>
        <span style={{ width: '3em' }}>#</span>
        <span style={{ width: '12em' }}><FormattedMessage id="ui-rs.protocol.date" /></span>
        <span style={{ width: '8em' }}><FormattedMessage id="ui-rs.protocol.duration" /></span>
        <span style={{ width: '12em' }}><FormattedMessage id="ui-rs.protocol.protocol" /></span>
        <span><FormattedMessage id="ui-rs.protocol.url" /></span>
      </Layout>
      <AccordionSet>
        {
          protocolMessages.map((entry, i) => (
            <Accordion
              key={i}
              closedByDefault
              label={
                <Layout className={`flex full ${css.protocolEntryHeader}`}>
                  <span style={{ width: '3em' }}>{protocolMessages.length - i}</span>
                  <span style={{ width: '12em' }}>{formattedDateTime(entry.dateCreated)}</span>
                  <span style={{ width: '8em' }}>{entry.duration}</span>
                  <span style={{ width: '12em' }}>{entry.protocolType}</span>
                  <span style={{ flex: '1' }}>{entry.url}</span>
                </Layout>
              }
            >
              <>
                <h2><FormattedMessage id="ui-rs.protocol.request" /></h2>
                <ErrorBoundary><FormatEntry entry={entry} property="requestBody" /></ErrorBoundary>
                <hr />
                <h2><FormattedMessage id="ui-rs.protocol.response" /></h2>
                <ErrorBoundary><FormatEntry entry={entry} property="responseBody" /></ErrorBoundary>
              </>
            </Accordion>
          ))
        }
      </AccordionSet>
    </Card>
  );
};


export default ProtocolInfo;
