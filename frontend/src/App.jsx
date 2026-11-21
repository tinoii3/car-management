import { Layout, Typography } from 'antd';
import CarListPage from './pages/CarListPage';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <Typography.Title level={4} style={{ color: '#fff', margin: 0 }}>
          Car Management
        </Typography.Title>
      </Header>

      <Content style={{ padding: 24, maxWidth: 1200, width: '100%', margin: '0 auto' }}>
        <CarListPage />
      </Content>

    </Layout>
  );
}

export default App;
