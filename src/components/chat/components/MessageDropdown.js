import React from 'react';
import { Button, Dropdown, DropdownMenu, IconButton } from '@folio/stripes/components';

import css from './ChatMessage.css';

/* Accepts an array of items of the shape:
{
  onClick: () => ()
  label: 'label'
  ...buttonProps
}
*/
const MessageDropdown = ({ actionItems }) => {
  const renderDropdownButtonContents = () => {
    return (
      <DropdownMenu
        data-role="menu"
        aria-label="actions-for-message"
      >
        {actionItems.map(ai => {
          const { onClick, label, ...buttonProps } = ai;
          return (
            <Button
              buttonStyle="dropdownItem"
              onClick={onClick}
              {...buttonProps}
            >
              {label}
            </Button>
          );
        })}
      </DropdownMenu>
    );
  };
  const trigger = ({
    triggerRef,
    onToggle,
    ariaProps,
  }) => {
    return (
      <IconButton
        autoFocus
        ref={triggerRef}
        icon="ellipsis"
        marginBottom0
        onClick={onToggle}
        {...ariaProps}
      />
    );
  };

  return (
    <Dropdown
      className={css.actionButton}
      renderMenu={renderDropdownButtonContents}
      renderTrigger={trigger}
    />
  );
};

export default MessageDropdown;
