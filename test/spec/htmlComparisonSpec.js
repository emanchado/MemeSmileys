function isHtmlEquivalent(one, two) {
  var domElement  = document.createElement('div');
  var domElement2 = document.createElement('div');
  domElement.innerHTML  = one;
  domElement2.innerHTML = two;
  return canonicalHtml(domElement) === canonicalHtml(domElement2);
}

describe("canonicalHtml", function() {
  beforeEach(function() {
    this.addMatchers({
      toBeCanonically: function(expected) {
        return isHtmlEquivalent(this.actual, expected);
      },
      toNotBeCanonically: function(expected) {
        return ! isHtmlEquivalent(this.actual, expected);
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

  it("should recognise a simple smiley correctly", function() {
    var source1 = 'A smiley: <abbrev style="background-image: url(foo.png); width: 30px; height: 25px">some text</abbrev>';
    var source2 = 'A smiley: <abbrev style="background-image: url(foo.png); height: 25px; width: 30px">some text</abbrev>';
    var source3 = 'A smiley: <abbrev style="background-image: url(foo.png); height: 25px; width: 30px">some other text</abbrev>';
    expect(source1).toBeCanonically(source2);
    expect(source1).toNotBeCanonically(source3);
    expect(source2).toNotBeCanonically(source3);
  });

  it("should recognise a smiley w/ extra properties as different", function() {
    var source1 = 'A smiley: <abbrev style="background-image: url(foo.png); width: 30px">some text</abbrev>';
    var source2 = 'A smiley: <abbrev style="background-image: url(foo.png); width: 30px; height: 25px">some text</abbrev>';
    expect(source1).toNotBeCanonically(source2);
  });

  it("should recognise a smiley w/ angle brackets", function() {
    var source1 = 'A smiley: <abbrev style="background-image: url(foo.png); height: 25px; width: 30px">&lt;/troll&gt;</abbrev>';
    var source2 = 'A smiley: <abbrev style="background-image: url(foo.png); width: 30px; height: 25px">&lt;/troll&gt;</abbrev>';
    expect(source1).toBeCanonically(source2);
  });
});
