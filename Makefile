
prefix	= limesurvey
wwwgrp	= www-data

.PHONY: all
all: configuration permissions

.PHONY: configuration
configuration: $(prefix)/config.php

.PHONY: permissions
permissions:
	sudo chgrp -LR $(wwwgrp) $(prefix)
	find -L $(prefix) -type d -print0 | xargs -0r chmod 750
	find -L $(prefix) -type f -print0 | xargs -0r chmod 640
	find -L $(prefix) -type d \( -name tmp -o -name templates -o -name upload \) -exec find -L '{}' -type f -print0 \; | xargs -0r chmod 660
	find -L $(prefix) -type d \( -name tmp -o -name templates -o -name upload \) -exec find -L '{}' -type d -print0 \; | xargs -0r chmod 770

.PHONY: bootstrap
bootstrap: bootstrap.sql
	mysql -u root -p < $<

$(prefix)/config.php: $(HOME)/citrus_config.php
	cp $< $@

