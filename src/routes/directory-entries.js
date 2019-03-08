import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { SearchAndSort } from '@folio/stripes/smart-components';
import getSASParams from '@folio/stripes-erm-components/lib/getSASParams';

import ViewDirectoryEntry from '../components/directory-entry/view-directory-entry';
import EditDirectoryEntry from '../components/directory-entry/edit-directory-entry';
import packageInfo from '../../package';

const INITIAL_RESULT_COUNT = 100;

const searchableIndexes = [
  { label: 'Search all fields', value: 'name,tags.value,symbols.symbol' },
  { label: 'Name', value: 'name' },
  { label: 'Tags', value: 'tags.value' },
  { label: 'Symbols', value: 'symbols.symbol' },
];

const filterConfig = [
  {
    label: 'Tag',
    name: 't',
    cql: 'tags.value',
    // XXX values should be obtained at run-time from back-end (PR-149)
    values: [
      'Branch',
      'Community',
      'Consortium',
      'E-ZBorrow',
      'Institution',
      'RapidILL',
      'Reshare',
    ],
  },
];

// Provide the specific mapping that getSASParams wants
function filterConfig2filterKeys(config) {
  return config.reduce((a, e) => Object.assign({}, a, { [e.name]: e.cql }), {});
}


export default class DirectoryEntries extends React.Component {
  static manifest = Object.freeze({
    dirents: {
      type: 'okapi',
      path: 'directory/entry',
      params: getSASParams({
        searchKey: 'name',
        columnMap: {
          'fullyQualifiedName': 'name',
          'tagSummary': 'tags.value',
          'symbolSummary': 'symbols.symbol',
        },
        filterKeys: filterConfig2filterKeys(filterConfig),
      }),
      records: 'results',
      recordsRequired: '%{resultCount}',
      perRequest: 100,
      limitParam: 'perPage',
      resultCount: { initialValue: INITIAL_RESULT_COUNT },
    },
    selectedPatronRequest: {
      type: 'okapi',
      path: 'directory/entry/${directoryEntryId}', // eslint-disable-line no-template-curly-in-string
      fetch: false,
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },

    // If this (query) isn't here, then we get this.props.parentMutator.query is undefined in the UI
    query: {},

    selectedDirectoryEntryId: { initialValue: '' },
  });

  static propTypes = {
    resources: PropTypes.shape({
      query: PropTypes.shape({
        qindex: PropTypes.string,
      }),
    }),

    mutator: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.onClose = this.onClose.bind(this);
    this.state = { };
  }

  onClose() {
    this.toggleModal(false);
  }

  onChangeIndex = (e) => {
    const qindex = e.target.value;
    this.props.stripes.logger.log('action', `changed query-index to '${qindex}'`);
    this.props.mutator.query.update({ qindex });
  }

  handleUpdate = (patronRequest) => {
    // console.log('handleUpdate %o', patronRequest);
    this.props.mutator.selectedPatronRequestId.replace(patronRequest.id);
    return this.props.mutator.selectedPatronRequest.PUT(patronRequest);
  }

  render() {
    const { mutator, resources } = this.props;
    const path = '/directory/entries';
    packageInfo.stripes.route = path;
    packageInfo.stripes.home = path;

    return (
      <React.Fragment>
        <SearchAndSort
          key="dirents"
          objectName="dirents"
          packageInfo={packageInfo}
          searchableIndexes={searchableIndexes}
          selectedIndex={_.get(this.props.resources.query, 'qindex')}
          onChangeIndex={this.onChangeIndex}
          filterConfig={filterConfig}
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={INITIAL_RESULT_COUNT}
          viewRecordComponent={ViewDirectoryEntry}
          editRecordComponent={EditDirectoryEntry}
          viewRecordPerms="module.directory.enabled"
          newRecordPerms="module.directory.enabled"
          detailProps={{
            onUpdate: this.handleUpdate
          }}
          parentResources={{
            ...resources,
            records: resources.dirents,
          }}
          parentMutator={{
            ...mutator,
            records: mutator.dirents,
          }}
          showSingleResult
          visibleColumns={[
            'fullyQualifiedName',
            'tagSummary',
            'symbolSummary'
          ]}
          columnMapping={{
            fullyQualifiedName: <FormattedMessage id="ui-directory.entries.name" />,
            tagSummary: <FormattedMessage id="ui-directory.entries.tagSummary" />,
            symbolSummary: <FormattedMessage id="ui-directory.entries.symbolSummary" />,
          }}
          columnWidths={{
            fullyQualifiedName: '40%',
            tagSummary: '30%',
            symbolSummary: '30%',
          }}
          resultsFormatter={{
            parent: a => a.parent && a.parent.name,
            symbolSummary: a => a.symbolSummary || '',
          }}
        />
      </React.Fragment>
    );
  }
}
