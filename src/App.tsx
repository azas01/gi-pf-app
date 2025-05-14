import { useState } from 'react';
import { Layout, Menu, Breadcrumb, Typography } from 'antd';
import { ProfileOutlined, IdcardOutlined, LeftOutlined, RightOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Routes, Route, Navigate, useLocation, useNavigate, Link } from 'react-router-dom';

import AlbumList from './pages/AlbumList';
import AlbumDetail from './pages/AlbumDetail';
import UserList from './pages/UserList';
import UserDetail from './pages/UserDetail';
import './App.css';

const { Sider, Content } = Layout;

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const selectedKey = location.pathname.startsWith('/users') ? '/users' : '/albums';

  const isDetail = /\/(albums|users)\/\d+/.test(location.pathname);
  const parts = location.pathname.split('/').filter(Boolean);
  const section = parts[0] || 'albums';

  const title = isDetail
    ? `Show ${section === 'users' ? 'User' : 'Album'}`
    : '';

  const crumbs = isDetail
    ? [
        { title: section === 'users' ? 'Users' : 'Albums', 
          href: `/${section}`,
          icon: section === 'users' ? <IdcardOutlined/> : <ProfileOutlined /> },
        { title: 'Show' },
      ]
    : [];

  return (
    <>
      <div className="global-logo-bar">
        <Link to="/albums">
          <img
            src="https://geekup.vn/Icons/geekup-logo-general.svg"
            alt="GeekUP"
            className="global-logo"
          />
        </Link>
      </div>
      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          trigger={null}
          width={200}
          style={{ marginTop: 64 }}
          className="app-sider"
        >
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={({ key }) => navigate(key)}
            style={{ borderRight: 0 }}
            items={[
              {
                key: '/albums',
                icon: <ProfileOutlined />,
                label: 'Albums',
              },
              {
                key: '/users',
                icon: <IdcardOutlined />,
                label: 'Users',
              },
            ]}
          />
          <div className="sider-footer" onClick={() => setCollapsed((c) => !c)}>
            {collapsed ? <RightOutlined style={{ color: '#1890ff' }} /> : <LeftOutlined style={{ color: '#1890ff' }} />}
          </div>
        </Sider>

        <Layout className="app-main">
          <Content className="app-content">
            {isDetail && (
              <div className="page-header">
                <Breadcrumb
                  items={crumbs.map((c) => ({
                    title: (
                      <>
                        {c.icon && <span style={{ marginRight: 4 }}>{c.icon}</span>}
                        {c.href ? (
                          <a onClick={() => navigate(c.href)}>{c.title}</a>
                        ) : (
                          c.title
                        )}
                      </>
                    ),
                  }))}
                />
                <div className="page-header-top">
                  <ArrowLeftOutlined
                    onClick={() => navigate(-1)}
                    style={{ fontSize: '16px', marginInlineEnd: '16px', cursor: 'pointer' }}
                  />
                  <Typography.Title level={4} style={{ margin: 0 }}>
                    {title}
                  </Typography.Title>
                </div>
              </div>
            )}

            <div className="page-body">
              <Routes>
                <Route path="/" element={<Navigate to="/albums" replace />} />
                <Route path="/albums" element={<AlbumList />} />
                <Route path="/albums/:id" element={<AlbumDetail />} />
                <Route path="/users" element={<UserList />} />
                <Route path="/users/:id" element={<UserDetail />} />
              </Routes>
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
