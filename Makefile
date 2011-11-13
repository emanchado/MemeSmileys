EXTENSION_TARGET = meme-smileys.oex
DIST_FILES = config.xml icon.png includes/base.js includes/defaultSmileyTable.js includes/smileyParser.js includes/replace.js index.html options.html

all:

dist: $(EXTENSION_TARGET)

$(EXTENSION_TARGET): $(DIST_FILES)
	zip -9r $(EXTENSION_TARGET) $(DIST_FILES)
