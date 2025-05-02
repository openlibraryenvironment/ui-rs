import { omit } from 'lodash';
import React, { useContext } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'react-final-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Prompt, useLocation } from 'react-router-dom';
import { Button, Pane, Paneset, PaneMenu, KeyValue } from '@folio/stripes/components';
import { CalloutContext, useOkapiKy } from '@folio/stripes/core';
import { useAppSettings, useRefdata } from '@k-int/stripes-kint-components';
import { selectifyRefdata, useCloseDirect, useOkapiQuery, usePerformAction } from '@projectreshare/stripes-reshare';
import ky from 'ky';
import PatronRequestForm from '../components/PatronRequestForm';
import { REFDATA_ENDPOINT, SETTINGS_ENDPOINT } from '../constants/endpoints';
import { SERVICE_TYPE_COPY, SERVICE_TYPE_LOAN } from '../constants/serviceType';
import useFilteredSelectifiedRefdata from '../util/useFilteredSelectifiedRefdata';


// Possible operations performed by submitting this form
const CREATE = 'create';
const EDIT = 'update';
const REREQUEST = 'rerequest';
const REVALIDATE = 'revalidate';

// Actions performed by each operation
const OP_ACTION = {
  [REREQUEST]: 'rerequest',
  [REVALIDATE]: 'requesterRetryValidation'
};

const SI_FIELDS = ['title', 'author', 'edition', 'isbn', 'issn', 'oclcNumber', 'publisher', 'publicationDate', 'placeOfPublication'];
// Eventually we want an allowlist of the fields mutable via the form but currently rerequest depends on
// the previous behaviour of resubmitting the whole request. Trimming at this point mainly to avoid noise
// in the audit trail.
const LARGE_UNEDITABLE_FIELDS = ['audit', 'bibrecord', 'batches', 'conditions', 'notifications', 'requestIdentifiers', 'rota', 'tags', 'validActions', 'volumes', 'lastProtocolData', 'protocolAudit', 'resolvedPatron', 'resolvedPickupLocation', 'resolvedSupplier', 'state', 'stateModel'];

// state, tools parameters are from being used as Final Form "mutator" rather than called directly
const handleSISelect = (args, state, tools) => {
  Object.entries(args[0]).forEach(([field, value]) => tools.changeValue(state, field, () => value));
  SI_FIELDS.filter(field => !(field in args[0])).forEach(field => tools.changeValue(state, field, () => undefined));
};

