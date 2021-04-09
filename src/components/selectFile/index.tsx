import React, {useRef} from 'react'
import { Button } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
import './index.less'

interface propsState{
  buttonName: string,
  setFileInfo: Function
}

function SelectFile(props: propsState) {
  const {buttonName,setFileInfo} = props
  let inputRef = useRef<any>()

  const handleInput = () => {
    inputRef.current.click()
  }

  const fileChange = (e: any) => {
    setFileInfo(e.target.files[0])
  }

  return (
    <div className="selectFile">
      <input className="file" ref={inputRef} accept="aplication/zip" type="file" name="upName" onChange={fileChange}/>
      <Button icon={<CloudUploadOutlined />} onClick={handleInput}>{buttonName||'上传'}</Button>
    </div>
  )
}

export default SelectFile