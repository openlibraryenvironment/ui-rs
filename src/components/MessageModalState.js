/*
 * There are three key exports here:
 *
 *  MessageModalProvider: A context provider that stores the current message and modal.
 *  useMessage: A hook that offers a [message, setMessage(translationKey, type)] tuple
 *  useModal: A hook that offers a [modal, setModal(modalKey)] tuple (null to dismiss modal)
 */

import React, { createContext, useReducer, useContext } from 'react';
import PropTypes from 'prop-types';

export const MessageModalContext = createContext();
// Message shape is: { key, type, values, valuesToTranslate }
// * key is the translation key for the message,
// * type corresponds to the MessageBanner prop
// * values (optional) is a values object to pass to FormattedMessage
// * valuesToTranslate (optional) is an array of keys in values which themselves need translation

const initialState = {
  message: null,
  modal: null,
};

// actions
const SET_MESSAGE = 'SET_MESSAGE';
const SET_MODAL = 'SET_MODAL';

const reducer = (state, action) => {
  switch (action.type) {
    case SET_MESSAGE:
      return {
        ...state,
        message: action.payload,
      };

    case SET_MODAL:
      return {
        ...state,
        modal: action.payload,
      };

    default:
      return state;
  }
};

export const MessageModalProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <MessageModalContext.Provider value={[state, dispatch]}>
      {props.children}
    </MessageModalContext.Provider>
  );
};
MessageModalProvider.propTypes = {
  children: PropTypes.object,
};

export const useMessage = () => {
  const [state, dispatch] = useContext(MessageModalContext);
  const setMessage = (key, type, values, valuesToTranslate) => {
    dispatch({
      type: SET_MESSAGE,
      payload: typeof key === 'string' ? { key, type, values, valuesToTranslate } : null,
    });
  };
  return [state.message, setMessage];
};

export const useModal = () => {
  const [state, dispatch] = useContext(MessageModalContext);
  const setModal = key => dispatch({ type: SET_MODAL, payload: key });
  return [state.modal, setModal];
};
