import React, { PureComponent } from "react";
import { message } from "antd";
import { resetPassword } from "@/api";
import "./index.less";

interface ResetStates {
  name: string;
  password: string;
  newPassword: string;
  repeatPassword: string;
}
class Reset extends PureComponent<any, ResetStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      name: "",
      password: "",
      newPassword: "",
      repeatPassword: "",
    };
  }
  resetPassword() {
    const { name, password, newPassword, repeatPassword } = this.state;
    if (newPassword !== repeatPassword) {
      message.error("新密码和确认密码不一致");
      return;
    }
    if (!name) {
      message.error("请填写用户名");
      return;
    }
    if (!password || !newPassword || !repeatPassword) {
      message.error("请填写密码");
      return;
    }
    if (newPassword === "123123") {
      message.error("不能和初始密码一致");
      return;
    }
    this.login();
  }

  async login() {
    const { name, password, newPassword } = this.state;
    const res = await resetPassword({
      user_name: name,
      password: password,
      new_password: newPassword,
    });
    if (res) {
      localStorage.setItem("TOKEN", res.token);
      localStorage.setItem("USERINFO", JSON.stringify(res));
      window.location.href = "./home";
    }
  }

  render() {
    return (
      <div className="reset">
        <h1>蓝海</h1>
        <div className="contentPassword">
          <div className="input">
            <span>姓名/邮箱：</span>
            <input
              type="text"
              placeholder="请输入姓名或邮箱"
              id="userName"
              onChange={(e) => {
                this.setState({ name: e.target.value });
              }}
            ></input>
          </div>
          <div className="input">
            <span>旧密码：</span>
            <input
              type="password"
              placeholder="请输入密码"
              id="oldPassword"
              onChange={(e) => {
                this.setState({ password: e.target.value });
              }}
            ></input>
          </div>
          <div className="input">
            <span>新密码：</span>
            <input
              type="password"
              placeholder="请输入密码"
              id="newPassword"
              onChange={(e) => {
                this.setState({ newPassword: e.target.value });
              }}
            ></input>
          </div>
          <div className="input">
            <span>确认密码：</span>
            <input
              type="password"
              placeholder="请输入密码"
              id="rePassword"
              onChange={(e) => {
                this.setState({ repeatPassword: e.target.value });
              }}
            ></input>
          </div>
          <button id="submit" onClick={this.resetPassword.bind(this)}>
            重置密码
          </button>
        </div>
      </div>
    );
  }
}

export default Reset;
