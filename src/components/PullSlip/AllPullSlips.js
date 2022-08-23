import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Parser } from 'html-to-react';
import { injectIntl } from 'react-intl';
// Need to directory dive here until we upgrade to something including this or similar:
// https://github.com/handlebars-lang/handlebars.js/commit/c6c6bbb41f94b3ce7cbd68ede3fbc3f569dfc7e7
import Handlebars from 'handlebars/lib/handlebars';
import slipTemplate from './design/slip.handlebars';
import wrapperTemplate from './design/allslipswrapper.handlebars';
import { establishStylesHook, recordToPullSlipData } from './util';

function makePairs(singles, fallback) {
  const pairs = [];
  for (let i = 0; i < singles.length; i += 2) {
    pairs.push({
      first: singles[i],
      second: singles[i + 1] || fallback,
    });
  }
  return pairs;
}

function picklistSortComparable(record1, record2) {
    for (let sortPos = 0; sortPos < record1.sortValues.length; sortPos++) {
        if (sortPos < record2.sortValues.length) {
            if (record1.sortValues[sortPos] < record2.sortValues[sortPos]) {
                return (-1);
            } else if (record1.sortValues[sortPos] > record2.sortValues[sortPos]) {
                return (1);
            }
        } else {
            // No more sort positions for record 2
            return (-1);
        }
    }

    // Run out of sort positions for record 1
    return (record1.sortValues.length === record2.sortValues.length ? 0 : -1);
}

function sortRecordsByLationAndCalNumber(records) {
    // Create the sort array on the records
    for (let i = 0; i < records.length; i++) {

        // create a sort array on the record
        let record = records[i];
        record.sortValues = [];

        // Add the pick location to be the first sort field
        if ((record.location !== undefined) && (record.location !== null)) {
            record.sortValues.push(record.location.toUpperCase());
        }

        // If we have a call number then we can attempt tp parse it
        if ((record.callNumber !== undefined) && (record.callNumber !== null)) {
            // Get hold of all the groups in the local call number
            const groupRregexp = /[a-z0-9.]+/gi;
            const groupMatch = record.callNumber.match(groupRregexp);
            if ((groupMatch != null) && (groupMatch.length > 0)) {
                for (let j = 0; j < groupMatch.length; j++) {
                    const sectionRegexp = /([a-z]*)([0-9.]+)/i;
                    const sectionMatch = groupMatch[j].match(sectionRegexp);
                    if ((sectionMatch != null) && (sectionMatch.length > 0)) {
                        // Do not add the first field if it is blank
                        if (sectionMatch[1] !== '') {
                            record.sortValues.push(sectionMatch[1].toUpperCase());
                        }

                        // Do not add the second field if it dosn't exist
                        if ((sectionMatch.length > 2) && (sectionMatch[2] !== '')) {
                            record.sortValues.push(parseFloat(sectionMatch[2]));
                        }
                    }
                }
            }
        }
    }

    // Finally sort the records and return them
    return (records.sort(picklistSortComparable));
}

const AllPullSlips = (props) => {
  useEffect(establishStylesHook, []);
  Handlebars.registerPartial('slip', slipTemplate);
  let records = props.records.map(r => recordToPullSlipData(props.intl, r));
    records = sortRecordsByLationAndCalNumber(records);
// Have left this console logging here to prove what we are sorting by
//  for (let i = 0; i < records.length; i++) {
//    console.log(`Location: ${records[i].location}, Call number: ${records[i].callNumber}, Sort fields:  ${records[i].sortValues}`);
//  }
  const s = wrapperTemplate({ pairs: makePairs(records, {}) });
  return (new Parser()).parse(s);
};

AllPullSlips.propTypes = {
  records: PropTypes.arrayOf(
    PropTypes.object.isRequired,
  ).isRequired,
};

export default injectIntl(AllPullSlips);
