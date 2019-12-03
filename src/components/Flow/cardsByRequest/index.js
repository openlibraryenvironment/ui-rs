/* eslint-disable react/prop-types */
import React from 'react';
import CitationMetadataInfo from '../../ViewPatronRequest/sections/CitationMetadataInfo';
import CatalogInfo from '../../ViewPatronRequest/sections/CatalogInfo';

export const Citation = ({ request }) => <CitationMetadataInfo record={request} id="citation" />;
export const Item = ({ request }) => <CatalogInfo record={request} id="citation" />;
