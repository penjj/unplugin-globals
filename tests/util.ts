export function runScript(body: string) {
  // return `Hello World` 
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