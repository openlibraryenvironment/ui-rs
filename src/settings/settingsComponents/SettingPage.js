import React from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';

import EditableSettingsList from './EditableSettingsList';

const SettingPage = ({
  mutator,
  resources: {
    templates: {
      records: tmp = []
    } = {},
    refdatavalues: {
      records: rdv = []
    } = {},
    settings: {
      records: rows = []
    } = {}
  } = {},
  sectionName
}) => {
  const handleSubmit = (setting) => {
    const settingMutator = mutator.settings;
    const promise = settingMutator.PUT(setting);
    return promise;
  };

  const settings = { 'settings': rows.filter(r => r.section === sectionName) };

  return (
    <EditableSettingsList
      data={{
        refdatavalues: rdv,
        templates: tmp
      }}
      initialValues={settings}
      onSave={handleSubmit}
      onSubmit={handleSubmit}
    />
  );
};

// TODO Once we have access to react-query,
// I would like to refactor this to make it only fetch what we need per page
SettingPage.manifest = Object.freeze({
  settings: {
    type: 'okapi',
    path:'rs/settings/appSettings',
    params: {
      max: '500',
      stats: true,
    },
    records: 'results',
  },
  refdatavalues: {
    type: 'okapi',
    path: 'rs/refdata',
    params: {
      max: '500',
    },
  },
  templates: {
    type: 'okapi',
    path: 'rs/template',
    params: {
      max: '500',
    },
  }
});

SettingPage.propTypes = {
  mutator: PropTypes.shape({
    settings: PropTypes.object
  }),
  sectionName: PropTypes.string,
  resources: PropTypes.shape({
    settings: PropTypes.shape({
      records: PropTypes.array
    }),
    refdatavalues: PropTypes.shape({
      records: PropTypes.array
    })
  })
};

export default stripesConnect(SettingPage);
