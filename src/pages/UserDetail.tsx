import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Card, Avatar, Typography, Spin, Table, Divider, Button } from 'antd';
import { getAvatarColor, getInitials } from '../services/avatar';
import type { User, Album } from '../types';
import { EyeOutlined } from '@ant-design/icons';

const { Title } = Typography;

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
    <div className='container'>
      <Card>
        <Card.Meta
          avatar={
            <Avatar
              style={{ backgroundColor: getAvatarColor(user.id), color: 'black' }}
            >
              {getInitials(user.name)}
            </Avatar>
          }
          title={<Title style={{ fontSize: '16px' }}>{user.name}</Title>}
          description={<a href={`mailto:${user.email}`}>{user.email}</a>}
        />

        <Divider />

        <Title level={4}>Albums</Title>
        <Table
          rowKey="id"
          dataSource={albums}
          pagination={false}
          columns={[
            {
              title: 'ID',
              dataIndex: 'id',
              key: 'id',
              width: 60,
            },
            {
              title: 'Title',
              dataIndex: 'title',
              key: 'title',
            },
            {
              title: 'Actions',
              key: 'action',
              width: 100,
              render: (_, record) => (
                <Link to={`/albums/${record.id}`}>
                  <Button size="small" icon={<EyeOutlined />}>
                    Show
                  </Button>
                </Link>
              ),
            },
          ]}
        />
      </Card>
      
    </div>
  );
}
