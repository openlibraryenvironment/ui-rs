import get from 'lodash/get';
// eslint-disable-next-line import/no-webpack-loader-syntax
import reset from '!!style-loader?injectType=lazyStyleTag!css-loader!reset-css/reset.css';
// eslint-disable-next-line import/no-webpack-loader-syntax
import style from '!!style-loader?injectType=lazyStyleTag!postcss-loader!./design/style.css';
import { formatConditionCode, formatConditionNote } from '../../util/formatCondition';
import barCodeString from './BarCodeString';
import logoUrl from './design/images/palci-logo.png';

function establishStylesHook() {
  reset.use();
  style.use();
  return () => {
    style.unuse();
    reset.unuse();
  };
}

function styledBarCodeString(text) {
  return barCodeString(text, {
    format: 'code39',
    displayValue: false,
    background: 'transparent',
    lineColor: '#000000',
    margin: 0,
    marginLeft: 0,
    height: 30,
    width: 1
  });
}

function formatSymbols(symbols) {
  return symbols
    .filter(cur => cur.priority === 'shipping')
    .reduce((acc, cur) => [...acc, `${cur?.authority?.symbol ?? ''}:${cur?.symbol ?? ''}`], []);
}

function recordToPullSlipData(intl, record) {
  const now = new Date();
  const id = record.hrid || record.id;
  let name;
  if (record.patronSurname) {
    name = record.patronSurname;
    if (record.patronGivenName) name = `${name}, ${record.patronGivenName}`;
  } else {
    // Better than nothing
    name = record.patronIdentifier;
  }

  const pul = get(record, 'pickLocation.name');
  const psl = record.pickShelvingLocation;
  const fullLocation = (pul && psl) ? `${pul} — ${psl}` : (pul || psl);

  const parsedPickup = record?.pickupLocation?.split(' --> ');
  const pickupLocation = parsedPickup?.[0]?.trim() ?? '';
  const toSymbols = parsedPickup?.length > 1 ? [parsedPickup[1]?.trim()] : [];

  return {
    borrower: name,
    pickupLocation,
    requestBarcode: styledBarCodeString(id.substring(0, 18)),
    requestId: id,
    title: record.title,
    author: record.author,
    volume: record.volume,
    phoneNumber: get(record, 'resolvedRequester.owner.phoneNumber'),
    emailAddress: get(record, 'resolvedRequester.owner.emailAddress'),
    callNumber: record.localCallNumber,
    location: fullLocation,
    fromSlug: get(record, 'resolvedSupplier.owner.slug'),
    toSlug: get(record, 'resolvedRequester.owner.slug') || record.requestingInstitutionSymbol,
    fromSymbols: formatSymbols(record?.pickLocation?.correspondingDirectoryEntry?.symbols ?? []),
    toSymbols,
    now: `${intl.formatDate(now)} ${intl.formatTime(now)}`,
    logo: logoUrl, // XXX Should be somehow obtained from consortium record in directory
    itemBarcode: styledBarCodeString(record.selectedItemBarcode),
    itemId: record.selectedItemBarcode,
    conditions: (record.conditions || []).map(condition => {
      const code = formatConditionCode(condition, intl.formatMessage);
      const note = formatConditionNote(condition);
      if (condition.code === 'other') {
        return note ? `${code}: ${note}` : code;
      } else {
        return note ? `${code} (${note})` : code;
      }
    }),
  };
}

export { establishStylesHook, recordToPullSlipData };
