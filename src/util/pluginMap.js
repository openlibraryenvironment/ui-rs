import { useIntl } from 'react-intl';

import pluginGeneric from '@k-int/address-plugin-generic';
import pluginNA from '@k-int/address-plugin-north-america';
import pluginGBR from '@k-int/address-plugin-british-isles';

const plugins = [pluginGeneric, pluginNA, pluginGBR];
const pluginMap = {};
plugins.forEach(plugin => {
  plugin.listOfSupportedCountries.forEach(country => {
    pluginMap[country] = plugin;
  });
});

const useSupportedAddressFormats = () => {
  const intl = useIntl();
  const supportedAddressFormats = [{ value: '', label: '', disabled: true }];
  plugins.forEach(plugin => {
    plugin.listOfSupportedCountries.forEach(country => {
      supportedAddressFormats.push({ value: country, label: intl.formatMessage({ id: `ui-${plugin.pluginName}.${country}.countryCode` }) });
    });
  });

  return supportedAddressFormats;
};

export {
  plugins,
  pluginMap,
  useSupportedAddressFormats
};
