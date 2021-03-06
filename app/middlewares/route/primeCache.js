import fetch from 'nicholas-wp'

export default async ( args, next ) => {
	// Stop the event from doing what it would normally do
	event.preventDefault();

	const cache = args.url.getCache()

	// If this URL is not stored in the cache, fetch it.
	if ( !cache ) {
		// Fetch data data for the current url
		args.data = await fetch( {
			path: `/nicholas/v1/page-info?path=${args.url.pathname}`,
		} )

		// Add data to cache
		args.url.updateCache( args.data[0] )
	}

	next()
}