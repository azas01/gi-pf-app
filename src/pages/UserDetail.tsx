import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Card, Avatar, Typography, Spin, List, Button } from 'antd';
import { getAvatarColor, getInitials } from '../services/avatar';
import type { User, Album } from '../types';
import { EyeOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);

  const {
    data: user,
    isLoading: loadingUser,
  } = useQuery<User>({
    queryKey: ['user', userId],
    queryFn: () => api.get(`/users/${userId}`).then((res) => res.data),
  });

  const {
    data: albums = [],
    isLoading: loadingAlbums,
  } = useQuery<Album[]>({
    queryKey: ['albums-by-user', userId],
    queryFn: () =>
      api.get<Album[]>('/albums', { params: { userId } }).then((res) => res.data),
  });

  if (loadingUser || loadingAlbums) {
    return <Spin size="large" style={{ display: 'block', margin: 'auto', marginTop: 100 }} />;
  }

  if (!user) return <div>User not found.</div>;

  return (
    <div>
      <Card style={{ marginBottom: 24 }}>
        <Card.Meta
          avatar={
            <Avatar
              size={64}
              style={{
                backgroundColor: getAvatarColor(user.id),
                color: 'black',
              }}
            >
              {getInitials(user.name)}
            </Avatar>
          }
          title={<Title level={4}>{user.name}</Title>}
          description={
            <Paragraph>
              <div>Email: <a href={`mailto:${user.email}`}>{user.email}</a></div>
              <div>Phone: <a href={`tel:${user.phone}`}>{user.phone}</a></div>
              <div>
                Website:{' '}
                <a href={`http://${user.website}`} target="_blank" rel="noreferrer">
                  {user.website}
                </a>
              </div>
            </Paragraph>
          }
        />
      </Card>

      <Title level={5}>Albums by {user.name}</Title>

      <List
        bordered
        dataSource={albums}
        renderItem={(album) => (
          <List.Item
            actions={[
              <Link to={`/albums/${album.id}`} key="show">
                <Button size="small" icon={<EyeOutlined />}>
                  Show
                </Button>
              </Link>,
            ]}
          >
            {album.title}
          </List.Item>
        )}
      />
    </div>
  );
}