const CreateEditRoute = props => {
  const { history, match } = props;
  const id = match.params?.id;
  const performAction = usePerformAction(id);
  const routerLocation = useLocation();
  const callout = useContext(CalloutContext);
  const intl = useIntl();
  const queryClient = useQueryClient();
  const okapiKy = useOkapiKy();
  const close = useCloseDirect();
  const [serviceLevels, serviceLevelsLoaded] = useFilteredSelectifiedRefdata('ServiceLevels', 'other', 'displayed_service_levels', 'ui-rs.refdata.serviceLevel');

  const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
  };

  const defaultRequesterSymbolSetting = useAppSettings({
    endpoint: SETTINGS_ENDPOINT,
    sectionName: 'requests',
    keyName: 'default_request_symbol',
    returnQuery: true,
  });

  const locQuery = useOkapiQuery(
    'directory/entry',
    {
      searchParams: '?filters=(type.value%3D%3Dinstitution)%7C%7C(tags.value%3Di%3Dpickup)&filters=status.value%3D%3Dmanaged&perPage=100',
      kyOpt: { throwHttpErrors: false },
      useErrorBoundary: false,
      refetchOnWindowFocus: false,
      retryOnMount:false,
      enabled: !isEmpty(defaultRequesterSymbolSetting)
    }
  );

  const reqQuery = useOkapiQuery(`rs/patronrequests/${id}`, { enabled: !!id });
  const copyrightTypeRefdata = useRefdata({
    desc: 'copyrightType',
    endpoint: REFDATA_ENDPOINT,
    queryParams: {
      staleTime: 5 * 60 * 1000,
    }
  });
  const currencyCodeRefdata = useRefdata({
    desc: 'CurrencyCodes',
    endpoint: REFDATA_ENDPOINT,
    queryParams: {
      staleTime: 5 * 60 * 1000,
    }
  });
  const copyrightTypes = selectifyRefdata(copyrightTypeRefdata);
  const currencyCodes = selectifyRefdata(currencyCodeRefdata);

  const defaultCopyrightSetting = useAppSettings({
    endpoint: SETTINGS_ENDPOINT,
    sectionName: 'other',
    keyName: 'default_copyright_type',
  });

  const defaultServiceLevelSetting = useAppSettings({
    endpoint: SETTINGS_ENDPOINT,
    sectionName: 'other',
    keyName: 'default_service_level',
  });

  const directoryAPIEndpointSetting = useAppSettings({
    endpoint: SETTINGS_ENDPOINT,
    sectionName: 'requests',
    keyName: 'directory_api_url',
    returnQuery: true,
  });

  const defaultCopyrightTypeId = copyrightTypeRefdata[0]?.values?.filter(v => v.value === defaultCopyrightSetting.value)?.[0]?.id;

  const onSuccessfulEdit = async () => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    await queryClient.invalidateQueries(`rs/patronrequests/${id}`);
    await queryClient.invalidateQueries('rs/patronrequests');
    close();
  };

  const updater = useMutation({
    mutationFn: (updated) => okapiKy
      .put(`rs/patronrequests/${id}`, { json: updated })
      .then((res) => res.data),
    onSuccess: onSuccessfulEdit,
    onError: async (err) => {
      callout.sendCallout({ type: 'error',
        message: (
          <KeyValue
            label={<FormattedMessage id="ui-rs.update.error" />}
            value={err.response?.statusText || ''}
          />
        ) });
    },
  });

  const creator = useMutation({
    mutationFn: (newRecord) => okapiKy
      .post('rs/patronrequests', { json: newRecord }),
    onSuccess: async (res) => {
      const created = await res.json();
      // When creating a new request we need to delay before redirecting to the request's page to
      // give the server some time to resolve the requesting institution from the symbol and generate
      // an appropriate ID.
      await new Promise(resolve => setTimeout(resolve, 3000));
      // We want to go to the new record but we also want it to be easy to return to where we were,
      // hence use of history.replace rather than history.push -- the create form turns into the
      // created record.
      history.replace(`view/${created.id}?${routerLocation.search}`);
    },
    onError: async (err) => {
      callout.sendCallout({ type: 'error',
        message: (
          <KeyValue
            label={<FormattedMessage id="ui-rs.create.error" />}
            value={err.response?.statusText || ''}
          />
        ) });
    },
  });

  const validRequesterRecords = locQuery.isSuccess ? (locQuery.data
    .filter(rec => rec?.type?.value === 'institution' && rec?.symbols?.[0]?.authority?.symbol)) : [];

  const requesters = validRequesterRecords?.reduce((acc, cur) => ([...acc, { value: `${cur.symbols[0].authority.symbol}:${cur.symbols[0].symbol}`, label: cur.name }]), []);

  const requesterList = requesters?.length > 0 ? requesters : [defaultRequesterSymbolSetting.value];


  if (!(requesterList?.length)) {
    throw new Error('Cannot resolve symbol to create requests as');
  }

  const queryFunc = async () => {
    const res = await ky(
      encodeURI(`${directoryAPIEndpointSetting.value}?maximumRecords=100&cql=symbol any ${requesterList[0]}`),
      {
        throwHttpErrors: false
      }
    );
    return res.json();
  };

  const directoryAPIQuery = useQuery(
    'directoryAPIQuery',
    queryFunc,
    {
      useErrorBoundary: false,
      refetchOnWindowFocus: false,
      retryOnMount:false,
      enabled: !isEmpty(directoryAPIEndpointSetting) && !isEmpty(defaultRequesterSymbolSetting)
    }
  );


  if (locQuery.isLoading ||
     directoryAPIQuery.isLoading ||
     !serviceLevelsLoaded ||
     isEmpty(copyrightTypeRefdata) ||
     isEmpty(defaultCopyrightSetting) ||
     isEmpty(defaultRequesterSymbolSetting)) {
    return null;
  }


  // locations are where rec.type.value is 'branch' and there is a tag in rec.type.tags where the value is 'pickup'
  // and are formatted for the Select component as { value: lmsLocationCode, label: name }
  const locations = locQuery.isSuccess ? (locQuery.data
    .filter(rec => rec?.type?.value === 'branch'
      && rec?.tags.reduce((acc, cur) => acc || cur?.value === 'pickup', false))
    .reduce((acc, cur) => ([...acc, { value: cur.slug, label: cur.name }]), [])) : [];


  const apiLocations = directoryAPIQuery.isSuccess
    ? directoryAPIQuery.data?.items?.filter(item => item.type === 'branch')?.map(item => ({ label: item.name, value: item.name }))
    : [];



  // Determine operation
  let op;
  if (id) {
    if (routerLocation.pathname.endsWith('rerequest')) op = REREQUEST;
    else if (routerLocation.pathname.endsWith('revalidate')) op = REVALIDATE;
    else op = EDIT;
  } else op = CREATE;

  let initialValues;
  if (id) {
    if (!reqQuery.isSuccess) return null;
    const record = reqQuery.data;
    initialValues = { ...record,
      formattedDateCreated: (
        intl.formatDate(record.dateCreated) + ', ' + intl.formatTime(record.dateCreated)
      ),
      serviceType: { value: record?.serviceType?.value } };
  } else {
    initialValues = {
      copyrightType: { id: defaultCopyrightTypeId },
      serviceLevel: { value: defaultServiceLevelSetting.value },
      serviceType: { value: SERVICE_TYPE_LOAN },
    };
  }

  const reg = /.+\/create\/(\d+)/;
  const sysIdMatch = reg.exec(routerLocation?.pathname);

  if (sysIdMatch && op === CREATE) {
    initialValues.systemInstanceIdentifier = sysIdMatch[1];
  }

  const submit = async submittedRecord => {
    if (op === CREATE) {
      const baseRecord = {
        requestingInstitutionSymbol: requesterList[0].value,
        isRequester: true
      };
      const newRecord = {
        ...baseRecord,
        ...(submittedRecord.serviceType?.value === SERVICE_TYPE_COPY ? submittedRecord : omit(submittedRecord, 'copyrightType')),
      };
      return creator.mutateAsync(newRecord);
    }

    // too many fields flow through from the record used to initialise the form
    const trimmedRecord = omit(submittedRecord, LARGE_UNEDITABLE_FIELDS);

    if (op === EDIT) return updater.mutateAsync(trimmedRecord);

    // Since it's not create or edit, this route is for an action that involves updating the request
    const opAction = OP_ACTION[op];
    const res = await performAction(opAction, trimmedRecord,
      { error: `stripes-reshare.actions.${opAction}.error`, success: `stripes-reshare.actions.${opAction}.success` });

    if (res.json && (await res.json()).status === true) {
      if (op === REREQUEST) {
        const refetched = await reqQuery.refetch();
        const newReqId = refetched.data?.succeededBy?.id;
        // When creating a new request we need to delay before redirecting to the request's page to
        // give the server some time to resolve the requesting institution from the symbol and generate
        // an appropriate ID.
        await new Promise(resolve => setTimeout(resolve, 3000));
        if (newReqId) history.replace(`../${newReqId}${routerLocation.search}`);
      } else {
        await onSuccessfulEdit();
      }
    }
    return res;
  };

  return (
    <Paneset>
      <Form onSubmit={submit} initialValues={initialValues} mutators={{ handleSISelect }} keepDirtyOnReinitialize>
        {({ form, handleSubmit, pristine, submitting, submitSucceeded }) => (
          <Pane
            defaultWidth="100%"
            centerContent
            onClose={close}
            dismissible
            lastMenu={
              <PaneMenu>
                <Button
                  id={`clickable-${op}-rs-entry`}
                  type="submit"
                  disabled={pristine || submitting}
                  onClick={handleSubmit}
                  buttonStyle="primary paneHeaderNewButton"
                  marginBottom0
                >
                  <FormattedMessage id={`ui-rs.${op}PatronRequest`} />
                </Button>
              </PaneMenu>
            }
            paneTitle={<FormattedMessage id={`ui-rs.${op}PatronRequest`} />}
          >
            <form onSubmit={handleSubmit} id="form-rs-entry">
              <PatronRequestForm
                copyrightTypes={copyrightTypes}
                serviceLevels={serviceLevels}
                currencyCodes={currencyCodes}
                locations={locations?.length ? locations : apiLocations}
                requesters={requesterList}
                onSISelect={form.mutators.handleSISelect}
              />
            </form>
            <FormattedMessage id="ui-rs.confirmDirtyNavigate">
              {prompt => <Prompt when={!pristine && !(submitting || submitSucceeded)} message={prompt[0]} />}
            </FormattedMessage>
          </Pane>
        )}
      </Form>
    </Paneset>
  );
};

export default CreateEditRoute;
