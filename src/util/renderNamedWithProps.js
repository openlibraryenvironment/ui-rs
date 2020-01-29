import React from 'react';

// Takes an array of key names, an object of React components and
// an object of props. Renders the components from the object that
// correspond to the provided key names (and in that order), passing
// each component the same props object.
export default (names, components, props) => names.map(
  name => (components[name] ? React.createElement(components[name], { key: name, ...props }) : null)
);
