var SmileyParser = function(smileyTable) { this.init(smileyTable); };
(function ()
 {
     this._smileyTable = {};
     this.init = function(smileyTable) {
         this._smileyTable = smileyTable || defaultSmileyTable;
         this._handlers = [];
         for (var smiley in this._smileyTable) {
             if (this._smileyTable.hasOwnProperty(smiley)) {
                 var self = this;
                 this._handlers.push({pattern:     new RegExp('(["a-zA-Z0-9#])?' + smiley, "g"),
                                      replacement: (function (s) {
                                        return function(text, lb) {
                                          if (lb) return document.createTextNode(text);
                                          var img =
                                              document.createElement('img');
                                          img.src = self._smileyTable[s];
                                          img.alt = img.title = text;
                                          return img;
                                        };
                                      })(smiley)});
             }
         }
     };

     this.parseSmileys = function(element) {
         replaceTextWithElements(element, {excludedTags: /textarea/,
                                           handlers: this._handlers});
     };
 }).call(SmileyParser.prototype);
