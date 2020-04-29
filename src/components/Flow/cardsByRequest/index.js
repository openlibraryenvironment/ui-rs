/* eslint-disable react/prop-types */
import React from 'react';
import CitationMetadataInfo from '../../ViewPatronRequest/sections/CitationMetadataInfo';

export { CatalogInfo as Bibliographic } from '@folio/stripes-reshare/cards';
export { RequesterSupplier } from '@folio/stripes-reshare/cards';
export { default as LoanConditions } from './LoanConditions';

export const Citation = ({ request }) => <CitationMetadataInfo record={request} id="citation" />;
