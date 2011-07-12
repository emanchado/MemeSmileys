function replaceSmileys(where) {
    var smileyParser = new SmileyParser;
    var classes = ['commentContent', 'messageBody',   # Facebook
                   'tweet-text',                      # Twitter
                   'a-b-f-i-p-R', 'a-f-i-W-p'         # Google Plus
                  ];
    if (typeof where.getElementsByClassName !== 'function') {
        return;
    }
    for (var ci = 0, l = classes.length; ci < l; ci++) {
        var nodes = where.getElementsByClassName(classes[ci]);
        for (var i = 0, len2 = nodes.length; i < len2; i += 1) {
            if (nodes[i].innerHTML) {
                nodes[i].innerHTML = smileyParser.parseSmileys(nodes[i].innerHTML);
            }
        }
    }
}

window.addEventListener('load', function() {
    replaceSmileys(document);

    window.document.addEventListener('DOMNodeInserted', function(event) {
        replaceSmileys(event.target);
    }, false);
}, false);
