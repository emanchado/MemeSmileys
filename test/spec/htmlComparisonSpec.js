describe("canonicalHtml", function() {
    var domElement;

    beforeEach(function() {
        domElement = document.createElement('div');

        this.addMatchers({
          toBeCanonically: function(expected) {
            domElement.innerHTML = this.actual;
            return this.env.equals_(canonicalHtml(domElement), expected);
          }
        });
    });

    it("should return the same string when there isn't any markup", function() {
        var someString = "Some string without any markup";
        expect(someString).toBeCanonically(someString);
    });

    it("should return the same string when there are simple elements", function() {
        var someString = "Some string with <strong>some</strong> markup";
        expect(someString).toBeCanonically(someString);
    });

    it("should return attributes in alphabetical order", function() {
        var source   = 'Some <a title="foo" href="http://example.com">link</a>';
        var expected = 'Some <a href="http://example.com" title="foo">link</a>';
        expect(source).toBeCanonically(expected);
    });

    it("should return self-closing tags correctly", function() {
        var source   = 'An <img src="image.png">';
        var expected = 'An <img src="image.png" />';
        expect(source).toBeCanonically(expected);
    });

    it("should return HTML entities correctly", function() {
        var source   = 'A Smith &amp; Wesson weapon';
        expect(source).toBeCanonically(source);
    });
});
