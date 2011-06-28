function replaceSmileys(where) {
    var smileyParser = new SmileyParser;
    var classes = ['commentContent', 'messageBody', 'tweet'];
    for (var ci = 0, l = classes.length; ci < l; ci++) {
        var nodes = where.getElementsByClassName(classes[ci]);
        for (var i in nodes) {
            if (nodes[i].innerHTML) {
                nodes[i].innerHTML = smileyParser.parseSmileys(nodes[i].innerHTML);
            }
        }
    }
}

window.addEventListener('load', function() {
    replaceSmileys(document);
}, false);

window.document.addEventListener('DOMNodeInserted', function(event) {
    replaceSmileys(event.target);
}, true);
