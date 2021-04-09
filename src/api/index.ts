import Axios from "../units/axios";

const ajax = new Axios();

// 登录
const login = async (data: {user_name: string, password: string}) => {
  return await ajax.post({
    url: "/login",
    body: {
      user_name: data.user_name,
      password: data.password
    },
  });
};

// 重置密码
const resetPassword = async (data: {user_name: string, password: string, new_password: string}) => {
  return await ajax.post({
    url: "/resetPassword",
    body: {
      user_name: data.user_name,
      password: data.password,
      new_password: data.new_password
    },
  });
};

// 获取用户列表
const getUsersList = async (data: {line_type: string}) => {
  return await ajax.get({
    url: "/getUsersList",
    params: {
      line_type: data.line_type,
    },
  });
};

// 根据产品线获取产品列表
const getProdList = async (data: {line_type: number}) => {
  return await ajax.get({
    url: "/record/getProdList",
    params: {
      line_type: data.line_type,
    },
  });
};

// 创建产品
const creatProd = async (data: {line_type: number, prod_name: string }) => {
  return await ajax.post({
    url: "/record/creatProd",
    body: {
      line_type: data.line_type,
      prod_name: data.prod_name
    },
  });
};

// 创建产品
const getRecordList = async (data: {prd_type: string, prod_id: string }) => {
  return await ajax.get({
    url: "/record/getRecordList",
    params: {
      prd_type: data.prd_type,
      prod_id: data.prod_id
    },
  });
};

// 更新产品状态
const updateIsFiled = async (data: {is_filed: string, id: number }) => {
  return await ajax.post({
    url: "/record/updateIsFiled",
    params: {
      is_filed: data.is_filed, // 1已归档，0未归档 10:删除
      id: data.id
    },
  });
};

// 创建或更新产品版本
const saveRecord = async (data: any, onUploadProgress: Function) => {
  let formData = new FormData()
  formData.set('upName', data.upName)
  formData.set('picName', data.picName)
  return await ajax.post({
    url: `/record/saveRecord`,
    body: formData,
    params:{
      prd_id: data.prd_id,
      prd_name: data.prd_name,
      prod_name: data.prod_name,
      prd_type: data.prd_type,
      is_filed: data.is_filed,
      file_name:data.file_name,
      pic_file_name: data.pic_file_name,
      prod_id: data.prod_id,
      line_type: data.line_type,
      notify_obj: data.notify_obj
    },
    options:{
      headers:{
        'Content-Type': 'form-data'
      },
      onUploadProgress: function (progressEvent: any) {
        onUploadProgress(progressEvent)
        // 对原生进度事件的处理
      },
    }
  });
};

// 更新切图
const uploadPic = async (data: any, onUploadProgress: Function) => {
  let formData = new FormData()
  formData.set('file', data.file)
  return await ajax.post({
    url: `/record/uploadPic`,
    body: formData,
    params:{
      prd_id: data.prd_id,
      prd_name: data.prd_name,
      prod_name: data.prod_name,
      prd_type: data.prd_type,
      prod_id: data.prod_id,
      line_type: data.line_type,
      notify_obj: data.notify_obj
    },
    options:{
      headers:{
        'Content-Type': 'form-data'
      },
      onUploadProgress: function (progressEvent: any) {
        onUploadProgress(progressEvent)
        // 对原生进度事件的处理
      },
    }
  });
};


export { 
  updateIsFiled,
  login,
  resetPassword,
  getUsersList,
  getProdList,
  creatProd,
  getRecordList,
  saveRecord,
  uploadPic
};
