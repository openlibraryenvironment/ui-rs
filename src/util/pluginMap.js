import { useIntl } from 'react-intl';

import pluginGeneric from '@k-int/address-plugin-generic';
import pluginNA from '@k-int/address-plugin-north-america';
import pluginGBR from '@k-int/address-plugin-british-isles';
import pluginDE from 'src/components/Plugins/addressPluginGerman'

const COUNTRY_CODE_DE = 'DE';

const plugins = [pluginGeneric, pluginNA, pluginGBR, pluginDE];
const pluginMap = {};
plugins.forEach(plugin => {
  plugin.listOfSupportedCountries.forEach(country => {
    pluginMap[country] = plugin;
  });
});

// Function to generate the message ID, checking for 'DE'
const getCountryCodeId = (pluginName, country) => {
  return country.includes(COUNTRY_CODE_DE)
      ? `ui-directory.${pluginName}.countryCode`
      : `ui-${pluginName}.${country}.countryCode`;
};

const useSupportedAddressFormats = () => {
  const intl = useIntl();
  const supportedAddressFormats = [{ value: '', label: '', disabled: true }];
  plugins.forEach(plugin => {
    plugin.listOfSupportedCountries.forEach(country => {
      supportedAddressFormats.push(
          {
            value: country,
            label: intl.formatMessage({ id: getCountryCodeId(plugin.pluginName, country) })
          }
      );
    });
  });

  return supportedAddressFormats;
};

export {
  plugins,
  pluginMap,
  useSupportedAddressFormats
};
