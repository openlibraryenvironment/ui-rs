import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { Icon } from '@folio/stripes/components';
import css from './Flow.css';

const statusIcons = {
  done: 'check-circle',
  error: 'exclamation-circle',
  future: 'default',
  manual: 'arrow-right',
};

const Flow = ({ currentState, flow, stateMap }) => {
  const current = stateMap[currentState];
  if (!Array.isArray(current) || !(flow)) return <FormattedMessage id="ui-rs.flow.unknown" />;
  let foundCurrent = false;
  return (
    <ul className={css.flowList}>
      {flow.map((status, i) => {
        let icon;
        let isCurrent = false;
        if (status === current[0]) {
          icon = statusIcons[current[1]];
          foundCurrent = true;
          isCurrent = true;
        } else if (foundCurrent) {
          // Everything after the current status is in the future
          icon = statusIcons.future;
        } else {
          // Everything leading up to the current status is done
          icon = statusIcons.done;
        }
        return (
          <li className={classNames(css.flowListItem, { [css.flowListCurrent]: isCurrent })} key={i}>
            <Icon icon={icon}>
              <FormattedMessage id={`ui-rs.flow.${status}`} />
            </Icon>
          </li>
        );
      })}
    </ul>
  );
};

Flow.propTypes = {
  currentState: PropTypes.string,
  flow: PropTypes.arrayOf(PropTypes.object).isRequired,
  stateMap: PropTypes.object.isRequired
};

export default Flow;
