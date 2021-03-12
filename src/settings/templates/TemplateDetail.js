import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, AccordionSet, KeyValue } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import HtmlToReact, { Parser } from 'html-to-react';

const TemplateDetail = ({ initialValues: notice }) => {
  const parser = new Parser();
  const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);
  const rules = [
    {
      shouldProcessNode: () => true,
      processNode: processNodeDefinitions.processDefaultNode,
    },
  ];
  const localizedTemplate = notice?.localizedTemplates?.en?.template || {};
  const parsedEmailTemplate = parser.parseWithInstructions(localizedTemplate.templateBody, () => true, rules);

  return (
    <>
      <KeyValue
        label={<FormattedMessage id="ui-rs.settings.name" />}
        value={notice.name}
      />
      <KeyValue
        label={<FormattedMessage id="ui-rs.settings.templates.description" />}
        value={notice.description}
      />
      <AccordionSet>
        <Accordion id="email-template" label={<FormattedMessage id="ui-rs.settings.templates.email" />}>
          <KeyValue
            label={<FormattedMessage id="ui-rs.settings.templates.subject" />}
            value={localizedTemplate.header}
          />
          <KeyValue
            label={<FormattedMessage id="ui-rs.settings.templates.body" />}
            value={parsedEmailTemplate}
          />
        </Accordion>
      </AccordionSet>
    </>
  );
};

TemplateDetail.propTypes = {
  initialValues: PropTypes.object,
};

export default TemplateDetail;
