import fetch from 'nicholas-wp'

let compatibilityModeUrls = false

fetch( { path: 'nicholas/v1/compatibility-mode-urls' } )
	.then( ( res ) => compatibilityModeUrls = res )

export default async ( args, next ) => {

	// If compatibility mode URLs are still loading, bail
	if ( !Array.isArray( compatibilityModeUrls ) ) {
		return;
	}

	// If this URL is a compatibility mode URL, bail.
	if ( compatibilityModeUrls.find( ( url ) => args.url.matchesUrl( url ) ) ) {
		return;
	}
	next()
}