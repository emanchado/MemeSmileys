function replaceSmileys(where) {
    var smileyParser = new SmileyParser;
    var classes = ['commentContent', 'messageBody',
                   'MessagingMessage',                // Facebook
                   'tweet-text',                      // Twitter
                   'a-b-f-i-p-R', 'a-f-i-W-p',        // Google Plus (obsolete)
                   'a-N-j Hx qp', 'xk',               // Google Plus
                   'my_current_info',                 // VKontakte
                   'mail_envelope_body wall_module wrapped',
                   'wall_post_text', 'wall_reply_text',
                   'wall_module', 'profile_full_info', 'fc_msgs'
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
