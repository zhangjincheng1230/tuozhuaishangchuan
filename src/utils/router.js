export function getTagRoute (currentRoute) {
  let route = currentRoute
  if (currentRoute.meta.hiddenTag === true) {
    let routes = currentRoute.matched
    for (let i = routes.length - 2; i >= 0; i--) {
      let meta = routes[i].meta
      if (!meta || meta.hiddenTag !== true) {
        route = routes[i]
        break
      }
    }
  }
  return route
}
