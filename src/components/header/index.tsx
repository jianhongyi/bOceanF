import React, {useState} from 'react'
import { Button } from 'antd';
import './index.less'
import xinjian from '@/assets/imgs/xinjian2@2x.png'


interface propsState{
  handelAddPrd: Function
}

function Header(props: propsState ) {
  const { handelAddPrd } = props
  const [userInfo] = useState(JSON.parse(window.localStorage.getItem('USERINFO') || '{}'))

  const out = () => {
    localStorage.removeItem('TOKEN')
    window.location.href='./login'
  }

  const addPrd = () => {
    handelAddPrd(true);
  }

  return (
    <div>
      <div className="header">
      <div className="add">
        <Button type="primary" onClick={addPrd}>
          <img className="addIcon" src={xinjian} alt="" />
          新建项目
        </Button>
      </div>
      <div className="link">
        <ul>
          {/* <li>知识文档</li> */}
          <li>{userInfo.userNameCn}</li>
        </ul>
        <div className="out" onClick={out}>退出</div>
      </div>
    </div>
    </div>
  );
}
  
export default Header;