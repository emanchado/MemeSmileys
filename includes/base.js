window.addEventListener('load', function() {
    var smileyParser = new SmileyParser;
    var classes = ['commentContent', 'messageBody'];
    for (var ci = 0, l = classes.length; ci < l; ci++) {
        var nodes = document.getElementsByClassName(classes[ci]);
        for (var i in nodes) {
            if (nodes[i].innerHTML) {
                nodes[i].innerHTML = smileyParser.parseSmileys(nodes[i].innerHTML);
            }
        }
    }
}, false);
