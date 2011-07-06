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
             var self = this;
             result = result.replace(new RegExp('(")?' + smiley, "g"),
                                     function ($0, $1) {
                                         return $1 ? $0 : ("<img alt=\"" + $0 + "\" title=\"" + $0 + "\" src=\"" + self._smileyTable[smiley] + "\" />");
                                     });
         }
         return result;
     };
 }).call(SmileyParser.prototype);
