import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Accordion, AccordionSet, Card, KeyValue, Row } from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';

const NoticePolicyDetail = ({ initialValues: noticePolicy, resources }) => {
  return (
    <>
      <KeyValue
        label={<FormattedMessage id="ui-rs.settings.noticePolicies.name" />}
        value={noticePolicy.name}
      />
      <KeyValue
        label={<FormattedMessage id="ui-rs.settings.noticePolicies.active" />}
        value={noticePolicy.active
          ? <FormattedMessage id="ui-rs.yes" />
          : <FormattedMessage id="ui-rs.no" />
        }
      />
      <KeyValue
        label={<FormattedMessage id="ui-rs.settings.noticePolicies.description" />}
        value={noticePolicy.description}
      />
      <AccordionSet>
        <Accordion label={<FormattedMessage id="ui-rs.settings.noticePolicies.notices" />}>
          {resources?.templates?.hasLoaded && noticePolicy.notices.map(notice => {
            const template = resources.templates.records.filter(record => record.id === notice.template)[0];
            return (
              <Card headerStart=" " key={notice.id}>
                <Row>
                  <KeyValue
                    label={<FormattedMessage id="ui-rs.settings.noticePolicies.template" />}
                    value={template.name}
                    key={notice.template}
                  />
                </Row>
                <Row>
                  <KeyValue
                    label={<FormattedMessage id="ui-rs.settings.noticePolicies.realTime" />}
                    value={notice.realTime
                      ? <FormattedMessage id="ui-rs.yes" />
                      : <FormattedMessage id="ui-rs.no" />
                    }
                    key={notice.template}
                  />
                </Row>
              </Card>
            );
          })}
        </Accordion>
      </AccordionSet>
    </>
  );
};

NoticePolicyDetail.manifest = Object.freeze({
  templates: {
    type: 'okapi',
    path: 'templates',
    records: 'templates',
    params: {
      query: 'active="true"',
    },
  }
});

export default stripesConnect(NoticePolicyDetail);
