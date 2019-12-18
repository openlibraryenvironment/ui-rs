/* eslint-disable react/prop-types */
import React from 'react';
import CatalogInfo from '../../ViewPatronRequest/sections/CatalogInfo';
import CitationMetadataInfo from '../../ViewPatronRequest/sections/CitationMetadataInfo';

export { default as RequesterSupplier } from './RequesterSupplier';

export const Bibliographic = ({ request }) => <CatalogInfo record={request} id="citation" />;
export const Citation = ({ request }) => <CitationMetadataInfo record={request} id="citation" />;
