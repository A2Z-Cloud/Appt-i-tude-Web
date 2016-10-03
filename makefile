build:
	mv app/consts.js app/consts_debug.js && mv app/consts_dist.js app/consts.js
	- rm -rf dist
	mkdir dist
	./node_modules/.bin/jspm bundle app/main dist/app.js
	./node_modules/.bin/uglifyjs dist/app.js -o dist/app.min.js
	./node_modules/.bin/html-dist --config html-dist.config.js --input index.html

	cp favicon.ico dist/
	cp loader.css dist/loader.css
	cp config.js dist/
	cat dist/config.js dist/app.min.js > dist/core.min.js
	./node_modules/.bin/jspm unbundle
	mv app/consts.js app/consts_dist.js && mv app/consts_debug.js app/consts.js


S3_NAME_DEV = com-a2zcloud-apptitude-dev
CF_DIST_DEV = E2HDDXXSRUZM7W

S3_NAME_LIVE = com-a2zcloud-apptitude
CF_DIST_LIVE = E3F4M5LFOJTS3H
deploy:
	# e.g. make deploy t=live
	aws s3 sync --profile a2zcloud dist/ s3://S3_NAME_$(shell X="${t}"; echo "$t" | tr '[:lower:]' '[:upper:]')
	aws cloudfront create-invalidation --profile a2zcloud --distribution-id CF_DIST_$(shell X="${t}"; echo "$t" | tr '[:lower:]' '[:upper:]') --invalidation-batch "{\"Paths\": {\"Quantity\": 1,\"Items\": [\"/*\"]},\"CallerReference\": \"make deploy "`date +%Y-%m-%d:%H:%M:%S`"\"}"
