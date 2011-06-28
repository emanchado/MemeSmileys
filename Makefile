EXTENSION_TARGET = meme-smileys.oex
DIST_FILES = config.xml includes/base.js includes/defaultSmileyTable.js includes/smileyParser.js index.html

all:

dist: $(EXTENSION_TARGET)

$(EXTENSION_TARGET): $(DIST_FILES)
	zip -9r $(EXTENSION_TARGET) $(DIST_FILES)
