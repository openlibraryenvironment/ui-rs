import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import compose from 'compose-function';

import { MultiSelectionFilter, SearchAndSort, withTags } from '@folio/stripes/smart-components';
import { Tags as ERMTags } from '@folio/stripes-erm-components';
import { Accordion, FilterAccordionHeader } from '@folio/stripes/components';
import getSASParams from '@folio/stripes-erm-components/lib/getSASParams';

import { CalloutContext, stripesConnect } from '@folio/stripes/core';

import ViewDirectoryEntry from '../components/ViewDirectoryEntry';
import EditDirectoryEntry from '../components/EditDirectoryEntry';
import packageInfo from '../../package';

import { parseFilters, deparseFilters } from '../util/parseFilters';

const INITIAL_RESULT_COUNT = 100;

const searchableIndexes = [
  { label: 'Search all fields', value: 'name,tags.value,symbols.symbol' },
  { label: 'Name', value: 'name' },
  { label: 'Tags', value: 'tags.value' },
  { label: 'Symbols', value: 'symbols.symbol' },
];

const appDetails = {
  directory: {
    title: 'Directory',
    visibleColumns: [
      'fullyQualifiedName',
      'type',
      'tagSummary',
      'symbolSummary'
    ],
  },
};

class DirectoryEntries extends React.Component {
  static manifest = Object.freeze({
    custprops: {
      type: 'okapi',
      path: 'directory/custprops',
      params: { perPage: '100' },
      shouldRefresh: () => false,
    },
    dirents: {
      type: 'okapi',
      path: 'directory/entry',
      params: getSASParams({
        searchKey: 'name',
        filterKeys: {
          'tags': 'tags.value',
          'type': 'type.value'
        },
        columnMap: {
          'fullyQualifiedName': 'name',
          'tagSummary': 'tags.value',
          'symbolSummary': 'symbols.symbol',
        },
      }),
      records: 'results',
      recordsRequired: '%{resultCount}',
      perRequest: 100,
      limitParam: 'perPage',
      resultCount: { initialValue: INITIAL_RESULT_COUNT },
      throwErrors: false
    },
    namingAuthorities: {
      type: 'okapi',
      path: 'directory/namingAuthority',
      params: { perPage: '100' },
    },
    refdata: {
      type: 'okapi',
      path: 'directory/refdata',
      params: { perPage: '100' },
    },
    selectedRecord: {
      type: 'okapi',
      path: 'directory/entry/${selectedRecordId}', // eslint-disable-line no-template-curly-in-string
      fetch: false,
      // XXX do not do this: see comments at https://openlibraryenvironment.atlassian.net/browse/PR-841
      // PUT: {
      //   headers: {
      //     'Accept': 'application/json',
      //     'Content-Type': 'application/json',
      //   },
      // },
    },
    services: {
      type: 'okapi',
      path: 'directory/service',
      params: {
        filters: 'status.value=managed',
        perPage: '100',
        sort: 'id'
      },
      throwErrors: false,
      resourceShouldRefresh: true,
    },
    directoryTags: {
      type: 'okapi',
      path: 'directory/tags',
      params: { perPage: '100' },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },

    // If this (query) isn't here, then we get this.props.parentMutator.query is undefined in the UI
    query: {},

    selectedRecordId: { initialValue: '' },
  });

  static contextType = CalloutContext;

