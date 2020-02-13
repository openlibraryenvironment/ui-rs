import React from 'react';
import initialToUpper from './initialToUpper';

// Takes an array of key names, an object of React components and
// an object of props. Renders the components from the object that
// correspond to the provided key names (and in that order), passing
// each component the same props object.
//
// The optional fourth parameter is a component passed any key
// lacking a specific component as the prop 'name' (since key is
// not forwarded to the component)
export default (names, components, props, Default) => names.map(
  name => (components[initialToUpper(name)]
    ? React.createElement(components[initialToUpper(name)], { key: name, ...props })
    : Default ? <Default key={name} name={name} {...props} /> : null)
);
