import { useState } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { Button, TextControl } from '@wordpress/components'

export default function ( { urls, removeUrl, search, setSearch } ) {
	const [query, setQuery] = useState( [] )

	function Url( { url, id } ) {
		const [value, setValue] = useState( url )
		return (
			<li>
				<a href={url}>{url}</a>
				<Button style={{ marginLeft: "5px" }} onClick={e => removeUrl( url )}>Remove</Button>
			</li>
		)
	}

	if ( !urls.length ) {
		return (
			<p>{__('There are no URLs using compatibility mode right now.')}</p>
		)
	}

	function UrlList() {

		if ( !search.length ) {
			return <p>{__('No URLs matching the filter were found.')}</p>
		}

		return (
			<ul>
				{search.map( ( url, id ) => <Url id={id} key={id} url={url}/> )}
			</ul>
		)
	}

	return (
		<>
			<h3>Current URLs</h3>
			<em>List of URLs that are currently using compatibility mode.</em>
			<TextControl
				onChange={value => {
					setSearch( urls.filter( url => url.includes( encodeURI( value ) ) ) )
					setQuery( value )
				}}
				value={query}
				label={__( 'Filter' )}
				type={'text'}
			/>
			<UrlList/>
		</>
	)
}
