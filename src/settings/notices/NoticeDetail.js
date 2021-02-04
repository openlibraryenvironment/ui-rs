import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, AccordionSet, KeyValue } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import HtmlToReact, { Parser } from 'html-to-react';

const NoticeDetail = ({ initialValues: notice }) => {
  const parser = new Parser();
  const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);
  const rules = [
    {
      shouldProcessNode: () => true,
      processNode: processNodeDefinitions.processDefaultNode,
    },
  ];
  const localizedTemplate = notice?.localizedTemplates?.en?.template || {}
  const parsedEmailTemplate = parser.parseWithInstructions(localizedTemplate.templateBody, () => true, rules);

  return (
    <>
      <KeyValue
        label={<FormattedMessage id="ui-rs.settings.name" />}
        value={notice.name}
      />
      <KeyValue
        label={<FormattedMessage id="ui-rs.settings.notices.active" />}
        value={notice.active
          ? <FormattedMessage id="ui-rs.yes" />
          : <FormattedMessage id="ui-rs.no" />
        }
      />
      <KeyValue
        label={<FormattedMessage id="ui-rs.settings.notices.description" />}
        value={notice.description}
      />
      <AccordionSet>
        <Accordion id="email-template" label={<FormattedMessage id="ui-rs.settings.notices.email" />}>
          <KeyValue
            label={<FormattedMessage id="ui-rs.settings.notices.subject" />}
            value={localizedTemplate.header}
          />
          <KeyValue
            label={<FormattedMessage id="ui-rs.settings.notices.body" />}
            value={parsedEmailTemplate}
          />
        </Accordion>
      </AccordionSet>
    </>
  );
};

NoticeDetail.propTypes = {
  initialValues: PropTypes.object,
};

export default NoticeDetail;
