/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
	plugins: [
		`gatsby-plugin-sass`,
		{
			resolve: `gatsby-plugin-manifest`,
			options: {
				name: 'Goldbug Club',
				short_name: 'Goldbug Club',
				start_url: '/',
				background_color: 'transparent',
				theme_color: '#000',
				orientation: 'portrait',
				// Enables "Add to Homescreen" prompt and disables browser UI (including back button)
				// see https://developers.google.com/web/fundamentals/web-app-manifest/#display
				display: 'standalone',
				icon: 'static/icons/android-chrome-512x512.png', // This path is relative to the root of the site.
				icons: [
					{
						src: 'static/icons/android-chrome-192x192.png',
						type: 'image/png',
						sizes: '192x192',
					},
					{
						src: 'static/icons/android-chrome-512x512.png',
						type: 'image/png',
						sizes: '512x512',
					},
				],
				// An optional attribute which provides support for CORS check.
				// If you do not provide a crossOrigin option, it will skip CORS for manifest.
				// Any invalid keyword or empty string defaults to `anonymous`
				crossOrigin: `use-credentials`,
			},
		},
	],
}
