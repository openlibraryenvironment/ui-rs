import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { toCamelCase } from '@k-int/stripes-kint-components';
import { Button, Card, Layout } from '@folio/stripes/components';
import { FileUploader } from '@folio/stripes-data-transfer-components';
import { useOkapiKy } from '@folio/stripes/core';
import { useQueryClient } from 'react-query';
import { useIntlCallout } from '@projectreshare/stripes-reshare';

const ReportSetting = ({ setting }) => {
  const okapiKy = useOkapiKy();
  const queryClient = useQueryClient();
  const sendCallout = useIntlCallout();
  const [editing, setEditing] = useState(false);

  const invalidate = () => queryClient.invalidateQueries('rs/settings/appSettings', { filters: 'section==pullslipConfiguration' });

  const upload = async (dropped) => {
    const formData = new FormData();
    formData.set('file', dropped[0]);
    formData.set('name', dropped[0]?.name);
    formData.set('description', dropped[0]?.name);
    formData.set('domain', 'patonRequest');
    formData.set('contentType', 'application/pdf');
    formData.set('filename', 'report.pdf');
    const uploadResult = await okapiKy.post('rs/report/createUpdate', { body: formData }).json();
    await okapiKy.put(`rs/settings/appSettings/${setting.id}`, { json: { value: uploadResult.report?.id } });
    await invalidate();
    setEditing(false);
    sendCallout('ui-rs.settings.fileSetting.success', 'success');
  };

  const clearValue = async () => {
    await okapiKy.put(`rs/settings/appSettings/${setting.id}`, { json: { value: '' } });
    await invalidate();
    setEditing(false);
  };

  const onDrop = (dropped) => {
    upload(dropped).catch(async e => {
      const res = await e?.response?.json();
      const errMsg = res.error ?? e.message;
      sendCallout('ui-rs.settings.fileSetting.error', 'error', { errMsg });
    });
  };

  return (
    <Card
      headerStart={<FormattedMessage id={`ui-rs.settings.${toCamelCase(setting.section)}.${toCamelCase(setting.key)}`} />}
      headerEnd={
        <Button
          marginBottom0
          disabled={editing}
          onClick={() => {
            setEditing(true);
          }}
        >
          <FormattedMessage id="stripes-reshare.settings.edit" />
        </Button>
      }
      roundedBorder
    >
      {!editing && (setting.value
        ? <FormattedMessage id="ui-rs.settings.fileSetting.valueSet" />
        : <FormattedMessage id="stripes-reshare.settings.noCurrentValue" />
      )}
      {editing &&
        <>
          <FileUploader
            title={<FormattedMessage id="ui-rs.settings.fileSetting.drop" />}
            uploadButtonText={<FormattedMessage id="ui-rs.settings.fileSetting.button" />}
            onDrop={onDrop}
          />
          <Layout className="padding-top-gutter display-flex justify-end">
            <Button
              marginBottom0
              onClick={clearValue}
            >
              <FormattedMessage id="ui-rs.settings.fileSetting.reset" />
            </Button>
            <Button
              marginBottom0
              onClick={() => {
                setEditing(false);
              }}
            >
              <FormattedMessage id="stripes-reshare.cancel" />
            </Button>
          </Layout>
        </>
      }
    </Card>
  );
};

export default ReportSetting;
