describe("SmileyParser", function() {
    var parser, domElement;

    beforeEach(function() {
        parser = new SmileyParser({"\\bxD+\\b": "lol.png",
                                   ":-?\\)":    "smile.png"});
        domElement = document.createElement('div');

        this.addMatchers({
          toParseTo: function(expected, p) {
            if (p === undefined)
              p = parser;
            domElement.innerHTML = this.actual;
            p.parseSmileys(domElement);
            return this.env.equals_(canonicalHtml(domElement), expected);
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
        var expected = "I LOLed <img alt=\"xD\" src=\"lol.png\" " +
            "title=\"xD\" />";
        expect(source).toParseTo(expected);
    });

    it("should allow smileys to be configured", function() {
        var myParser = new SmileyParser({":-?\\(": "frown.png"});
        var source   = "I didn't LOL (xD) :-(";
        var expectedStandard = "I didn't LOL (<img alt=\"xD\" " +
            "src=\"lol.png\" title=\"xD\" />) :-(";
        var expectedConfigured = "I didn't LOL (xD) <img alt=\":-(\" " +
            "src=\"frown.png\" title=\":-(\" />";
        expect(source).toParseTo(expectedStandard);
        expect(source).toParseTo(expectedConfigured, myParser);
    });

    it("should replace many smileys", function() {
        var source   = "I LOLed xD :-) xDD";
        var expected = "I LOLed <img alt=\"xD\" src=\"lol.png\" " +
            "title=\"xD\" /> " +
            "<img alt=\":-)\" src=\"smile.png\" title=\":-)\" /> " +
            "<img alt=\"xDD\" src=\"lol.png\" title=\"xDD\" />";
        expect(source).toParseTo(expected);
    });

    it("should be idempotent", function() {
        var source   = "I LOLed xD :-) xDD";
        var expected = "I LOLed <img alt=\"xD\" src=\"lol.png\" " +
            "title=\"xD\" /> " +
            "<img alt=\":-)\" src=\"smile.png\" title=\":-)\" /> " +
            "<img alt=\"xDD\" src=\"lol.png\" title=\"xDD\" />";
        var tmpDiv = document.createElement('div');
        tmpDiv.innerHTML = source;
        parser.parseSmileys(tmpDiv);
        var actualOnePass = tmpDiv.innerHTML;
        expect(source).toParseTo(expected);
        expect(actualOnePass).toParseTo(expected);
    });

    it("should play well with ;))", function() {
        var winkParser = new SmileyParser({"\\bxD+\\b": "lol.png",
                                           ";-?\\)+":   "wink.png"});
        var source   = "Jajaja si, puede ser una solución, pero admito mas ideas... ;))";
        var expected = "Jajaja si, puede ser una solución, pero admito mas ideas... <img alt=\";))\" src=\"wink.png\" " +
               "title=\";))\" />";
        var tmpDiv = document.createElement('div');
        tmpDiv.innerHTML = source;
        winkParser.parseSmileys(tmpDiv);
        var actualOnePass = tmpDiv.innerHTML;
        expect(source).toParseTo(expected, winkParser);
        expect(actualOnePass).toParseTo(expected, winkParser);
    });

    it("should play well with character repetitions", function() {
        var winkParser = new SmileyParser({
                          ":-?\\)+":              'imgHappy.png',
                          ":-?\\(\\(+":           'imgOhNo.png',
                          "[:;]-?P+\\b":          'imgLick.png',
                          "[:;]'\\(+":            'imgCry.png',
                          ";-?\\)+":              'imgWink.png',
                          ":-?D+\\b":             'imgSoMuchWin.png',
                          "[xX][-']?D+\\b":       'imgGrin.png',
                          ":-/+":                 'imgErr.png',
                          ":-?\\?+":              'imgHmmm.png',
                          "\\^_\\^":              'imgCyoot.png',
                          "\\b[oO]_[oO]\\b":      'imgStareDad.png',
                          "\\b[fF]+[uU][uU]+\\b": 'imgFuu.png',
                          "\\bY U NO\\b":         'imgYUNo.png',
                          "\\bfap fap( fap)+\\b": 'imgFap.png',
                          "-troll-":              'imgTroll.png'});
        var source   = "FFUUUU :-((( :))) ;'(( ;-)) xDDD ffuuu";
        var expected = "<img alt=\"FFUUUU\" src=\"imgFuu.png\" " +
               "title=\"FFUUUU\" /> <img alt=\":-(((\" src=\"imgOhNo.png\" " +
               "title=\":-(((\" /> <img alt=\":)))\" src=\"imgHappy.png\" " +
               "title=\":)))\" /> <img alt=\";'((\" src=\"imgCry.png\" " +
               "title=\";'((\" /> <img alt=\";-))\" src=\"imgWink.png\" " +
               "title=\";-))\" /> <img alt=\"xDDD\" src=\"imgGrin.png\" " +
               "title=\"xDDD\" /> <img alt=\"ffuuu\" src=\"imgFuu.png\" " +
               "title=\"ffuuu\" />";
        var tmpDiv = document.createElement('div');
        tmpDiv.innerHTML = source;
        winkParser.parseSmileys(tmpDiv);
        var actualOnePass = tmpDiv.innerHTML;
        expect(source).toParseTo(expected, winkParser);
        expect(actualOnePass).toParseTo(expected, winkParser);
    });

    it("should play well with word repetitions", function() {
        var winkParser = new SmileyParser({"\\bfap fap( fap)+\\b":
                                               'imgFap.png'});
        var source   = "fap fap fap mumble mumble fap fap fap fap";
        var expected = "<img alt=\"fap fap fap\" src=\"imgFap.png\" " +
               "title=\"fap fap fap\" /> mumble mumble " +
               "<img alt=\"fap fap fap fap\" src=\"imgFap.png\" " +
               "title=\"fap fap fap fap\" />";
        var tmpDiv = document.createElement('div');
        tmpDiv.innerHTML = source;
        winkParser.parseSmileys(tmpDiv);
        var actualOnePass = tmpDiv.innerHTML;
        expect(source).toParseTo(expected, winkParser);
        expect(actualOnePass).toParseTo(expected, winkParser);
    });

    it("should be a bit more picky when detecting smilies", function() {
        var myParser = new SmileyParser({"[:;]-?P+\\b":         'wink.png',
                                         ":-?C":                'frown.png',
                                         "\\blol\\b|\\bLOL\\b": 'lol.png'});
        var source1 = "Newsflash:Catastrophic day for S&amp;P's #lol";
        expect(source1).toParseTo(source1, myParser);
        var source2   = "Smilies: :C ;P lol";
        var expected2 = "Smilies: <img alt=\":C\" src=\"frown.png\" " +
            "title=\":C\" /> <img alt=\";P\" src=\"wink.png\" " +
            "title=\";P\" /> <img alt=\"lol\" src=\"lol.png\" " +
            "title=\"lol\" />";
        expect(source2).toParseTo(expected2, myParser);
    });

    it("should detect smilies at the start of the string", function() {
        var myParser = new SmileyParser({"[:;]-?P+\\b":         'wink.png',
                                         ":-?C":                'frown.png',
                                         "\\blol\\b|\\bLOL\\b": 'lol.png'});
        var source2   = ":C";
        var source3   = ";P";
        var source4   = "lol";
        var expected2 = "<img alt=\":C\" src=\"frown.png\" title=\":C\" />";
        var expected3 = "<img alt=\";P\" src=\"wink.png\" title=\";P\" />";
        var expected4 = "<img alt=\"lol\" src=\"lol.png\" title=\"lol\" />";
        expect(source2).toParseTo(expected2, myParser);
        expect(source3).toParseTo(expected3, myParser);
        expect(source4).toParseTo(expected4, myParser);
    });

    it("should detect smilies with angle brackets", function() {
        var myParser = new SmileyParser({"</troll(ing)?>": 'troll.png'});
        var source   = "&lt;/troll&gt; &lt;/trolling&gt;";
        var expected = "<img alt=\"&lt;/troll&gt;\" src=\"troll.png\" "
                       + "title=\"&lt;/troll&gt;\" /> "
                       + "<img alt=\"&lt;/trolling&gt;\" src=\"troll.png\" "
                       + "title=\"&lt;/trolling&gt;\" />";
        expect(source).toParseTo(expected, myParser);
    });
});
