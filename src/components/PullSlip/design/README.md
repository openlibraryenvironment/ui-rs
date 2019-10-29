# Design for pull-slips

This is derived from code by Filip Jakobsen at CodePen.io.
[https://codepen.io/filipjakobsen/pen/0c8eca3b84f795cb5e07cf64b63fbc40](https://codepen.io/filipjakobsen/pen/0c8eca3b84f795cb5e07cf64b63fbc40).

`index.html` from the original code is renamed `pullslip.handlebars`, so that WebPack's Handlebars loader correctly interprets it as a template. It has been modified to include template placeholders instead of dummy values, and cut down from a full page to the div containing a single pull-slip.
