# Delete the API directory since we don't need server-side API routes for static export
rm -rf app/api
echo "API directory removed - using client-side API calls instead"