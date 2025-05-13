import React from 'react';
import { Table, Avatar, Spin, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { api, avatarUrl } from '../services/api';
import { Link } from 'react-router-dom';
import type { User } from '../types';
import { getAvatarColor, getInitials } from '../services/avatar';


export default function UserList() {
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => api.get<User[]>('/users').then((res) => res.data),
  });

  if (isLoading) {
    return <Spin size="large" style={{ display: 'block', margin: 'auto', marginTop: 100 }} />;
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Avatar',
      dataIndex: 'name',
      key: 'avatar',
      width: 80,
      render: (name: string, record: User) => {
        return  <Avatar style={{ backgroundColor: getAvatarColor(record.id) }}>
									{getInitials(name)}
								</Avatar>;
      },
    },
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			render: (name: string, record: User) => (
					<Link to={`/users/${record.id}`}>{name}</Link>
			),
		},

    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => <a href={`mailto:${email}`}>{email}</a>,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => <a href={`tel:${phone}`}>{phone}</a>,
    },
    {
      title: 'Website',
      dataIndex: 'website',
      key: 'website',
      render: (website: string) => (
        <a href={`http://${website}`} target="_blank" rel="noopener noreferrer">
          {website}
        </a>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: User) => (
        <Link to={`/users/${record.id}`}>
					<Button icon={<EyeOutlined />} size="small">
                Show
          </Button>
				</Link>
      ),
    },
  ];

  return <Table rowKey="id" dataSource={users} columns={columns} pagination={false} />;
}