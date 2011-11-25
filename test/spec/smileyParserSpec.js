function smileyMarkup(text, url) {
  return "<abbrev style=\"background-image: url(data:image/png;base64," +
    url + ")\">" + text + "</abbrev>";
}


describe("SmileyParser", function() {
  var parser, domElement, domElement2;

  beforeEach(function() {
    parser = new SmileyParser({"\\bxD+\\b": {imageDataBase64: "lol"},
                               ":-?\\)":    {imageDataBase64: "smile"}});
    domElement  = document.createElement('div');
    domElement2 = document.createElement('div');

    this.addMatchers({
      toParseTo: function(expected, p) {
        if (p === undefined)
          p = parser;
        domElement.innerHTML  = this.actual;
        domElement2.innerHTML = expected;
        p.parseSmileys(domElement);
        console.log('Initially it\'s ' + domElement.innerHTML + ', to be compared to ', expected);
        console.log('Expected to parse to ' + canonicalHtml(domElement2) + ', was ', canonicalHtml(domElement));
        return this.env.equals_(canonicalHtml(domElement), canonicalHtml(domElement2));
      }
    });
  });

  it("should return the same string when there aren't any smileys", function() {
    var someString = "Some string without any smileys";
    expect(someString).toParseTo(someString);
  });

  it("should not be confused with text that looks like a smiley", function() {
    var someString = "FedEx or FexDex?";
    expect(someString).toParseTo(someString);
  });

  it("should replace simple smileys", function() {
    var source   = "I LOLed xD";
    var expected = "I LOLed " + smileyMarkup("xD", "lol");
    expect(source).toParseTo(expected);
  });

  it("should allow smileys to be configured", function() {
    var myParser = new SmileyParser({":-?\\(": {imageDataBase64: "frown"}});
    var source   = "I didn't LOL (xD) :-(";
    var expectedStandard = "I didn't LOL (" + smileyMarkup("xD", "lol") +
          ") :-(";
    var expectedConfigured = "I didn't LOL (xD) " +
          smileyMarkup(":-(", "frown");
    expect(source).toParseTo(expectedStandard);
    expect(source).toParseTo(expectedConfigured, myParser);
  });

  it("should replace many smileys", function() {
    var source   = "I LOLed xD :-) xDD";
    var expected = "I LOLed " + smileyMarkup("xD", "lol") + " " +
          smileyMarkup(":-)", "smile") + " " +
          smileyMarkup("xDD", "lol");
    expect(source).toParseTo(expected);
  });

  it("should be idempotent", function() {
    var source   = "I LOLed xD :-) xDD";
    var expected = "I LOLed " + smileyMarkup("xD", "lol") + " " +
          smileyMarkup(":-)", "smile") + " " +
          smileyMarkup("xDD", "lol");
    var tmpDiv = document.createElement('div');
    tmpDiv.innerHTML = source;
    parser.parseSmileys(tmpDiv);
    var actualOnePass = tmpDiv.innerHTML;
    expect(source).toParseTo(expected);
    expect(actualOnePass).toParseTo(expected);
  });

  it("should play well with ;))", function() {
    var winkParser = new SmileyParser({"\\bxD+\\b": {imageDataBase64: "lol"},
                                       ";-?\\)+":   {imageDataBase64: "wink"}});
    var source   = "Jajaja si, puede ser una solución, pero admito mas ideas... ;))";
    var expected =
          "Jajaja si, puede ser una solución, pero admito mas ideas... " +
          smileyMarkup(";))", "wink");
    var tmpDiv = document.createElement('div');
    tmpDiv.innerHTML = source;
    winkParser.parseSmileys(tmpDiv);
    var actualOnePass = tmpDiv.innerHTML;
    expect(source).toParseTo(expected, winkParser);
    expect(actualOnePass).toParseTo(expected, winkParser);
  });

  it("should play well with character repetitions", function() {
    var winkParser = new SmileyParser({
      ":-?\\)+":              {imageDataBase64: 'imgHappy'},
      ":-?\\(\\(+":           {imageDataBase64: 'imgOhNo'},
      "[:;]-?P+\\b":          {imageDataBase64: 'imgLick'},
      "[:;]'\\(+":            {imageDataBase64: 'imgCry'},
      ";-?\\)+":              {imageDataBase64: 'imgWink'},
      ":-?D+\\b":             {imageDataBase64: 'imgSoMuchWin'},
      "[xX][-']?D+\\b":       {imageDataBase64: 'imgGrin'},
      ":-/+":                 {imageDataBase64: 'imgErr'},
      ":-?\\?+":              {imageDataBase64: 'imgHmmm'},
      "\\^_\\^":              {imageDataBase64: 'imgCyoot'},
      "\\b[oO]_[oO]\\b":      {imageDataBase64: 'imgStareDad'},
      "\\b[fF]+[uU][uU]+\\b": {imageDataBase64: 'imgFuu'},
      "\\bY U NO\\b":         {imageDataBase64: 'imgYUNo'},
      "\\bfap fap( fap)+\\b": {imageDataBase64: 'imgFap'},
      "-troll-":              {imageDataBase64: 'imgTroll'}});
    var source   = "FFUUUU :-((( :))) ;'(( ;-)) xDDD ffuuu";
    var expected = smileyMarkup("FFUUUU", "imgFuu") + " " +
          smileyMarkup(":-(((", "imgOhNo") + " " +
          smileyMarkup(":)))", "imgHappy") + " " +
          smileyMarkup(";'((", "imgCry") + " " +
          smileyMarkup(";-))", "imgWink") + " " +
          smileyMarkup("xDDD", "imgGrin") + " " +
          smileyMarkup("ffuuu", "imgFuu");
    var tmpDiv = document.createElement('div');
    tmpDiv.innerHTML = source;
    winkParser.parseSmileys(tmpDiv);
    var actualOnePass = tmpDiv.innerHTML;
    expect(source).toParseTo(expected, winkParser);
    expect(actualOnePass).toParseTo(expected, winkParser);
  });

  it("should play well with word repetitions", function() {
    var winkParser = new SmileyParser({"\\bfap fap( fap)+\\b":
                                       {imageDataBase64: 'imgFap'}});
    var source   = "fap fap fap mumble mumble fap fap fap fap";
    var expected = smileyMarkup("fap fap fap", "imgFap") +
          " mumble mumble " +
          smileyMarkup("fap fap fap fap", "imgFap");
    var tmpDiv = document.createElement('div');
    tmpDiv.innerHTML = source;
    winkParser.parseSmileys(tmpDiv);
    var actualOnePass = tmpDiv.innerHTML;
    expect(source).toParseTo(expected, winkParser);
    expect(actualOnePass).toParseTo(expected, winkParser);
  });

  it("should be a bit more picky when detecting smilies", function() {
    var myParser = new SmileyParser(
      {"[:;]-?P+\\b":         {imageDataBase64: 'wink'},
       ":-?C":                {imageDataBase64: 'frown'},
       "\\blol\\b|\\bLOL\\b": {imageDataBase64: 'lol'}});
    var source1 = "Newsflash:Catastrophic day for S&amp;P's #lol";
    expect(source1).toParseTo(source1, myParser);
    var source2   = "Smilies: :C ;P lol";
    var expected2 = "Smilies: " + smileyMarkup(":C", "frown") + " " +
          smileyMarkup(";P", "wink") + " " +
          smileyMarkup("lol", "lol");
    expect(source2).toParseTo(expected2, myParser);
  });

  it("should detect smilies at the start of the string", function() {
    var myParser = new SmileyParser(
      {"[:;]-?P+\\b":         {imageDataBase64: 'wink'},
       ":-?C":                {imageDataBase64: 'frown'},
       "\\blol\\b|\\bLOL\\b": {imageDataBase64: 'lol'}});
    var source2   = ":C";
    var source3   = ";P";
    var source4   = "lol";
    var expected2 = smileyMarkup(":C", "frown");
    var expected3 = smileyMarkup(";P", "wink");
    var expected4 = smileyMarkup("lol", "lol");
    expect(source2).toParseTo(expected2, myParser);
    expect(source3).toParseTo(expected3, myParser);
    expect(source4).toParseTo(expected4, myParser);
  });

  it("should detect smilies with angle brackets", function() {
    var myParser = new SmileyParser(
      {"</troll(ing)?>": {imageDataBase64: 'troll'}});
    var source   = "&lt;/troll&gt; &lt;/trolling&gt;";
    var expected = smileyMarkup("&lt;/troll&gt;", "troll") + " " +
          smileyMarkup("&lt;/trolling&gt;", "troll");
    expect(source).toParseTo(expected, myParser);
  });
});