  static propTypes = {
    resources: PropTypes.shape({
      query: PropTypes.shape({
        qindex: PropTypes.string,
      }),
      directoryTags: PropTypes.shape({
        records: PropTypes.array,
      }),
      custprops: PropTypes.object,
      symbols: PropTypes.object,
      namingAuthorities: PropTypes.object,
      refdata: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.shape({
          values: PropTypes.array,
        })),
      }),
    }),

    mutator: PropTypes.object,

    stripes: PropTypes.shape({
      logger: PropTypes.shape({
        log: PropTypes.func,
      }),
    }),
  }

  constructor(props) {
    super(props);
    this.onClose = this.onClose.bind(this);
  }

  onClose() {
    this.toggleModal(false);
  }

  onChangeIndex = (e) => {
    const qindex = e.target.value;
    this.props.stripes.logger.log('action', `changed query-index to '${qindex}'`);
    this.props.mutator.query.update({ qindex });
  }

  handleCreate = (record) => {
    const { mutator } = this.props;

    mutator.dirents.POST(record)
      .then((newRecord) => {
        this.context.sendCallout({ message: <FormattedMessage id="ui-directory.create.callout" values={{ name: newRecord.name }} /> });
        mutator.query.update({
          _path: `/directory/entries/view/${newRecord.id}`,
          layer: '',
        });
      })
      .catch(response => {
        response.json()
          .then(error => this.context.sendCallout({ type: 'error', message: <FormattedMessage id="ui-directory.create.callout.error" values={{ err: error.message }} /> }))
          .catch(() => this.context.sendCallout({ type: 'error', message: <FormattedMessage id="ui-directory.create.callout.error" values={{ err: '' }} /> }));
      });
  };

  handleUpdate = (record) => {
    this.props.mutator.selectedRecordId.replace(record.id);
    return this.props.mutator.selectedRecord.PUT(record);
  }

  renderFiltersFromData = (options) => {
    const { resources, mutator } = this.props;
    const byName = parseFilters(_.get(resources.query, 'filters'));

    const values = {
      tags: byName.tags || [],
      type: byName.type || [],
    };

    const setFilterState = (group) => {
      if (group.values === null) {
        delete byName[group.name];
      } else {
        byName[group.name] = group.values;
      }
      mutator.query.update({ filters: deparseFilters(byName) });
    };
    const clearGroup = (name) => setFilterState({ name, values: [] });

    const renderGenericFilterSelection = (filterName) => {
      return (
        <Accordion
          label={<FormattedMessage id={`ui-directory.filter.${filterName}`} />}
          id={filterName}
          name={filterName}
          separator={false}
          header={FilterAccordionHeader}
          displayClearButton={values[filterName].length > 0}
          onClearFilter={() => clearGroup(filterName)}
        >
          <MultiSelectionFilter
            name={filterName}
            dataOptions={options[filterName]}
            selectedValues={values[filterName]}
            onChange={setFilterState}
          />
        </Accordion>
      );
    };

    return (
      <>
        {renderGenericFilterSelection('type')}
        {renderGenericFilterSelection('tags')}
      </>
    );
  }

  renderFilters = () => {
    const { resources } = this.props;
    const tags = ((resources.directoryTags || {}).records || []).map(obj => ({ value: obj.value, label: obj.normValue }));
    const type = resources.refdata?.records?.filter(obj => obj.desc === 'DirectoryEntry.Type')[0]?.values || [];

    return this.renderFiltersFromData({
      tags,
      type
    });
  };

  render() {
    const { mutator, resources } = this.props;
    const helperApps = { tags: ERMTags };
    const path = '/directory/entries';
    packageInfo.stripes.route = path;
    const { visibleColumns } = appDetails.directory;

    return (
      <>
        <SearchAndSort
          key="dirents"
          objectName="dirents"
          packageInfo={packageInfo}
          searchableIndexes={searchableIndexes}
          selectedIndex={_.get(this.props.resources.query, 'qindex')}
          onChangeIndex={this.onChangeIndex}
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={INITIAL_RESULT_COUNT}
          getHelperComponent={(name) => helperApps[name]}
          getHelperResourcePath={(helper, id) => `directory/entry/${id}`}
          viewRecordComponent={ViewDirectoryEntry}
          editRecordComponent={EditDirectoryEntry}
          viewRecordPerms="module.directory.enabled"
          newRecordPerms="ui-directory.create"
          onCreate={this.handleCreate}
          detailProps={{
            onCreate: this.handleCreate,
            onUpdate: this.handleUpdate
          }}
          parentResources={{
            ...resources,
            records: resources.dirents,
            services: resources.services,
            custprops: _.get(resources, 'custprops.records', []),
          }}
          parentMutator={{
            query: mutator.query,
            resultCount: mutator.resultCount,
          }}
          showSingleResult
          visibleColumns={visibleColumns}
          columnMapping={{
            fullyQualifiedName: <FormattedMessage id="ui-directory.entries.name" />,
            type: <FormattedMessage id="ui-directory.entries.type" />,
            tagSummary: <FormattedMessage id="ui-directory.entries.tagSummary" />,
            symbolSummary: <FormattedMessage id="ui-directory.entries.symbolSummary" />,
          }}
          columnWidths={{
            fullyQualifiedName: '40%',
            type: '20%',
            tagSummary: '20%',
            symbolSummary: '20%',
          }}
          resultsFormatter={{
            type: a => a.type?.label || '',
            tagSummary: a => a.tagSummary || '',
            symbolSummary: a => a.symbolSummary || '',
          }}
          renderFilters={this.renderFilters}
        />
      </>
    );
  }
}

export default compose(
  stripesConnect,
  withTags,
)(DirectoryEntries);
