export const formatConditionNote = (condition) => {
  const { note } = condition;

  if ((note != null) && note.startsWith('#ReShareAddLoanCondition#')) {
    return note.replace(/^#ReShareAddLoanCondition# ?/, '');
  } else {
    return note;
  }
};

export const formatConditionCode = (condition, formatMessage) => {
  return formatMessage({
    id: `ui-rs.settings.customiseListSelect.loanConditions.${condition.code}`,
    defaultMessage: condition.code,
  });
};

export const formatConditionCost = (condition) => {
  if (!condition.cost) return '';
  return condition.cost + ' ' + condition.costCurrency?.value?.toUpperCase();
};
