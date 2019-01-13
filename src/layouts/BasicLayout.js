/*
 * @Author: lixiang 
 * @Date: 2018-05-11 23:08:50 
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-01-13 21:15:15
 */
import React, { Component } from 'react';
import { Link, withRouter } from 'dva/router';
import { connect } from 'dva';
import { getAuthorized } from '../utils/sessionHelper';
import { Layout, Menu, Icon, Button, Avatar } from 'antd';
import LoginModal from './LoginModel';
import style from './BasicLayout.less';


const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

class BasicLayout extends Component {

  state = {
    showLoginModal: false,
  }

  showModal = () => {
    this.setState({
      showLoginModal: true,
    })
  }

  hideModal = () => {
    this.setState({
      showLoginModal: false,
    })
  }

  loginHandler = (values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/login',
      payload: {
        ...values,
        next: () => {
          this.hideModal();
        }
      }
    })
  }

  onLoginClick = (e) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    const isAuthorized = getAuthorized();
    if (isAuthorized) {
      dispatch({
        type: 'global/logout',
      })
    } else {
      this.showModal();
    }

  }

  render() {
    const isAuthorized = getAuthorized();
    const { showLoginModal } = this.state;
    const { location: { pathname }, currentUser } = this.props;

    return (
      <Layout>
        <Header className={style.header}>
          <div className={style.logo}></div>
          <div className={style.info}>
            {isAuthorized ? <Avatar >{currentUser.username}</Avatar> : null}
            <Button onClick={this.onLoginClick} type='primary'>{isAuthorized ? '退出' : '登录'}</Button>
          </div>
          <LoginModal visible={showLoginModal} onCancel={this.hideModal} onOk={this.loginHandler} />
        </Header>
        <Layout>
          <Sider wdith={200} className={style.sider}>
            <Menu
              mode='inline'
              defaultSelectedKeys={['/']}
              selectedKeys={[pathname]}
              style={{ height: '100%', borderRight: 0 }}
            >
              <Menu.Item key='/' >
                <Link to='/'>
                  <Icon type='home' /><span>首页</span>
                </Link>
              </Menu.Item>

              <SubMenu key='/control' title={<span><Icon type='dashboard' />控制台</span>}>
                <Menu.Item key='/stop'><Link to='/stop'>暂停计时</Link></Menu.Item>
              </SubMenu>

              <SubMenu key='/origization' title={<span><Icon type='team' />组织管理</span>}>
                <Menu.Item key='/units'><Link to='/units'>中心管理</Link></Menu.Item>
                <Menu.Item key='/departments'><Link to='/departments'>部门管理</Link></Menu.Item>
                <Menu.Item key='/teams'><Link to='/teams'>战队管理</Link></Menu.Item>
                <Menu.Item key='/groups'><Link to='/groups'>小组管理</Link></Menu.Item>
                <Menu.Item key='/users'><Link to='/users'>用户管理</Link></Menu.Item>
              </SubMenu>

              <SubMenu key='serviceType' title={<span><Icon type='bars' theme='outlined' />数据管理</span>}>
                <Menu.Item key='serviceType'><Link to='/serviceType'>套餐管理</Link></Menu.Item>
                <Menu.Item key='customers'><Link to='/customers'>客户管理</Link></Menu.Item>
              </SubMenu>

            </Menu>
          </Sider>
          <Layout className={style.layout}>
            <Content className={style.content} >
              {this.props.children}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    )
  }

}

function mapStateToProps({ global, loading }) {
  return {
    ...global,
    loading: loading.effects['global/login']
  }
}

export default withRouter(connect(mapStateToProps)(BasicLayout));