import './index.less'
import tip_practice from '@/assets/imgs/tip_practice@3x.png'
import {Button} from 'antd'
import { CloudUploadOutlined } from "@ant-design/icons";

interface propsState{
  info: string
  buttonName: string
  handleClick: Function
  icon?: string
}

const Nothing = (props : propsState) => {

  const {info, buttonName, handleClick, icon} = props

  const click = () => {
    handleClick()
  }

  return <div className="nothing">
    <img src={tip_practice} alt=''/>
    <div className="info">{info||'暂无数据,马上去上传'}</div>
    <div className="buttonName">
      {icon?<Button type="primary" onClick={click}>
          <img className="addIcon" src={icon} alt="" />
          新建项目
        </Button>:<Button type="primary" icon={<CloudUploadOutlined/>} onClick={click}>{buttonName || '上传'}</Button>}
    </div>
  </div>
}

export default Nothing