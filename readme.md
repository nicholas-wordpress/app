# Nicholas WordPress Implementation

Nicholas is a small, extend-able client-side caching, and routing layer for websites. It was originally built to make
using
the [Nearly Headless](https://www.wpdev.academy/concepts/headless-wordpress-is-overrated-a-case-for-the-nearly-headless-web-app/)
approach easier to accomplish, but it is also most-likely compatible with fully headless sites.

This is the WordPress implementation of Nicholas, and it provides components to make building interfaces to customize
compatibility mode URLs, as well as a few WordPress-specific middlewares for
the [Nicholas router](https://github.com/nicholas-wordpress/router).

## Requirements

To use this implementation, you'll also need to set up
the [Nicholas Underpin Module](https://github.com/nicholas-wordpress/underpin-module), which creates the back-end
support necessary to make the components and middleware provided in this package work.

## Installation

`npm install nicholas-wp`

## Compatibility Mode App

Nicholas comes with a React component that allows you to build a compatibility mode interface inside the WordPress
editor. A basic setup to render this would look like this:

```javascript
import { render } from '@wordpress/element'
import { Admin } from 'nicholas-wp/admin'
import fetch from 'nicholas-wp'

// Render the app
window.onload = () => render( <Admin/>, document.getElementById( 'app' ) )

// Export fetch, so we can add midleware via PHP
export { fetch }
```

However, you can pass children to `Admin`, as well, if you want to add more components within the app:

```javascript
import { render } from '@wordpress/element'
import { Admin } from 'nicholas-wp/admin'
import fetch from 'nicholas-wp'

function CustomComponent( props ) {
	return <h1>This will get appended to the bottom of the app. The props contain items needed to update the app's
		state.</h1>
}

// Render the app
window.onload = () => render( <Admin>
	<CustomComponent/>
</Admin>, document.getElementById( 'app' ) )

// Export fetch, so we can add midleware via PHP
export { fetch }
```

## Compatibility Mode Toggle for Posts

It's possible to add a compatibility mode toggle to your posts using the `CompatibilityModeToggle` component, like so:

```javascript
import { registerPlugin } from '@wordpress/plugins';
import CompatibilityModeToggle from './nicholas-wp/editor/CompatibilityModeToggle'

registerPlugin( 'theme', { render: () => <CompatibilityModeToggle/> } );
```

## WordPress-specific Nicholas Router Middlewares

[Nicholas Router]() supports adding middleware to routes. This package includes a couple handy middlewares to help with
routing in a WordPress environment, including:

1. Middleware to update the "edit post" in the admin bar
2. Middleware to validate that a clicked link is not an admin URL.

To use these, you just need to add them to your router, like so:

```javascript
import {addRouteActions, validateMiddleware } from 'nicholas-router'
import {updateAdminBar, validateAdminPage, validateCompatibilityMode, primeCache} from 'nicholas-wp/middlewares'

	addRouteActions(
		// First, validate the URL
		validateMiddleware,
		// Validate this page is not an admin page
		validateAdminPage,
        // Validate compatibility mode.
        validateCompatibilityMode,
        // Prime the cache to be used afterward.
        primeCache,
		// Maybe update the admin bar
		updateAdminBar
	)
```