
const analysisParams = (url: string) => {
  let params: any = {}
  const _query = url.split('?')[1]
  if (!_query) {
      return undefined
  }
  const _vars = _query.split('&')
  _vars.forEach((v, i) => {
      const _pair = v.split('=')
      if (!params.hasOwnProperty(_pair[0])) {
          params[_pair[0]] = decodeURIComponent(_pair[1])
      } else if (typeof params[_pair[0]] === 'string') {
          const _arr = [params[_pair[0]], decodeURIComponent(_pair[1])]
          params[_pair[0]] = _arr
      } else {
          params[_pair[0]].push(decodeURIComponent(_pair[1]))
      }
  })
  return params
}

export {
  analysisParams
}