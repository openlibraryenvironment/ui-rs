var pageSizeA4Width = "210mm"
var pageSizeA4Height = "297mm"

//$(window).on('load', function() {
  //everything is loaded
  //triggerBrowserPrintDialog()
//});

function triggerBrowserPrintDialog() {
  window.print();
}

function injectStyles(rule) { //https://css-tricks.com/snippets/javascript/inject-new-css-rules/
  var div = $("<div />", {
    html: '&shy;<style>' + rule + '</style>'
  }).appendTo("body");    
}

function setPageSize() {
  injectStyles('@media print{ @page {size: ' + pageSizeA4Width + ' ' + pageSizeA4Height + ' }}');  
}

//bind checkboxes to .conditional-display sections

//use classes on body to show and hide instead

$("#checkbox--phone-number").change(function(){
  if($(this).is(':checked'))
    $(".site__body").addClass("slips-have-phone-number");
  else
    $(".site__body").removeClass("slips-have-phone-number");
});

$("#checkbox--email").change(function(){
  if($(this).is(':checked'))
    $(".site__body").addClass("slips-have-email");
  else
    $(".site__body").removeClass("slips-have-email");
});

$("#checkbox--due-date").change(function(){
  if($(this).is(':checked'))
    $(".site__body").addClass("slips-have-due-date");
  else
    $(".site__body").removeClass("slips-have-due-date");
});

$("#checkbox--item-barcode").change(function(){
  if($(this).is(':checked'))
    $(".site__body").addClass("slips-have-local-item-barcode");
  else
    $(".site__body").removeClass("slips-have-local-item-barcode");
});

JsBarcode("#request-barcode--1234", "123456781234", { format: "code39",
  displayValue: false,
  background: "transparent",
  lineColor: "#000000",
  margin: 0,
  marginLeft: 0,
  height: 30,
  width: 1
});

JsBarcode("#item-barcode--5678", "567812341234", { format: "code39",
  displayValue: false,
  background: "transparent",
  lineColor: "#000000",
  margin: 0,
  marginLeft: 0,
  height: 30,
  width: 1
});