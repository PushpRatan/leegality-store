export function setOptionalParam(params: URLSearchParams, key: string, value: string) {
  if (value) {
    params.set(key, value)
    return
  }

  params.delete(key)
}

export function setOptionalListParam(params: URLSearchParams, key: string, values: string[]) {
  setOptionalParam(params, key, values.join(','))
}
