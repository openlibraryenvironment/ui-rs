import { useIntl } from 'react-intl';
import { useOkapiQuery } from '@projectreshare/stripes-reshare';

// Fetches a refdata vocab and filters its contents to only include values
// specified in a comma delimited setting and arranges the result for use
// in a select element (eg. as an array of { label: ..., value: ... })
//
// returns tuple of [ <data for select>, <bool that is false until data available> ]
const useFilteredSelectifiedRefdata = (vocab, settingSection, settingKey, translationPrefix) => {
  const intl = useIntl();
  const refdataQ = useOkapiQuery('rs/refdata', {
    searchParams: {
      filters: `desc=${vocab}`,
    },
    staleTime: 2 * 60 * 60 * 1000
  });
  const settingQ = useOkapiQuery('rs/settings/appSettings', {
    searchParams: {
      filters: `section==${settingSection}`,
      perPage: '100',
    },
    staleTime: 2 * 60 * 60 * 1000
  });

  if (!(refdataQ.isSuccess && settingQ.isSuccess && Array.isArray(settingQ.data))) {
    return [undefined, false];
  }

  const settingValue = settingQ.data.find(el => el.key === settingKey).value;

  const validValues = settingValue?.split(',');
  const result = refdataQ.data[0].values
    .map(entry => entry.value)
    .filter(v => (settingValue ? validValues.includes(v) : true))
    .map(v => ({
      label: intl.formatMessage({ id: `${translationPrefix}.${v}` }),
      value: v
    }))
    .sort((a, b) => a.label?.localeCompare(b.label));
  return [result, true];
};

export default useFilteredSelectifiedRefdata;
