import { Url } from "nicholas-router"
import fetch from '../fetch'
import { useState } from '@wordpress/element'
import { TextControl, Button } from '@wordpress/components'
import { __ } from '@wordpress/i18n'


export default function( { setLoading, isLoading, setData, urls, setSearch } ) {
	const [value, setValue] = useState( '' )
	const [error, setError] = useState( false )

	function addUrl() {
		let valueToSet = value

		if ( !valueToSet ) {
			setError( __( 'Please use a valid url.' ) )
			return
		}

		if ( !( valueToSet.includes( 'www.' ) || valueToSet.includes( window.location.origin ) ) && !valueToSet.startsWith( '/' ) ) {
			valueToSet = `/${valueToSet}`
		}

		const url = new Url( valueToSet )

		if ( !url.isLocal() ) {
			setError( __( 'Please use a valid url.' ) )
			return
		}

		const urlExists = urls.find( testUrl => url.matchesUrl( testUrl ) )

		if ( urlExists ) {
			setError( __( 'That URL is already set' ) )
			return
		}

		if ( !urls ) {
			urls = []
		}

		urls.push( encodeURI( url.href ) )

		new Promise( async ( res, rej ) => {
			setLoading( true )
			await fetch( {
				path: '/nicholas/v1/settings/update',
				method: 'POST',
				data: { compatibility_mode_urls: urls }
			} )
			setLoading( false )
			res()
		} )

		setData( { compatibility_mode_urls: urls } )
		setValue( '' )
		setSearch( urls )
	}

	return (
		<div style={{ display: 'flex', justifyContent: 'left' }}>
			<TextControl
				disabled={isLoading}
				onChange={value => setValue( value )}
				value={value}
				help={error}
				label={__( 'URL' )}
				type={'url'}
				onKeyUp={( e ) => {
					if ( e.key === 'Enter' ) {
						addUrl()
					}
				}}
			/>
			<Button style={{ alignSelf: 'start', marginLeft: "5px" }} disabled={isLoading || !value.length} onClick={addUrl}
							className="button-secondary"
							variant="secondary">Add URL</Button>
		</div>

	)
}
