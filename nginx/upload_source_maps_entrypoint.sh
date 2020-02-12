#!/bin/sh

cd /usr/share/nginx/html/

for source_map_filename in static/js/*.map; do
        minified_url=$BASE_URL/${source_map_filename%.*}

        curl https://api.rollbar.com/api/1/sourcemap \
                -F access_token=$ROLLBAR_POST_TOKEN \
                -F version=$VERSION \
                -F minified_url=$minified_url \
                -F source_map=@$source_map_filename
done

exec "$@"
