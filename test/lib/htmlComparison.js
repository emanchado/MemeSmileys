function canonicalElementHtml(element) {
  var result = "<" + element.nodeName.toLowerCase();
  var attrPairs = [];
  for (var ai = 0, alen = element.attributes.length; ai < alen; ++ai) {
    attrPairs.push([ element.attributes[ai].name,
                     element.attributes[ai].value ]);
  }
  // Order the attributes
  var orderedAttrPairs = attrPairs.sort(function(a, b) {
    if (a[0] === b[0]) return 0;
    return (a[0] > b[0]) ? 1 : -1;
  });
  for (var ai2 = 0, alen2 = orderedAttrPairs.length; ai2 < alen2; ++ai2) {
    result += " " + orderedAttrPairs[ai2][0] + '="' + orderedAttrPairs[ai2][1] + '"';
  }
  if (element.childNodes.length > 0) {
    result += ">";
    result += canonicalHtml(element) +
      "</" + element.nodeName.toLowerCase() + ">";
  } else {
    result += " />";
  }
  return result;
}


function canonicalSmiley(element) {
  console.log(element.textContent);
  return "<smiley url=\"" + element.style.backgroundImage + "\"" +
    ((element.style.height !== undefined) ?
        " height=\"" + element.style.height + "\"" : "") +
    ((element.style.width !== undefined) ?
        " width=\"" + element.style.width + "\"" : "") +
    ">" + element.textContent.replace(/&/g, '&amp;').
                              replace(/</g, '&lt;').
                              replace(/>/g, '&gt;') +
    "</smiley>";
}


function canonicalHtml(element) {
  var result = "";
  var cn = element.childNodes;
  for (var i = 0, len = cn.length; i < len; ++i) {
    if (cn[i] instanceof Element) {
      if (cn[i].nodeName.toLowerCase() === 'abbrev') {
        result += canonicalSmiley(cn[i]);
      } else {
        result += canonicalElementHtml(cn[i]);
      }
    } else {
      result += cn[i].nodeValue.replace(/&/g, '&amp;').
                                replace(/</g, '&lt;').
                                replace(/>/g, '&gt;');
    }
  }
  return result;
}
