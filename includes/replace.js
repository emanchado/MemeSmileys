/**
 * Recursively applies handlers to text nodes.
 *
 * @param {Element} element root element where to start the conversion
 * @param {Object} options
 * @param {RegExp} options.excludedTags HTML elements to be excluded
 * @param {Handler[]} options.handlers handlers to be applied
 */
function replaceTextWithElements(element, options) {
    if (options.excludedTags.test(element.tagName)) {
        return;
    }

    var nodes = element.childNodes;

    for (var i = 0; i < nodes.length; ++i) {
        var node = nodes.item(i);

        if (node instanceof window.Element) {
            replaceTextWithElements(node, options);
        }
        else if (node instanceof window.Text) {
            var subNodes = splitTextNode(node, options);

            if (subNodes.length > 0) {
                for (var j = 0; j < subNodes.length; ++j) {
                    element.insertBefore(subNodes[j], node);
                }

                element.removeChild(node);
                i += subNodes.length;
            }
        }
    }
}


/**
 * @private
 */
function splitTextNode(textNode, options) {
    var nodes = [textNode];

    for (var i = 0; i < options.handlers.length; ++i) {
        var handler = options.handlers[i];

        for (var j = 0; j < nodes.length; ++j) {
            var node = nodes[j];

            if (node instanceof window.Text) {
                var splitNodes = splitTextNodeByHandler(node, handler);

                if (splitNodes.length > 0) {
                    nodes.splice.apply(nodes, [j, 1].concat(splitNodes));
                    j += splitNodes.length;
                }
            }
        }
    }

    if ((nodes.length == 1) && (nodes[0] === textNode)) {
        return [];
    }
    else {
        return nodes;
    }
}


/**
 * @private
 */
function splitTextNodeByHandler(textNode, handler) {
    var separator = '\0';
    var matches = [];
    var nodes = [];

    var textParts = textNode.nodeValue.replace(handler.pattern, function () {
        matches.push(handler.replacement.apply(handler, arguments));
        return separator;
    }).split(separator);

    if (matches.length == 0) {
        return nodes;
    }

    while (textParts.length > 0) {
        var text = textParts.shift();
        var match = matches.shift();

        if (text.length > 0) {
            nodes.push(document.createTextNode(text));
        }

        if (match instanceof Array) {
            nodes.push.apply(nodes, match);
        }
        else if (match != undefined) {
            nodes.push(match);
        }
    }

    return nodes;
}
