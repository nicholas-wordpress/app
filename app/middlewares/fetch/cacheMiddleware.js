import md5 from 'crypto-js/md5'

const processing = {}

export default ( options, next ) => {
	// Make a cache key from the path.
	const cacheKey = `nicholas-${md5( options.path )}`

	// If this item should not be cached, add it to the list of items being processed and move on.
	if ( !options.cacheItem || true !== options.cacheItem ) {
		return next( options )
	}

	const item = window.sessionStorage.getItem( cacheKey )

	// If the item could not be found, save it in session storage and fetch.
	if ( null === item ) {

		// Check to see if this item is currently being loaded. If-so, force this to wait for that request, instead.
		// This prevents multiples of the same request from being ran.
		if ( undefined !== processing[cacheKey] ) {
			return processing[cacheKey]
		}

		// Otherwise, store this in the processing queue, store it in sessionStorage, and clear the results.
		processing[cacheKey] = next( options ).then( result => {
			window.sessionStorage.setItem( cacheKey, JSON.stringify( result ) )
			delete processing[cacheKey]

			return result
		} )

		return processing[cacheKey]
	}

	// Otherwise, resolve the promise early, using the data stored in sessionStorage
	return Promise.resolve( JSON.parse( item ) )
}