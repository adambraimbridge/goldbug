const oauthURL = 'https://www.goldbug.club/.netlify/identity/authorize?provider=google'

export async const checkAuthentication = () => {

  // Hash parameters are like query parameters, except with a `#` instead of a `?`
  const hashParams = new URLSearchParams(
    document.location.hash.replace(/^#?\/?/, '')
  )

  // // If there's no access_token hash parameter, redirect to the oauth URL for authentication
  // if (!hashParams.has('access_token')) {
  //   return {
  //     statusCode: 301, // redirect
  //     headers: {
  //       Location: oauthURL,
  //     },
  //   }
  // }

  // Remove tokens from hash so that token does not remain in browser history.
  history.replaceState(null, null, '/')

  const params = new Map(hashParams.entries())
  if (params.has('error')) {
		console.error(`${ params.get('error') }: ${params.get('error_description')}`)
		// return {
    //   statusCode: 401, // Unauthorized
      // body: `Failed to Authenticate. ${params.get('error')}: ${params.get(
      //   'error_description'
      // )}`,
    // }
  }

  const { access_token: token, ...data } = params.toJS()

  console.log({ access_token, data })
}
