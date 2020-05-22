import MyStorage from '../util/storage'

export default function ({app, error, redirect}) {
  const hasToken = !!app.$apolloHelpers.getToken()
  console.log('token: ' + app.$apolloHelpers.getToken())
  console.log(app.store.state.user.userInfo.employeeId)
  if (!hasToken && app.store.state.user.userInfo.employeeId !== '游客') {
    console.log('redirect')
    redirect('/login')
  }
}
