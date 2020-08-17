import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const ActionContext = createContext();

export const ActionProvider = ({ value = { pending: false }, children }) => {
  const [actions, setActions] = useState(value);
  return <ActionContext.Provider value={[actions, setActions]}>{children}</ActionContext.Provider>;
};

ActionProvider.propTypes = { children: PropTypes.node.isRequired, value: PropTypes.object };
