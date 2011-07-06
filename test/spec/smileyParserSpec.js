describe("SmileyParser", function() {
    var parser;

    beforeEach(function() {
        parser = new SmileyParser({"\\bxD+\\b": "lol.png",
                                   ":-?\\)":    "smile.png"});
    });

    it("should return the same string when there aren't any smileys", function() {
        var someString = "Some string without any smileys";
        expect(parser.parseSmileys(someString)).toEqual(someString);
    });

    it("should not be confused with text that looks like a smiley", function() {
        var someString = "FedEx or FexDex?";
        expect(parser.parseSmileys(someString)).toEqual(someString);
    });

    it("should replace simple smileys", function() {
        var source   = "I LOLed xD";
        var expected = "I LOLed <img alt=\"xD\" title=\"xD\" " +
            "src=\"lol.png\" />";
        expect(parser.parseSmileys(source)).toEqual(expected);
    });

    it("should allow smileys to be configured", function() {
        var myParser = new SmileyParser({":-?\\(": "frown.png"});
        var source   = "I didn't LOL (xD) :-(";
        var expectedStandard = "I didn't LOL (<img alt=\"xD\" " +
            "title=\"xD\" src=\"lol.png\" />) :-(";
        var expectedConfigured = "I didn't LOL (xD) <img alt=\":-(\" " +
            "title=\":-(\" src=\"frown.png\" />";
        expect(parser.parseSmileys(source)).toEqual(expectedStandard);
        expect(myParser.parseSmileys(source)).toEqual(expectedConfigured);
    });

    it("should replace many smileys", function() {
        var source   = "I LOLed xD :-) xDD";
        var expected = "I LOLed <img alt=\"xD\" title=\"xD\" " +
            "src=\"lol.png\" /> " +
            "<img alt=\":-)\" title=\":-)\" src=\"smile.png\" /> " +
            "<img alt=\"xDD\" title=\"xDD\" src=\"lol.png\" />";
        expect(parser.parseSmileys(source)).toEqual(expected);
    });

    it("should be idempotent", function() {
        var source   = "I LOLed xD :-) xDD";
        var expected = "I LOLed <img alt=\"xD\" title=\"xD\" " +
            "src=\"lol.png\" /> " +
            "<img alt=\":-)\" title=\":-)\" src=\"smile.png\" /> " +
            "<img alt=\"xDD\" title=\"xDD\" src=\"lol.png\" />";
        var actualOnePass = parser.parseSmileys(source);
        var actualTwoPasses = parser.parseSmileys(actualOnePass);
        expect(actualOnePass).toEqual(expected);
        expect(actualTwoPasses).toEqual(expected);
    });

    it("should play well with ;))", function() {
        var winkParser = new SmileyParser({"\\bxD+\\b": "lol.png",
                                           ";-?\\)+":   "wink.png"});
        var source   = "Jajaja si, puede ser una solución, pero admito mas ideas... ;))";
        var expected = "Jajaja si, puede ser una solución, pero admito mas ideas... <img alt=\";))\" title=\";))\" " +
               "src=\"wink.png\" />";
        var actualOnePass = winkParser.parseSmileys(source);
        var actualTwoPasses = winkParser.parseSmileys(actualOnePass);
        expect(actualOnePass).toEqual(expected);
        expect(actualTwoPasses).toEqual(expected);
    });
});
