import axios from "axios";
import { message } from "antd";
import CONSIFG from "../config";

const baseUrl = CONSIFG.url;
const token = localStorage.getItem("TOKEN") || '';
const headers = {
  'Content-Type': 'application/json; charset=utf-8'
};

const errorCodes = new Map([
  [404, () => message.error("未找到内容")],
  [500, () => message.error("服务器内部错误")],
  [504, () => message.error("请求超时")],
]);

class Axios {
  constructor(url) {
    this.successCode = 200
    this.axios = this.getIns(url);
  }

  getIns(url = "") {
    return this.interceptors(
      axios.create({
        baseURL: baseUrl + url,
      })
    );
  }

  // 拦截
  interceptors(obj) {
    obj.interceptors.request.use(
      (config) => {
        config.headers.token = token;
        console.log('config', config)
        return config;
      },
      (err) => {
        return Promise.resolve(err);
      }
    );

    obj.interceptors.response.use(
      (data) => {
        const callback = errorCodes.get(data.data.code);
        if (typeof callback === "function") {
          callback();
        } else {
          return data;
        }
      },
      (err) => {
        if (!err.response && err.message === "Network Error") {
          message.error("网络异常,无法连接到网络");
        } else {
          const callback = errorCodes.get(err.response.status);
          if (typeof callback === "function") {
            callback();
          }
        }
        return Promise.resolve(err);
      }
    );

    return obj;
  }

  /**
   * @description: get请求
   * @param {string} url url
   * @param {object} params params
   * @param {object} options options
   * @return:
   */
  async get(reqParams) {
    let { url, params, options = {} } = reqParams;
    options = { params, ...options };
    console.log('options', options)
    return await this.callback(await this.axios.get(url, options));
  }

  /**
   * @description: post请求
   * @param {string} url url
   * @param {object} body body
   * @param {object} options options
   * @return: response
   */
  async post(reqParams) {
    let { url, body, params={}, options = {} } = reqParams;
    options = { params, headers, ...options };
    console.log('---options--', {
      method: 'post',
      url,
      data: body,
      headers: options.headers,
      params: options.params,
      ...options
    })
    return await this.callback(
      await this.axios({
        method: 'post',
        url,
        data: body,
        headers: options.headers,
        params: options.params,
        ...options
      }),
      options
    );
  }

  /**
   * @description: 统一处理回调
   * @param {object} response response
   * @param {object}
   * @return: response
   */
  async callback(response) {
    if (!response) throw response;
    if (response?.data?.code === this.successCode) {
      return response.data.data
    } else if(response?.data?.code === -1){
      if(response.data.error === '未登录'){
        window.location.href=`./login${window.location.search}`
      }else{
        message.error(response.data.error)
        return false
      }
    } else {
      response?.data?.tip && message.error(response?.data?.tip)
      return false
    }
  }
}

export default Axios;
