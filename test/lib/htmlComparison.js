function canonicalHtml(element) {
  var result = "";
  var cn = element.childNodes;
  for (var i = 0, len = cn.length; i < len; ++i) {
    if (cn[i] instanceof Element) {
      result += "<" + cn[i].nodeName.toLowerCase();
      var attrPairs = [];
      for (var ai = 0, alen = cn[i].attributes.length; ai < alen; ++ai) {
        attrPairs.push([ cn[i].attributes[ai].name,
                         cn[i].attributes[ai].value ]);
      }
      // Order the attributes
      var orderedAttrPairs = attrPairs.sort(function(a, b) {
        if (a[0] === b[0]) return 0;
        return (a[0] > b[0]) ? 1 : -1;
      });
      for (var ai2 = 0, alen2 = orderedAttrPairs.length; ai2 < alen2; ++ai2) {
        result += " " + orderedAttrPairs[ai2][0] + '="' + orderedAttrPairs[ai2][1] + '"';
      }
      if (cn[i].childNodes.length > 0) {
        result += ">";
        result += canonicalHtml(cn[i]) +
            "</" + cn[i].nodeName.toLowerCase() + ">";
      } else {
        result += " />";
      }
    } else {
      result += cn[i].nodeValue.replace(/&/g, '&amp;').
                                replace(/</g, '&lt;').
                                replace(/>/g, '&gt;');
    }
  }
  return result;
}
