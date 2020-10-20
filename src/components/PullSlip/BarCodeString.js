// HERE BE DRAGONS
//
// The perfectly simple task of rendering a barcode into an SVG string
// turns out to be complicated. This code does it, adapted from sample
// code in the "With svg" section at
// https://github.com/lindell/JsBarcode/blob/master/README.md
// but should be considered a black box.

import JsBarcode from 'jsbarcode';
import { DOMImplementation, XMLSerializer } from 'xmldom';

function barCodeString(text, options) {
  const xmlSerializer = new XMLSerializer();
  const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
  const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  JsBarcode(svgNode, text, { xmlDocument: document, ...options });
  return xmlSerializer.serializeToString(svgNode);
}

export default barCodeString;
