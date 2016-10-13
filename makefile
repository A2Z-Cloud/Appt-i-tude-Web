THIS_FILE := $(lastword $(MAKEFILE_LIST))

build:
	# e.g. make build t=live

	# Destory and create targets subfolder in dist
	- rm -rf dist/$(shell X="${t}"; echo "$t" | tr '[:upper:]' '[:lower:]')
	mkdir -p dist/$(shell X="${t}"; echo "$t" | tr '[:upper:]' '[:lower:]')

	# Switch out the correct const ready for build (if not already correct)
	@if [ $(shell X="${t}"; echo "$t" | tr '[:upper:]' '[:lower:]') != "local" ]; then\
        mv app/consts/local.js app/consts/temp.js && mv app/consts/$(shell X="${t}"; echo "$t" | tr '[:upper:]' '[:lower:]').js app/consts/local.js;\
    fi


	# Build
	./node_modules/.bin/jspm bundle app/main dist/$(shell X="${t}"; echo "$t" | tr '[:upper:]' '[:lower:]')/app.js
	./node_modules/.bin/uglifyjs dist/$(shell X="${t}"; echo "$t" | tr '[:upper:]' '[:lower:]')/app.js -o dist/$(shell X="${t}"; echo "$t" | tr '[:upper:]' '[:lower:]')/app.min.js
	./node_modules/.bin/html-dist --config html-dist.config.js --input index.html
	mv dist/index.html dist/$(shell X="${t}"; echo "$t" | tr '[:upper:]' '[:lower:]')/index.html
	cp favicon.ico dist/$(shell X="${t}"; echo "$t" | tr '[:upper:]' '[:lower:]')/
	cp loader.css dist/$(shell X="${t}"; echo "$t" | tr '[:upper:]' '[:lower:]')/loader.css
	cp config.js dist/$(shell X="${t}"; echo "$t" | tr '[:upper:]' '[:lower:]')/
	cat dist/$(shell X="${t}"; echo "$t" | tr '[:upper:]' '[:lower:]')/config.js dist/$(shell X="${t}"; echo "$t" | tr '[:upper:]' '[:lower:]')/app.min.js > dist/$(shell X="${t}"; echo "$t" | tr '[:upper:]' '[:lower:]')/core.min.js
	./node_modules/.bin/jspm unbundle

	# Switch back consts
	@if [ $(shell X="${t}"; echo "$t" | tr '[:upper:]' '[:lower:]') != "local" ]; then\
        mv app/consts/local.js app/consts/$(shell X="${t}"; echo "$t" | tr '[:upper:]' '[:lower:]').js && mv app/consts/temp.js app/consts/local.js;\
    fi


S3_NAME_DEV = com-a2zcloud-apptitude-dev
CF_DIST_DEV = E2HDDXXSRUZM7W

S3_NAME_LIVE = com-a2zcloud-apptitude
CF_DIST_LIVE = E3F4M5LFOJTS3H
deploy:
	# e.g. make deploy t=live
	@$(MAKE) -f $(THIS_FILE) build t=$(shell X="${t}"; echo "$t" | tr '[:lower:]' '[:upper:]')
	aws s3 sync --profile a2zcloud dist/$(shell X="${t}"; echo "$t" | tr '[:upper:]' '[:lower:]')/ s3://${S3_NAME_$(shell X="${t}"; echo "$t" | tr '[:lower:]' '[:upper:]')}
	aws cloudfront create-invalidation --profile a2zcloud --distribution-id ${CF_DIST_$(shell X="${t}"; echo "$t" | tr '[:lower:]' '[:upper:]')} --invalidation-batch "{\"Paths\": {\"Quantity\": 1,\"Items\": [\"/*\"]},\"CallerReference\": \"make deploy "`date +%Y-%m-%d:%H:%M:%S`"\"}"
