import { Table, Avatar, Button, Spin } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import type { Album, User } from '../types';
import { getAvatarColor, getInitials } from '../services/avatar';

export default function AlbumList() {
  const [search] = useSearchParams();
  const navigate = useNavigate();

  const current = Number(search.get('current') ?? 1);
  const pageSize = Number(search.get('pageSize') ?? 10);

  const {
    data: albums = [],
    isLoading: isAlbumsLoading,
  } = useQuery<Album[]>({
    queryKey: ['albums', current, pageSize],
    queryFn: () =>
      api
        .get<Album[]>('/albums', { params: { _page: current, _limit: pageSize } })
        .then((res) => res.data),
    placeholderData: (previousData) => previousData
  });

  const {
    data: users = [],
    isLoading: isUsersLoading,
  } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => api.get<User[]>('/users').then((res) => res.data),
  });

  const userMap = new Map(users.map((user) => [user.id, user]));

  if (isAlbumsLoading || isUsersLoading) {
    return <Spin size="large" style={{ display: 'block', margin: 'auto', marginTop: 100 }} />;
  }

  return (
    <Table
      rowKey="id"
      dataSource={albums}
      pagination={{
        current,
        pageSize,
        total: 100,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        onChange: (page, size) => navigate(`?current=${page}&pageSize=${size}`)
      }}
      columns={[
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
          width: 60,
        },
        {
          title: 'Album Title',
          dataIndex: 'title',
          key: 'title',
        },
        {
          title: 'User',
          key: 'user',
          render: (_, record) => {
            const user = userMap.get(record.userId);
            if (!user) return <>User {record.userId}</>;
            return (
              <Link to={`/users/${user.id}`}>
                <Avatar
									style={{ backgroundColor: getAvatarColor(user.id), color: 'black', marginRight: 8 }}
								>
									{getInitials(user.name)}
								</Avatar>
                {user.name}
              </Link>
            );
          },
        },
        {
          title: 'Action',
          key: 'action',
          render: (_, record) => (
            <Link to={`/albums/${record.id}`}>
              <Button icon={<EyeOutlined />} size="small">
                Show
              </Button>
            </Link>
          ),
        },
      ]}
    />
  );
}
