import React, { useState, useEffect } from "react";
import { Modal, Select, Progress, Tree, Input, message } from "antd";
import "./index.less";
import { getUsersList, getRecordList,saveRecord } from "@/api";
import SelectFile from "@/components/selectFile";

const { Option } = Select;

interface propsState {
  line_type: string;
  prodId: string;
  prodName: string;
  prodType: string;
  isVisible: Function;
}

function UploadC(props: propsState) {
  const { prodType, isVisible, line_type, prodId, prodName } = props;

  const [isUpdata, setIsUpdata] = useState(true);
  const [userList, setUserList] = useState([]);
  const [prodList, setProdList] = useState([]);
  const [progress, setProgress] = useState(0);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [formData, seFormData] = useState({
    prd_id: "",
    prd_name: "",
    prod_name: prodName,
    prd_type: prodType,
    is_filed: "0",
    file_name: "",
    pic_file_name: "",
    prod_id: prodId,
    line_type: line_type,
    notify_obj: "",
    upName: "",
    picName: "",
  });

  const handleOk = async () => {
    console.log(formData)
    if(!formData.prd_name){
      message.error('请选择更新对象或输入新建项目名')
      return
    }
    if(!formData.file_name){
      message.error('请选择要上传文件')
      return
    }
    if(!formData.notify_obj){
      message.error('请选择通知对象')
      return
    }
    setConfirmLoading(true)
    const res = await saveRecord(formData, (progressEvent:any) => {
      let pro = Math.round(progressEvent.loaded / progressEvent.total * 100)
      setProgress(pro)
      console.log('progressEvent', progressEvent)
    })
    if(res){
      message.success('操作成功')
      setConfirmLoading(false)
      isVisible();
    }
  };
  const handleCancel = () => {
    isVisible();
  };
  // 更新是选择需要更新的对象，获取prd_id
  const handleChange = (value: string, option:any) => {
    seFormData(Object.assign({}, formData, {
      prd_id: option.value,
      prd_name: option.name
    }));
  };
  // 获取通知对象
  const onCheck = (checkedKeys: any) => {
    seFormData(Object.assign({}, formData, {
      notify_obj:  checkedKeys.filter((item: number) => item > 0).toString()
    }));
  };
  // 获取用户列表
  const getUserList = async (line_type: string) => {
    const res = await getUsersList({ line_type: line_type });
    if(!res) return 
    let list: any = {};
    res.forEach((item: any, index: number) => {
      if (!list[item.user_type]) {
        list[item.user_type] = {
          title: item.type_name,
          key: -index - 1,
          children: [
            {
              title: item.user_name_cn,
              key: item.id,
            },
          ],
        };
      } else {
        list[item.user_type].children.push({
          title: item.user_name_cn,
          key: item.id,
        });
      }
    });
    const treeData: any = [
      {
        title: "全选",
        key: -1000,
        children: Object.values(list),
      },
    ];

    setUserList(treeData);
  };
  // 获取产品列表
  const getProdList = async () => {
    const res = await getRecordList({
      prd_type: prodType,
      prod_id: prodId,
    });
    if (res) {
      setProdList(res);
    }
  };
  // 选择文件上传
  const getFileInfo = (fileInfo: any) => {
    seFormData(Object.assign({},formData,{
      file_name: fileInfo.name,
      upName: fileInfo
    }));
  };
  // 选择切图
  const getPicFileInfo = (fileInfo: any) => {
    seFormData(Object.assign({},formData,{
      pic_file_name: fileInfo.name,
      picName: fileInfo
    }));
  };

  // 创建或者更新选择
  const creatOrUpdate = () => {
    if (isUpdata) { // 如果当前是更新状态，切换时初始化对应数据
      seFormData(Object.assign({},formData, {prd_id: ''}));
    }else{
      seFormData(Object.assign({},formData, {prd_name: ''}));
    }
    setIsUpdata(!isUpdata);
  };

  const inputPrdName = (e: any) => {
    seFormData(Object.assign({},formData, {prd_name: e.target.value}));
  }

  // 初始化
  useEffect(() => {
    getUserList(line_type);
    getProdList();
  }, []);

  return (
    <div className="upload">
      <Modal
        title={`上传${prodType === '1' ? "设计图" : "产品原型"}`}
        visible={true}
        onOk={handleOk}
        onCancel={handleCancel}
        className="uploadModal"
        okText="提交"
        cancelText="取消"
        confirmLoading={confirmLoading}
        maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.15)" }}
      >
        <div className="item">
          <div className="title">项目名称</div>
          <div className="value">
            {isUpdata ? (
              <Select
                style={{ width: 120 }}
                onChange={handleChange}
                className="upSelect"
                placeholder="请选择更新项目"
              >
                {prodList.map((item: { prd_id: string; prd_name: string }) => (
                  <Option key={item.prd_id} value={item.prd_id} name={item.prd_name}>
                    {item.prd_name}
                  </Option>
                ))}
              </Select>
            ) : (
              <Input className="upSelect" placeholder="请输入项目名称" onChange={inputPrdName} />
            )}
            <div className="cntrol" onClick={creatOrUpdate}>
              {isUpdata ? "新建" : "查找"}
            </div>
          </div>
        </div>
        <div className="item">
          <div className="title">文件上传</div>
          <div className="value">
            <div className="upButton">
              <SelectFile buttonName="选择文件" setFileInfo={getFileInfo} />
            </div>
            <div className="upLine">
              {formData.file_name ? (
                <div className="fileName fillFile">{formData.file_name}</div>
              ) : (
                <div className="fileName">暂未选择任何文件</div>
              )}
              <Progress
                strokeColor="#67CF84"
                percent={progress}
                size="small"
                status="active"
              />
            </div>
          </div>
        </div>
        {prodType === '1' ? (
          <div className="item">
            <div className="title">切图上传</div>
            <div className="value">
              <div className="upButton">
                <SelectFile
                  buttonName="选择文件"
                  setFileInfo={getPicFileInfo}
                />
              </div>
              <div className="upLine">
                {formData.pic_file_name ? (
                  <div className="fileName fillFile">
                    {formData.pic_file_name}
                  </div>
                ) : (
                  <div className="fileName">暂未选择任何文件</div>
                )}
                <Progress
                  strokeColor="#67CF84"
                  percent={formData.pic_file_name ? progress : 0}
                  size="small"
                  status="active"
                />
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="item">
          <div className="title">通知对象</div>
          <div className="value tree">
            {userList.length ? (
              <Tree
                height={203}
                checkable
                defaultExpandedKeys={[-1000]}
                onCheck={onCheck}
                treeData={userList}
              />
            ) : (
              ""
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default UploadC;
