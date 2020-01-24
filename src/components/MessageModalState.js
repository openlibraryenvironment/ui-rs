/*
 * There are three key exports here:
 *
 *  MessageModalProvider: A context provider that stores the current message and modal.
 *  ContextualMessageBanner: A MessageBanner displaying the contents of that provider.
 *  CancelModalButton: A Button that sets the modal to null, dismissing it
 *  useMessage: A hook that offers a [message, setMessage(translationKey, type)] tuple
 *  useModal: A hook that offers a [modal, setModal(modalKey)] tuple (null to dismiss modal)
 */

import React, { createContext, useReducer, useContext } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Layout, MessageBanner } from '@folio/stripes/components';

export const MessageModalContext = createContext();
// Message shape is: { key, type }
// * key is the translation key for the message,
// * type corresponds to the MessageBanner prop

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

export const MessageModalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <MessageModalContext.Provider value={[state, dispatch]}>
      {children}
    </MessageModalContext.Provider>
  );
};
MessageModalProvider.propTypes = {
  children: PropTypes.object,
};

export const useMessage = () => {
  const [state, dispatch] = useContext(MessageModalContext);
  const setMessage = (key, type) => {
    dispatch({
      type: SET_MESSAGE,
      payload: typeof key === 'string' ? { key, type } : null,
    });
  };
  return [state.message, setMessage];
};

export const useModal = () => {
  const [state, dispatch] = useContext(MessageModalContext);
  const setModal = key => dispatch({ type: SET_MODAL, payload: key });
  return [state.modal, setModal];
};

export const ContextualMessageBanner = () => {
  const [msg, setMsg] = useMessage();
  if (!msg) return null;
  return (
    <Layout className="padding-top-gutter padding-bottom-gutter">
      <MessageBanner
        type={msg.type}
        onExited={() => setMsg(null)}
        dismissable
      >
        <FormattedMessage id={msg.key} />
      </MessageBanner>
    </Layout>
  );
};
