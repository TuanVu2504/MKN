import React from 'react'
import { IImageDTO } from '/project/shared'

interface IChangeableImage {
  className: string
  imageId: string,
  onChange: (val: IImageDTO) => void
}

export function ChangeAbleImage(props: IChangeableImage){
  const { imageId, onChange, className } = props
  const [ tempImage, setTempImage ] = React.useState<File>()
  const [ size, setSize] = React.useState<DOMRect>()
  const uploadBtnRef = React.useRef<HTMLInputElement>(null)
  
  const getOuterRec = React.useCallback((node: HTMLDivElement|null) => { 
    if(node){
      setSize(node.getBoundingClientRect())
    }
  }, [])

  async function upload(){
    if(!uploadBtnRef.current) return 
    uploadBtnRef.current.click()
  }

  async function select(){

  }

  function selectedImage(e: React.ChangeEvent<HTMLInputElement>){
    const files = e.target.files
    if(files){
      const image = files[0]
      setTempImage(image)
    }
  }

  return (  
    <div 
      ref={getOuterRec}
      className={
        `${className||''} w-full h-full ]`
      }
    >
      {/* <Toggle type='inline'>
        <input 
          width={size?.width}
          height={size?.height}
          ref={uploadBtnRef} 
          type="file" 
          accept='image/*' 
          onChange={selectedImage} 
        />
        <img  />
      </Toggle> */}
    </div>
  )

}