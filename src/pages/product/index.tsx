import React, { PureComponent } from "react";
import { LeftOutlined, CaretRightOutlined, MenuFoldOutlined, MenuUnfoldOutlined, CloudUploadOutlined, BarsOutlined, CloudOutlined, CloudDownloadOutlined, DeleteOutlined} from "@ant-design/icons";
import {Button, Modal, Popover, Spin, message} from 'antd'
import wenjian from '@/assets/imgs/wenjianjiaclose@2x.png'
import wenjianOpen from '@/assets/imgs/wenjianjia@2x.png'
import Upload from '@/components/upload'
import UploadImgs from '@/components/uploadImgs'
import "./index.less";
import {analysisParams} from '@/units'
import {getRecordList, updateIsFiled} from '@/api'
import moment from 'moment'
import Nothing from '@/components/nothing'

interface LoginPageStates {
  prodName: string
  activeIndex: string
  activeIndexName: string
  versionActiveIndex: number
  siderPack: boolean
  modalVisible: boolean
  upImgVisible: boolean
  loading: boolean
  prodType: string,
  prodId: string,
  prodList: any[],
  iframeUrl: string
  line_type: string,
  userInfo: {jurisdiction: string}
}

class Product extends PureComponent<any, LoginPageStates> {
  constructor(props: any) {
    super(props);
    const params = analysisParams(props.location.search)
    const local = window.localStorage.getItem('USERINFO') || '{}'
    console.log('params', params)
    this.state = {
      prodId: params.prod_id,
      prodName: params.prod_name,
      line_type: params.line_type,
      activeIndex: params.prd_id ? params.prd_id : '',
      activeIndexName: '',
      versionActiveIndex: params.versionIndex ? Number(params.versionIndex) : 0,
      siderPack: false,
      prodType: params.prd_type || '1', // 1 UI 2 产品
      modalVisible: false,
      upImgVisible: false,
      prodList: [],
      iframeUrl: '',
      loading: false,
      userInfo: JSON.parse(local)
    };
  }

  componentDidMount(){
    this.getProdList()
  }

  setActiveIndex(item:any){
    if(!item) return
    const data = item.list.find((i: any) => i.id === this.state.versionActiveIndex) || item.list[0]
    this.setState({
      activeIndexName: item.prd_name,
      activeIndex: item.prd_id,
      versionActiveIndex: data?.id,
      iframeUrl: data?.file_url,
      loading: true
    }, ()=>{
      this.replaceStateUrl()
    })
    setTimeout(()=>{
      this.setState({
        loading: false
      })
    },1000)
  }

  async getProdList() {
    this.setState({
      loading: true
    })
    const {prodId, prodType} = this.state
    const res = await getRecordList({
      prd_type: prodType,
      prod_id: prodId
    })
    if(res){
      this.setState({
        prodList: res
      })
      if(this.state.activeIndex){
        const itemData = res.find((item: any) =>item.prd_id === this.state.activeIndex)
        if(itemData){
          this.setActiveIndex(itemData)
        }else{
          this.setActiveIndex(res[0])
        }
      }else{
        this.setActiveIndex(res[0])
      }
    }
    setTimeout(()=>{
      this.setState({
        loading: false
      })
    },1000)
  }

  changeProdType (type: string) {
    this.setState({prodType:type}, () => {
      this.getProdList()
    })
  }

  showWarning(){
    Modal.warning({
      title: '没有权限',
      content: '如果需要开通权限请联系管理员',
    });
  }

  setModalVisible (type: boolean) {
    if(this.state.userInfo.jurisdiction === '0'){
      this.showWarning()
      return
    }
    this.setState({modalVisible: type})
    if(!type){
      this.getProdList()
    }
  }

  // 上传切图
  upLoadPic(){
    if(this.state.userInfo.jurisdiction === '0'){
      this.showWarning()
      return
    }
    this.setState({upImgVisible: true})
  }

  setActiveItemIndex(item: any, prd_id: string){
    this.setState({
      activeIndex: prd_id,
      versionActiveIndex: item.id,
      iframeUrl: item.file_url,
      loading: true
    }, ()=>{
      this.replaceStateUrl()
    })
    setTimeout(()=>{
      this.setState({
        loading: false
      })
    },1000)
  }

  replaceStateUrl(){
    const {prodId, prodName, line_type, activeIndex, prodType, versionActiveIndex} = this.state
    window.history.replaceState({}, window.location.search, `/product?prod_id=${prodId}&prod_name=${prodName}&line_type=${line_type}&prd_id=${activeIndex}&versionIndex=${versionActiveIndex}&prd_type=${prodType}`)
  }

  upImgVisible(type: boolean){
    if(!type){
      this.getProdList()
    }
    this.setState({upImgVisible: type})
  }

  async delete(e: any){
    e.stopPropagation();
    if(this.state.userInfo.jurisdiction === '0'){
      this.showWarning()
      return
    }
    await updateIsFiled({
      is_filed: '10',
      id: this.state.versionActiveIndex
    })
    message.success("删除成功")
    this.getProdList()
  }

