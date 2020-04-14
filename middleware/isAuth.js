export default function ({app, error}) {
  const hasToken = !!app.$apolloHelpers.getToken()
  if (!hasToken) {
    error({errorCode:503, message:'你没有权限'})
  }
}
