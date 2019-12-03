/*
 * There are three key exports here:
 *
 *  ActionMessageProvider: A context provider that stores the current messge.
 *  ActionMessageBanner: A MessageBanner displaying the contents of that provider.
 *  useActionMessage: A hook that offers a [message, setMessage(content, type)] tuple
 */

import React, { createContext, useReducer, useContext } from 'react';
import PropTypes from 'prop-types';
import { MessageBanner } from '@folio/stripes/components';

// actions
const SET_MESSAGE = 'SET_MESSAGE';

export const ActionMessageContext = createContext();

// Message shape is: { message, type } (type corresponds to the MessageBanner prop)
const initialState = {
  message: null
};

const actionMessageReducer = (state, action) => {
  switch (action.type) {
    case SET_MESSAGE:
      return {
        ...state,
        message: action.payload,
      };

    default:
      return state;
  }
};

export const ActionMessageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(actionMessageReducer, initialState);
  return (
    <ActionMessageContext.Provider value={[state, dispatch]}>
      {children}
    </ActionMessageContext.Provider>
  );
};
ActionMessageProvider.propTypes = {
  children: PropTypes.object,
};

export const useActionMessage = () => {
  const [state, dispatch] = useContext(ActionMessageContext);

  const setMessage = (content, type) => {
    dispatch({
      type: SET_MESSAGE,
      payload: { content, type },
    });
  };

  return [state.message, setMessage];
};

export const ActionMessageBanner = () => {
  const [{ message: msg }] = useContext(ActionMessageContext);
  if (!msg) return null;
  return <MessageBanner type={msg.type} show dismissable>{msg.content}</MessageBanner>;
};
