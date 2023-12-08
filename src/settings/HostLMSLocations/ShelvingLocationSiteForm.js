import { Field, useFormState } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { Col, Row, Select, TextField, MessageBanner } from '@folio/stripes/components';
import { requiredValidator } from '@folio/stripes-erm-components';
import { useOkapiQuery } from '@projectreshare/stripes-reshare';

const compareLabel = (a, b) => (a.label > b.label ? 1 : a.label < b.label ? -1 : 0);

const ShelvingLocationForm = () => {
  const formState = useFormState();
  const shelvingQuery = useOkapiQuery('rs/shelvingLocations', { searchParams: { perPage: '1000' }, staleTime: 30 * 60 * 1000 });
  if (!shelvingQuery.isSuccess) return null;
  const shelvingOptions = shelvingQuery.data
    .filter(x => x.supplyPreference >= 0)
    .map(x => ({ label: x.name, value: x.id }))
    .sort(compareLabel);

  return (
    <>
      {formState.hasSubmitErrors && <MessageBanner type="error">{formState.submitError}</MessageBanner>}
      <Row>
        <Col xs={12}>
          <Field
            component={Select}
            dataOptions={[{ label: '', value: '' }, ...shelvingOptions]}
            name="shelvingLocation"
            label={<FormattedMessage id="ui-rs.settings.lmsshlv.shelvingLocation" />}
            required
            validate={requiredValidator}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Field
            name="supplyPreference"
            label={<FormattedMessage id="ui-rs.settings.lmsloc.supplyPreference" />}
            component={TextField}
            type="number"
            parse={v => v}
          />
        </Col>
      </Row>
    </>
  );
};

export default ShelvingLocationForm;
