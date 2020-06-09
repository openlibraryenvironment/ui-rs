set -ex
. ~/.okapi
for file in samples/*.json; do
    curl --header "X-Okapi-Tenant: $OKAPI_TENANT" -H "X-Okapi-Token: $OKAPI_TOKEN" -H "Content-Type: application/json" -X POST $OKAPI_URL/rs/timers -d @$file
done
