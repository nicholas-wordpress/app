import { render, useState, cloneElement, Children } from '@wordpress/element'
import { Button, TextControl, Spinner, Dashicon } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { Url } from 'nicholas-router'
import UrlField from './UrlField'
import Urls from './Urls'
import fetch from 'nicholas-wp'

export default ( { children } ) => {

	const [isLoading, setLoading] = useState( true )
	const [data, setData] = useState( false )
	const [search, setSearch] = useState( [] )

	if ( isLoading && false === data ) {

		new Promise( async ( res, rej ) => {
				const data = await fetch( { path: 'nicholas/v1/settings' } )
				setData( data )
				setSearch( data.compatibility_mode_urls )
				setLoading( false )
			}
		)

		return (
			<div className="wrap">
				<h1>Theme Settings</h1>
				<Spinner/>
			</div>
		)
	}


	function removeUrl( url ) {
		const remainingUrls = data.compatibility_mode_urls.filter( ( urlTest ) => {
			if ( url !== urlTest ) {
				return true
			}

			return false
		} )

		setData( { compatibility_mode_urls: remainingUrls } )

		new Promise( async ( res, rej ) => {
				setLoading( true )
				await fetch( {
					path: '/nicholas/v1/settings/update',
					method: 'POST',
					data: { compatibility_mode_urls: remainingUrls }
				} )
				setLoading( false )
				res()
			}
		)

		const searchUrls = search.filter( ( testUrl ) => testUrl !== url )
		setSearch( searchUrls )
	}

	function FlushButton() {

		const [notice, setNotice] = useState( '' )
		const [isFlushing, setFlushing] = useState( false )

		async function flush() {
			setFlushing( true )

			await fetch( {
				path: '/nicholas/v1/settings/update',
				method: 'POST',
				data: { flush_cache: true }
			} )

			setFlushing( false )
			setNotice( __( 'Cache flushed!' ) )
			window.setTimeout( () => {
				setNotice( '' )
			}, 1000 )
		}

		let message = ''

		if ( isFlushing ) {
			message = <Spinner/>
		} else if ( notice ) {
			message = <em style={{ marginLeft: "10px" }}>{notice}</em>
		}

		return (
			<>
				<Button style={{ marginTop: "10px" }} className="button-primary" disabled={isLoading || isFlushing}
								onClick={flush}>
					Flush Cache
				</Button>
				{message}
			</>
		)
	}

	// Pass props to child elements. This makes it possible for theme devs to add to the settings screen, if needed.
	children = Children.map( children, child => {
		return cloneElement( child, {
				isLoading,
				setLoading,
				data,
				setData,
				search,
				setSearch
			},
		);
	} );

	return (
		<div className="wrap">
			<h1>Theme Settings</h1>
			<h2>Compatibility Mode URLs</h2>
			<em>Any URLs manually added here will use compatibility mode, loading without the
				JavaScript cache.</em>
			<UrlField style={{ marginBottom: '20px' }} setSearch={setSearch} urls={data.compatibility_mode_urls}
								setData={setData} setLoading={setLoading}
								isLoading={isLoading}/>
			<Urls setSearch={setSearch} search={search} removeUrl={removeUrl} urls={data.compatibility_mode_urls}/>
			<h2>Force Flush</h2>
			<em style={{ display: 'block' }}>
				Cache auto-flushes when you update a post, but if you need to manually force the cache to flush you can do
				so here.
			</em>
			<FlushButton/>
			{children}
		</div>
	)
}