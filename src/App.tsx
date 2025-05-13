// import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import AlbumList from './pages/AlbumList';
import AlbumDetail from './pages/AlbumDetail';
import UserList from './pages/UserList';
import UserDetail from './pages/UserDetail';

const { Header, Content } = Layout;

export default function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: 'white'}}>
        GI Product Frontend
      </Header>
      <Content style={{ padding: 24 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/albums" />} />
          <Route path="/albums" element={<AlbumList />} />
          <Route path="/albums/:id" element={<AlbumDetail />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/:id" element={<UserDetail />} />
        </Routes>
      </Content>
    </Layout>
  );
}
