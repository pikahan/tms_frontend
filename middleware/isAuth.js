export default function ({app, error, redirect}) {
  const hasToken = !!app.$apolloHelpers.getToken()
  console.log('token: ' + app.$apolloHelpers.getToken())
  if (!hasToken) {
    redirect('/login')
  }
}
