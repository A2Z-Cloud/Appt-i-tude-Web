THIS_FILE := $(lastword $(MAKEFILE_LIST))

S3_NAME_DEV = com-a2zcloud-apptitude-dev
CF_DIST_DEV = E2HDDXXSRUZM7W
S3_NAME_LIVE = com-a2zcloud-apptitude
CF_DIST_LIVE = E3F4M5LFOJTS3H

build:
	# e.g. make build t=live
	$(eval lower_target := $(shell X="${t}"; echo "$t" | tr '[:upper:]' '[:lower:]'))
	# Destory and create targets subfolder in dist
	- rm -rf dist/$(lower_target)
	mkdir -p dist/$(lower_target)
	# Switch out the correct const ready for build (if not already correct)
	@if [ $(lower_target) != "local" ]; then\
        mv app/consts/local.js app/consts/temp.js && mv app/consts/$(lower_target).js app/consts/local.js;\
    fi
	# Build
	./node_modules/.bin/jspm bundle app/main dist/$(lower_target)/app.js
	./node_modules/.bin/uglifyjs dist/$(lower_target)/app.js -o dist/$(lower_target)/app.min.js
	./node_modules/.bin/html-dist --config html-dist.config.js --input index.html
	mv dist/index.html dist/$(lower_target)/index.html
	cp favicon.ico dist/$(lower_target)/
	cp loader.css dist/$(lower_target)/loader.css
	cp config.js dist/$(lower_target)/
	cat dist/$(lower_target)/config.js dist/$(lower_target)/app.min.js > dist/$(lower_target)/core.min.js
	./node_modules/.bin/jspm unbundle
	# Switch back consts
	@if [ $(lower_target) != "local" ]; then\
        mv app/consts/local.js app/consts/$(lower_target).js && mv app/consts/temp.js app/consts/local.js;\
    fi
deploy:
	# e.g. make deploy t=live
	$(eval lower_target := $(shell X="${t}"; echo "$t" | tr '[:upper:]' '[:lower:]'))
	$(eval upper_target := $(shell X="${t}"; echo "$t" | tr '[:lower:]' '[:upper:]'))
	# Call build with target
	@$(MAKE) -f $(THIS_FILE) build t=$(upper_target)
	# Updload to s3 and invalidate cloudfront cache if not local
	@if [ $(lower_target) != "local" ]; then\
        aws s3 sync --profile a2zcloud dist/$(lower_target)/ s3://${S3_NAME_$(upper_target)};\
		aws cloudfront create-invalidation --profile a2zcloud --distribution-id ${CF_DIST_$(upper_target)} --invalidation-batch "{\"Paths\": {\"Quantity\": 1,\"Items\": [\"/*\"]},\"CallerReference\": \"make deploy "`date +%Y-%m-%d:%H:%M:%S`"\"}";\
    fi
