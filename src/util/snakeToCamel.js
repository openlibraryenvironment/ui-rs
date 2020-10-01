function snakeToCamel(snakeStr) {
  const camelStr = snakeStr.replace(
    /([-_][a-z])/g,
    (group) => group.toUpperCase()
      .replace('-', '')
      .replace('_', '')
  );
  return (camelStr);
}

export default snakeToCamel;
