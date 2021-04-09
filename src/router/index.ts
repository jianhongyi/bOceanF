import Login from '../pages/login'
import Home from '../pages/home'
import Reset from '../pages/resetpassword'
import Product from '../pages/product'

const routes = [
  {
    path: "/login",
    component: Login
  },
  {
    path: "/home",
    component: Home
  },
  {
    path: "/reset",
    component: Reset
  },
  {
    path: "/product",
    component: Product
  }
];

export default routes

