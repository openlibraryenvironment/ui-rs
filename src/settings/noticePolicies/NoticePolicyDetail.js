import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Accordion, AccordionSet, Card, KeyValue, Row } from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';

const NoticePolicyDetail = ({ initialValues: noticePolicy, resources }) => {
  const refdataLookup = resources?.refdatavalues?.records
    .filter(obj => obj?.desc?.startsWith('notice'))
    .reduce((acc, cur) => {
      for (const value of cur.values) {
        acc[value.id] = value.label;
      }
      return acc;
    }, {});
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
          {resources?.refdatavalues?.hasLoaded && noticePolicy.notices.map(notice => {
            const template = notice.template;

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
                    label={<FormattedMessage id="ui-rs.settings.noticePolicies.format" />}
                    value={refdataLookup[notice.format?.id]}
                    key={notice.format}
                  />
                </Row>
                <Row>
                  <KeyValue
                    label={<FormattedMessage id="ui-rs.settings.noticePolicies.trigger" />}
                    value={refdataLookup[notice.trigger?.id]}
                    key={notice.trigger}
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
  refdatavalues: {
    type: 'okapi',
    path: 'rs/refdata',
    params: {
      max: '500',
    },
  },
});

export default stripesConnect(NoticePolicyDetail);