  render() {
    return (
      <div className="product">
        <div className="header">
          <div className="back">
            <div onClick={()=>{window.location.href='./home'}} className="backIcon">
              <LeftOutlined /> {this.state.prodName}
            </div>
          </div>
          <div className="tab">
            <div className={this.state.prodType === '2' ? 'item active' : 'item'} onClick={this.changeProdType.bind(this, '2')}>产品</div>
            <div className={this.state.prodType === '1' ? 'item active' : 'item'} onClick={this.changeProdType.bind(this, '1')}>设计</div>
          </div>
          <div className="upload">
            <Button type="primary" icon={<CloudUploadOutlined />} onClick={this.setModalVisible.bind(this, true)}>上传{this.state.prodType==='1' ? '设计图': '产品原型'}</Button>
          </div>
        </div>
        <div className="content">
          {this.state.siderPack ? <div className="unfoldOut" onClick={()=>{this.setState({siderPack: false})}}>
            <MenuUnfoldOutlined className="unfoldOutIcon"/>
          </div> : ''}
          <div className={this.state.siderPack ? 'sider foldOut' : 'sider unFoldOut'}>
            <div className="siderContent">
              <div className="siderHeader">
                全部版本
                <MenuFoldOutlined className="inLeft" title="收起" onClick={()=>{this.setState({siderPack: true})}}/>
              </div>
              <div className="prodList">
                {this.state.prodList.map((item, index)=><div key={item.prd_id} className="item">
                  <div className={item.prd_id === this.state.activeIndex ? 'itemHeader active' : 'itemHeader'} onClick={this.setActiveIndex.bind(this, item)}>
                    <div className="icon">
                      <CaretRightOutlined className="jiantou"/>
                    </div>
                    {item.prd_id === this.state.activeIndex ? <img className="wenjianjia" src={wenjianOpen} alt=""/> : <img className="wenjianjia" src={wenjian} alt=""/>}
                    <div className="prodName" title={item.prd_name}>{item.prd_name}</div>
                    {item.prd_id === this.state.activeIndex ? <div className="popover">
                      <Popover 
                      placement="rightTop"
                      trigger="hover" 
                      content={ 
                        <div className="popoverControl">
                          {item.pic_url ? <p>
                            <a href={item.pic_url} download="imgs.zip">
                              <CloudDownloadOutlined /> 下载切图
                            </a>
                          </p> : <p><CloudOutlined /> 暂无切图</p>}
                          <p onClick={this.upLoadPic.bind(this, item.pic_url)}><CloudUploadOutlined /> {item.pic_url ? '更新': '上传'}切图</p>
                        </div>
                      }>
                        <BarsOutlined />
                      </Popover>
                    </div> : ''}
                  </div>
                  <div className={item.prd_id === this.state.activeIndex ? 'itemList active' : 'itemList'}>
                   {item.list.map((v:any)=> <div key={v.id} className={(v.id=== this.state.versionActiveIndex && item.prd_id===this.state.activeIndex) ? 'versions active' : 'versions'} onClick={this.setActiveItemIndex.bind(this, v, item.prd_id)}>
                      <div className="name">{item.prd_name} {v.id=== this.state.versionActiveIndex && item.prd_id===this.state.activeIndex ? <DeleteOutlined  className='delete' onClick={(e)=>{this.delete(e)}}/> : ''} </div>
                      <div className="time">
                        <span className="timeData">{moment(v.created_at).parseZone().format('YYYY-MM-DD HH:mm')}</span>
                        <span>{v.create_user}</span>
                      </div>
                    </div>)}
                  </div>
                </div>)}
              </div>
            </div>
          </div>
          <div className="iframe">
            <Spin size="large" spinning={this.state.loading}>
              <div className="iframeConetnt">
                {this.state.prodList.length ? <iframe src={this.state.iframeUrl} frameBorder={0} width="100%" height="100%" title="内容区" style={{background: '#000'}}></iframe> : <Nothing info="暂无数据" buttonName={`上传${this.state.prodType==='1' ? '设计图': '产品原型'}`} handleClick={this.setModalVisible.bind(this, true)}></Nothing>}
              </div>
            </Spin>
          </div>
        </div>
        {this.state.modalVisible ? <Upload prodType={this.state.prodType} prodName={this.state.prodName} prodId={this.state.prodId} line_type={this.state.line_type} isVisible={this.setModalVisible.bind(this, false)}/> : ''}
        {this.state.upImgVisible ? <UploadImgs prd_id={this.state.activeIndex} prd_name={this.state.activeIndexName} prodType={this.state.prodType} prodName={this.state.prodName} prodId={this.state.prodId} line_type={this.state.line_type} isVisible={this.upImgVisible.bind(this, false)}/> : ''}
      </div>
    );
  }
}

export default Product;
