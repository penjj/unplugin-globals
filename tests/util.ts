export function runScript(body: string) {
  // return `Hello World`
  // eslint-disable-next-line no-new-func, no-useless-call
  return new Function(`
    const LibA = {
      h: 'h',
      e: 'e',
      o: 'o',
    }
    const LibB = {
      l: 'l',
      w: 'w',
      r: 'r',
      d: 'd'
    }
    
    ${body}

    return ret
  `).call(null)
}
