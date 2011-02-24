
prefix	= limesurvey
wwwgrp	= www-data

.PHONY: all
all: configuration permissions

.PHONY: configuration
configuration: $(prefix)/config.php

.PHONY: permissions
permissions:
	sudo chgrp -LRc $(wwwgrp) $(prefix) | wc -l | sed 's,^\([0-9]\+\)$$,(\1 change(s)),'
	find -L $(prefix) -type d -print0 | xargs -0r chmod -c 750 | wc -l | sed 's,^\([0-9]\+\)$$,(\1 change(s)),'
	find -L $(prefix) -type f -print0 | xargs -0r chmod -c 640 | wc -l | sed 's,^\([0-9]\+\)$$,(\1 change(s)),'
	find -L $(prefix) -type d \( -name tmp -o -name templates -o -name upload \) -exec find -L '{}' -type f -print0 \; | xargs -0r chmod -c 660 | wc -l | sed 's,^\([0-9]\+\)$$,(\1 change(s)),'
	find -L $(prefix) -type d \( -name tmp -o -name templates -o -name upload \) -exec find -L '{}' -type d -print0 \; | xargs -0r chmod -c 770 | wc -l | sed 's,^\([0-9]\+\)$$,(\1 change(s)),'

.PHONY: bootstrap
bootstrap: bootstrap.sql
	mysql -u root -p < $<

$(prefix)/config.php: $(HOME)/CITRUS_FILES/citrus_config.php
	cp $< $@

bootstrap.sql: $(HOME)/CITRUS_FILES/bootstrap.sql
	cp $< $@

