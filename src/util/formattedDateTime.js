import React from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';

function formattedDateTime(dateTime) {
  return (
    <>
      <FormattedDate value={dateTime} />
      ,&nbsp;
      <FormattedTime value={dateTime} hour="numeric" minute="numeric" second="numeric" />
    </>
  );
}

export default formattedDateTime;
