import React from 'react'


export function parseRefRect<T extends HTMLElement>(ref: React.RefObject<T>){
  const [rect_dom, setRectDome] = React.useState<Omit<DOMRect, "toJSON">>({
    "bottom": 0, "height": 0, "left": 0, "right": 0, "top": 0, 'width': 0, "x": 0, y: 0
  })

  function caculate(time = 0){
    if(rect_dom.height != 0) return
    if(time > 100) { console.log(`retried 10 times, faield`); return }
    if(ref.current){
      const rect = ref.current.getBoundingClientRect()
      setRectDome(rect)
      return
    }
    setTimeout(() => caculate(time + 1), 100)
  }

  React.useEffect(caculate, [rect_dom])

  return rect_dom
}

export function registerEnterAction(cb: () => void) {
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if(e.key == "Enter") cb()
    }

    document.addEventListener("keypress", handler )
    return () => document.removeEventListener("keypress", handler)
  }, [cb])
}

export function outsideClick<T extends HTMLElement>(ref: React.MutableRefObject<T|undefined>, cb: () => void){
  const handler = React.useCallback((e: MouseEvent ) => {
    const current = ref.current
    if(!current) return 
    if(!current.contains(e.target as Node)){ cb() }

  }, [ref])
  
  React.useEffect(() => {
    document.addEventListener('click', handler )
    return () => { document.removeEventListener('click', handler )}
  }, [handler])

}