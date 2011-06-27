describe("SmileyParser", function() {
    var parser;

    beforeEach(function() {
        parser = new SmileyParser({"\\bxD\\b": "lol.png",
                                   ":-?\\)":   "smile.png"});
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
        var expected = "I LOLed <img src=\"lol.png\" />";
        expect(parser.parseSmileys(source)).toEqual(expected);
    });

    it("should allow smileys to be configured", function() {
        var myParser = new SmileyParser({":-?\\(": "frown.png"});
        var source   = "I didn't LOL (xD) :-(";
        var expected = "I didn't LOL (xD) <img src=\"frown.png\" />";
        expect(myParser.parseSmileys(source)).toEqual(expected);
    });

    it("should replace many smileys", function() {
        var source   = "I LOLed xD :-) xD";
        var expected = "I LOLed <img src=\"lol.png\" /> " +
            "<img src=\"smile.png\" /> <img src=\"lol.png\" />";
        expect(parser.parseSmileys(source)).toEqual(expected);
    });
});
