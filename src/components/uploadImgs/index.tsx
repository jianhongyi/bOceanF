import React, { useState, useEffect } from "react";
import { Modal, Progress, Tree, Input, message } from "antd";
import "./index.less";
import { getUsersList,uploadPic } from "@/api";
import SelectFile from "@/components/selectFile";


interface propsState {
  line_type: string;
  prd_id: string;
  prd_name: string;
  prodId: string;
  prodName: string;
  prodType: string;
  isVisible: Function;
}

function UploadImgs(props: propsState) {
  const { prodType, isVisible, line_type, prodId, prodName, prd_name, prd_id } = props;

  const [userList, setUserList] = useState([]);
  const [progress, setProgress] = useState(0);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [formData, seFormData] = useState({
    prd_id: prd_id,
    prd_name: prd_name,
    prod_name: prodName,
    prd_type: prodType,
    file: "",
    pic_file_name: "",
    prod_id: prodId,
    line_type: line_type,
    notify_obj: ""
  });

  const handleOk = async () => {
    console.log(formData)
    if(!formData.pic_file_name){
      message.error('请选择要上传文件')
      return
    }
    if(!formData.notify_obj){
      message.error('请选择通知对象')
      return
    }
    setConfirmLoading(true)
    const res = await uploadPic(formData, (progressEvent:any) => {
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
 
  // 选择切图
  const getPicFileInfo = (fileInfo: any) => {
    seFormData(Object.assign({},formData,{
      pic_file_name: fileInfo.name,
      file: fileInfo
    }));
  };

  // 初始化
  useEffect(() => {
    getUserList(line_type);
  }, []);

  return (
    <div className="upload">
      <Modal
        title='切图上传'
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
            <Input className="upSelect" disabled value={prd_name}/>
          </div>
        </div>
       
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

export default UploadImgs;
