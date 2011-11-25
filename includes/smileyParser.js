var SmileyParser = function(smileyTable) { this.init(smileyTable); };
(function ()
 {
   this._smileyTable = {};
   this.init = function(smileyTable) {
     /* Returns a function that receives the matched text and the
      first matched group in the regular expression. The first group
      is always a fake lookbehind. If there's anything, we should
      return the text back, without creating any graphical smiley */
     function replaceFunction(s) {
       return function(text, lb) {
         if (lb) return document.createTextNode(text);
         var smileyInfo = self._smileyTable[s];
         var smileyDom = document.createElement('abbrev');
         smileyDom.innerHTML = text.replace(/&/g, '&amp;').
                                    replace(/</g, '&lt;').
                                    replace(/>/g, '&gt;');
         var url = "data:image/png;base64," + smileyInfo.imageDataBase64;
         smileyDom.style.backgroundImage = "url(" + url + ")";
         if (smileyInfo.height !== undefined)
           smileyDom.style.height  = smileyInfo.height + "px";
         if (smileyInfo.width !== undefined)
           smileyDom.style.width   = smileyInfo.width  + "px";
         smileyDom.style.display = 'inline-block';
         smileyDom.style.color   = 'transparent';
         smileyDom.style.overflow = 'hidden';
         return smileyDom;
       };
     }
     this._smileyTable = smileyTable || defaultSmileyTable;
     this._handlers = [];
     for (var smiley in this._smileyTable) {
       if (this._smileyTable.hasOwnProperty(smiley)) {
         var self = this;
         this._handlers.push({pattern:     new RegExp('(["a-zA-Z0-9#])?' +
                                                      smiley, "g"),
                              replacement: replaceFunction(smiley)});
       }
     }
   };

   this.parseSmileys = function(element) {
     replaceTextWithElements(element, {excludedTags: /textarea/,
                                       handlers: this._handlers});
   };
 }).call(SmileyParser.prototype);
