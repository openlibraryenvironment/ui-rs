/* eslint-disable react/prop-types */
import React from 'react';
import CitationMetadataInfo from '../../ViewPatronRequest/sections/CitationMetadataInfo';

export { default as Bibliographic } from '@folio/stripes-reshare/cards/CatalogInfo';
export { default as RequesterSupplier } from '@folio/stripes-reshare/cards/RequesterSupplier';
export { default as LoanConditions } from './LoanConditions';

export const Citation = ({ request }) => <CitationMetadataInfo record={request} id="citation" />;
