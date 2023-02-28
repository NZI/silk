
export function Inject(cb: (connectionData: any) => keyof typeof connectionData) {
  return (target: any, methodKey: string, parameterIndex: number) => {
    
    if (target._inject === undefined) {
      target._inject = {}
    }
    if (target._inject[methodKey] === undefined) {
      target._inject[methodKey] = {}
    }
    target._inject[methodKey].max = Math.max(target._inject[methodKey].max ?? 1, parameterIndex + 1)
    target._inject[methodKey][parameterIndex] = cb
  }
}

