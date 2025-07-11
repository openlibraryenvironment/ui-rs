import { useIntl } from 'react-intl';
import { useOkapiQuery, useSetting } from '@projectreshare/stripes-reshare';

// Formats values from a comma-delimited setting (or refdata if unset)
// and their translations for use in a select element
// (eg. as an array of { label: ..., value: ... })
//
// returns tuple of [ <data for select>, <bool that is false until data available> ]
const useFilteredSelectifiedRefdata = (vocab, settingSection, settingKey, translationPrefix) => {
  const intl = useIntl();
  const setting = useSetting(settingKey, settingSection);
  const refdataQ = useOkapiQuery('rs/refdata', {
    searchParams: {
      filters: `desc=${vocab}`,
    },
    staleTime: 2 * 60 * 60 * 1000,
    enabled: setting.isSuccess && !setting.value
  });

  if (!setting.isSuccess || (!setting.value && !refdataQ.isSuccess)) {
    return [undefined, false];
  }

  let values;
  if (setting.value) {
    values = setting.value?.split(',');
  } else {
    values = refdataQ.data[0]?.values.map(entry => entry.value);
  }

  let result = values?.map(v => ({
    label: intl.formatMessage({ id: `${translationPrefix}.${v}` }),
    value: v
  }));

  if (!setting.value) {
    result = result?.sort((a, b) => a.label?.localeCompare(b.label));
  }

  return [result, true];
};

export default useFilteredSelectifiedRefdata;
