/*
 * @Author: lixiang 
 * @Date: 2018-05-11 23:08:50 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-05-12 00:25:33
 */

import { Layout } from 'antd';
import UserPage from '../routes/UsersPage';
import style from './style.less';
const { Header, Content, Footer } = Layout;

function BasicLayout({ children }) {

  return (
    <Layout>
      <Header style={{ height: '80px' }}>
        <div className={style.logo}></div>
      </Header>
      <Content style={{ padding: '20px 50px' }}>
        <UserPage></UserPage>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        麦谷电子商务有限公司
      </Footer>
    </Layout>
  )
}

export default BasicLayout;