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
