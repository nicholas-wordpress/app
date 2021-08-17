import { Url } from 'nicholas-router'
import fetch from "nicholas-wp";

let queue = []

/**
 * Get the queue of URLs to cache
 * @since 1.0.0
 */
function getUrls() {
	// Get all URLs
	queue = [...document.querySelectorAll( 'a:not([data-nocache])' )]
		.reduce( ( acc, url ) => {

			// Bail if the URL does not have an href
			if ( url.href === undefined ) {
				return acc
			}

			url = new Url( url.href )

			// If local, bail
			if ( !url.isLocal() ) {
				return acc
			}

			// If admin, bail
			if ( url.pathname.includes( 'wp-admin' ) || url.pathname.includes( 'wp-login' ) ) {
				return acc
			}

			// If cached, bail
			if ( url.getCache() ) {
				return acc
			}

			// If the URL is already in the queue, bail
			if ( acc.find( accUrl => accUrl.matchesUrl( url ) ) ) {
				return acc
			}

			acc.push( url )

			return acc
		}, [] )
}

/**
 * Preloads the URLs on the page.
 * @since 1.0.0
 */
function preloadUrls() {
	getUrls()

	// If the queue is empty, bail
	if ( queue.length === 0 ) {
		return
	}

	// grab the next 10 URLs and get the paths
	const requestUrls = queue.slice( 0, 10 )

	// hack off the 10 items just placed in requestUrls.
	queue = queue.slice( 10 )

	// fetch the data
	new Promise( async ( res, rej ) => {
		const data = await fetch( {
			path: `/nicholas/v1/page-info?paths=${requestUrls.map( url => url.pathname )}`,
		} )

		// Loop through each dataset and set the cache from the request URL
		data.forEach( ( datum, key ) => {
			setTimeout( () => {
				requestUrls[key].updateCache( datum )
			}, 100 * key )
		} )
	} )
}

export default ( args, next ) => {
	// Ensures we don't have a memory leak should this function get called multiple times
	window.clearInterval( preloadUrls, 1000 )

	// Every few seconds, preload URLs
	window.setInterval( preloadUrls, 1000 )

	next()
}