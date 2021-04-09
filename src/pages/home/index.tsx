import React, { PureComponent } from "react";
import "./index.less";
import {Layout, Menu, Dropdown, message, Modal } from "antd";
import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import HeaderC from "../../components/header";
import { getProdList, creatProd } from "@/api";
import Nothing from '@/components/nothing'
import xinjian from '@/assets/imgs/xinjian2@2x.png'

const { Header, Sider, Content } = Layout;
interface HomeStates {
  lineName: string;
  userInfo: string;
  lineType: number;
  prodList: { id: number; prod_img: string; prod_name: string }[];
  visible: boolean;
  prdName: string
}

class Home extends PureComponent<any, HomeStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      lineName: "",
      lineType: 0,
      userInfo: localStorage.getItem("USERINFO") || "",
      prodList: [],
      visible: false,
      prdName: ''
    };
    if (!this.state.userInfo) {
      window.location.href = "./login";
    }
  }

  componentDidMount() {
    const userInfo = JSON.parse(this.state.userInfo);
    const { lineList } = userInfo;
    const lineId = localStorage.getItem('LINETYPE')
    let data = lineList.find((i:any)=>`${i.id}` === `${lineId}`) 
    let lineData: any = {}
    if(data){
      lineData = data
    }else{
      lineData = lineList[0]
    }
    this.setState(
      {
        lineName: lineData?.type_name,
        lineType: lineData?.id,
      },
      () => {
        this.getProdList();
      }
    );
  }

  prodDetail(data: { id: number; prod_name: string }) {
    window.location.href = `./product?prod_id=${data.id}&prod_name=${data.prod_name}&line_type=${this.state.lineType}`;
  }

  async handleOk () {
    if(!this.state.prdName){
      message.error('请输入项目名称')
      return
    }
    const res = await creatProd({
      line_type: this.state.lineType,
      prod_name: this.state.prdName
    })
    if(res){
      this.setState({prdName:''})
      this.getProdList()
      // 发起数据请求
      this.handelAddPrd(false);
    }
  };

  async getProdList() {
    const res = await getProdList({
      line_type: this.state.lineType,
    });
    if (res) {
      this.setState({
        prodList: res,
      });
    }
  }

  getLineData(e: any) {
    if(e.key === '-1'){
      Modal.warning({
        title: '没有权限',
        content: '如果需要开通权限请联系管理员',
      });
      return false
    }
    this.setState(
      {
        lineType: Number(e.key),
        lineName: e.domEvent.target.innerText,
      },
      () => {
        localStorage.setItem('LINETYPE', e.key)
        this.getProdList();
      }
    );
  }
  handelAddPrd(type: boolean){
    this.setState({
      visible: type
    })
  }

  menu() {
    const userInfo = JSON.parse(this.state.userInfo);
    const { lineList } = userInfo;
    return (
      <Menu onClick={this.getLineData.bind(this)}>
        {lineList.map((item: any) => (
          <Menu.Item key={item.id} disabled={this.state.lineType === item.id}>
            <div className="fontsize">{item.type_name}</div>
          </Menu.Item>
        ))}
        <Menu.Divider />
        <Menu.Item key='-1'>
          <div className="fontsize">
            新建团队 <PlusOutlined />
          </div>
        </Menu.Item>
      </Menu>
    );
  }

  render() {
    return (
      <Layout>
        <Sider>
          <div className="lineName">
            <Dropdown overlay={this.menu()}>
              <div className="ant-dropdown-link">
                {this.state.lineName} <DownOutlined />
              </div>
            </Dropdown>
          </div>
          <div className="siderList">
            <div className="siderItem active">团队项目</div>
            <div className="siderItem">设计规范</div>
          </div>
        </Sider>
        <Layout>
          <Header>
            <HeaderC
              handelAddPrd={this.handelAddPrd.bind(this, true)}
            ></HeaderC>
          </Header>
          <Content>
            <div>
              <ul className="control">
                <li className="active">全部</li>
                {/* <li>最近使用</li> */}
              </ul>
            </div>
            <div className="prdList">
              {this.state.prodList.length ? this.state.prodList.map((item) => (
                <div
                  key={item.id}
                  className="prdItem"
                  onClick={this.prodDetail.bind(this, item)}
                >
                  {item.prod_img !== "undefined" ? (
                    <div
                      className="img"
                      style={{
                        background: `url("${item.prod_img}") center top / cover no-repeat rgba(48, 123, 255, 0.7)`,
                      }}
                    ></div>
                  ) : (
                    <div className="img empty"></div>
                  )}
                  <div className="name">{item.prod_name}</div>
                </div>
              )) : <Nothing info="暂无数据" icon={xinjian} buttonName='新建项目' handleClick={this.handelAddPrd.bind(this, true)}/>}
            </div>
          </Content>
          <Modal title="新建项目" okText="确定" cancelText="取消" visible={this.state.visible} onOk={this.handleOk.bind(this)} onCancel={this.handelAddPrd.bind(this, false)}>
            <input className="prdName" type="text" value={this.state.prdName} placeholder="项目名称" onChange={(e)=>{this.setState({prdName: e.target.value})}}/>
          </Modal>
        </Layout>
      </Layout>
    );
  }
}

export default Home;
