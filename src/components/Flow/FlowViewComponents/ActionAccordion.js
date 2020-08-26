import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Layout, Accordion } from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';
import initialToUpper from '../../../util/initialToUpper';
import renderNamedWithProps from '../../../util/renderNamedWithProps';
import * as primaryActions from '../primaryActions';
import * as moreActions from '../moreActions';
import css from './Flow.css';
import AppNameContext from '../../../AppNameContext';

const ActionAccordion = ({ forCurrent, id, onToggle, open, request, performAction }) => {
  const stripes = useStripes();
  const appName = useContext(AppNameContext);

  let PrimaryAction;
  if (forCurrent.primaryAction) {
    PrimaryAction = _.get(primaryActions, initialToUpper(forCurrent.primaryAction))
      || primaryActions.Generic;
  }
  return (
    <Accordion
      id={id}
      label="TESTING"
      onToggle={onToggle}
      open={open}
    >
      {stripes.hasPerm(`ui-${appName}.edit`) &&
        <>
          {PrimaryAction &&
            <Layout className="padding-top-gutter">
              <PrimaryAction request={request} name={forCurrent.primaryAction} performAction={performAction} />
            </Layout>
          }
          {forCurrent.moreActions.length > 0 &&
            <Layout className={`padding-top-gutter ${css.optionList} ${css.noBorderRadius}`}>
              <strong>More options:</strong>
              {renderNamedWithProps(forCurrent.moreActions, moreActions, { request, performAction }, moreActions.Generic)}
            </Layout>
          }
        </>
      }
    </Accordion>
  );
};

ActionAccordion.propTypes = {
  id: PropTypes.string.isRequired,
  forCurrent: PropTypes.object.isRequired,
  onToggle: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  request: PropTypes.object.isRequired,
  performAction: PropTypes.func.isRequired,
};

export default ActionAccordion;
