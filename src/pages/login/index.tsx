import React, { PureComponent } from "react";
import { login } from "@/api";
import "./index.less";

interface LoginPageStates {
  name: string;
  password: string;
}

class Login extends PureComponent<any, LoginPageStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      name: "",
      password: "",
    };
  }

  async login() {
    const { name, password } = this.state;
    if (password === "123123") {
      window.location.href = "./reset";
    } else {
      const res = await login({
        user_name: name,
        password: password,
      });
      if (res) {
        localStorage.setItem("TOKEN", res.token);
        localStorage.setItem("USERINFO", JSON.stringify(res));
        if(window.location.search){
          window.location.href=`./product${window.location.search}`
        }else{
          window.location.href = "./home";
        }
      }
    }
  }

  render() {
    return (
      <div className="login">
        <h1>蓝海</h1>
        <div className="content">
          <div className="input">
            <span>姓名/邮箱：</span>
            <input
              type="text"
              placeholder="请输入姓名或邮箱"
              value={this.state.name}
              onChange={(e) => {
                this.setState({ name: e.target.value });
              }}
            ></input>
          </div>
          <div className="input">
            <span>密码：</span>
            <input
              type="password"
              placeholder="请输入密码"
              onChange={(e) => {
                this.setState({ password: e.target.value });
              }}
            ></input>
          </div>
          <button id="submit" onClick={this.login.bind(this)}>
            登录
          </button>
        </div>
      </div>
    );
  }
}

export default Login;
