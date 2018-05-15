/*
 * @Author: lixiang 
 * @Date: 2018-05-11 23:08:50 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-05-16 00:51:44
 */

import { Layout, Menu, Icon } from 'antd';
import { Link } from 'dva/router';
import style from './BasicLayout.less';
const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

function BasicLayout({ children }) {
  let path = (window.location.hash || '').slice(2);
  path = (path === "") ? 'home' : path;
  return (
    <Layout>
      <Header style={{ height: '60px', position: 'fixed', width: '100%', zIndex: 100 }}>
        <div className={style.logo}></div>
      </Header>
      <Layout>
        <Sider wdith={200} style={{ background: '#fff', overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 60 }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={[path]}
            defaultOpenKeys={['origization']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item key="home" >
              <Link to='/'>
                <Icon type="home" /><span>首页</span>
              </Link>

            </Menu.Item>

            <SubMenu key="origization" title={<span><Icon type="team" />组织管理</span>}>
              <Menu.Item key="units"><Link to="/units">中心管理</Link></Menu.Item>
              <Menu.Item key="departments"><Link to="/departments">部门管理</Link></Menu.Item>
              <Menu.Item key="teams"><Link to="/teams">战队管理</Link></Menu.Item>
              <Menu.Item key="groups"><Link to="/groups">小组管理</Link></Menu.Item>
              <Menu.Item key="users"><Link to="/users">用户管理</Link></Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout style={{ marginLeft: 200, marginTop: 60 }}>
          <Content style={{ padding: '20px 50px', height: 'calc(100vh - 60px)', overflow: 'auto' }}>
            {children}
          </Content>
          {/* <Footer style={{ textAlign: 'center' }}>
            麦谷电子商务有限公司
          </Footer> */}
        </Layout>
      </Layout>
    </Layout>
  )
}

export default BasicLayout;