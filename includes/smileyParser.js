var defaultSmileyTable = {"\\bxD+\\b":      "http://jeayese.com/emoticons/trollicons/lol.png",
                          ":-?\\)+":        "http://jeayese.com/emoticons/trollicons/happy.png",
                          ":-?\\(":         "http://jeayese.com/emoticons/trollicons/mad.png",
                          ":-?\\(\\(+":     "http://jeayese.com/emoticons/trollicons/ohno.png",
                          "[:;]-?P+\\b":    "http://jeayese.com/emoticons/trollicons/lick.png",
                          "[:;]'\\(+":      "http://jeayese.com/emoticons/trollicons/cry.png",
                          ";-?\\)+":        "http://jeayese.com/emoticons/trollicons/wink.png",
                          ":-?D+\\b":       "http://jeayese.com/emoticons/trollicons/grin.png",
                          ":-/+":           "http://jeayese.com/emoticons/trollicons/err.png",
                          ":-?\\?+":        "http://jeayese.com/emoticons/trollicons/hmmm.png",
                          "\\^_\\^":        "http://jeayese.com/emoticons/trollicons/cyoot.png",
                          "\\b[oO]_[oO]\\b": "http://jeayese.com/emoticons/trollicons/staredad.png",
                          "\\b[fF]+[uU][uU]+\\b": "http://jeayese.com/emoticons/trollicons/fuu.png"};

var SmileyParser = function(smileyTable) { this.init(smileyTable) };
(function ()
 {
     this._smileyTable = {};
     this.init = function(smileyTable) {
         this._smileyTable = smileyTable || defaultSmileyTable;
     };

     this.parseSmileys = function(string) {
         var result = string;
         for (var smiley in this._smileyTable) {
             result = result.replace(new RegExp(smiley, "g"),
                                     "<img src=\"" +
                                         this._smileyTable[smiley] + "\" />");
         }
         return result;
     };
 }).call(SmileyParser.prototype);
