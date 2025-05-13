import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Card, Avatar, Typography, Row, Col, Spin, Modal, Carousel, Divider } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import type { Album, Photo, User } from '../types';
import { getAvatarColor, getInitials } from '../services/avatar';
import './AlbumDetail.css';

const { Title, Text } = Typography;

export default function AlbumDetail() {
  const { id } = useParams<{ id: string }>();
  const albumId = Number(id);

  const { data: album, isLoading: loadingAlbum } = useQuery<Album>({
    queryKey: ['album', albumId],
    queryFn: () => api.get(`/albums/${albumId}`).then((res) => res.data),
  });

  const { data: user, isLoading: loadingUser } = useQuery<User>({
    queryKey: ['user', album?.userId],
    enabled: !!album?.userId,
    queryFn: () => api.get(`/users/${album!.userId}`).then((res) => res.data),
  });

  const { data: photos, isLoading: loadingPhotos } = useQuery<Photo[]>({
    queryKey: ['photos', albumId],
    queryFn: () =>
      api.get<Photo[]>('/photos', {
        params: { albumId, _limit: 10 },
      }).then((res) => res.data),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeLightbox = () => setIsModalOpen(false);

  if (loadingAlbum || loadingUser || loadingPhotos) {
    return <Spin size="large" style={{ display: 'block', margin: 'auto', marginTop: 100 }} />;
  }

  return (
    <div>
			<div className="container">
				{user && (
					<Card style={{ marginBottom: 24 }}>
						<Card.Meta
							avatar={
								<Avatar
									style={{ backgroundColor: getAvatarColor(user.id), color: 'black' }}
								>
									{getInitials(user.name)}
								</Avatar>
							}
							title={<Link to={`/users/${user.id}`}>{user.name}</Link>}
							description={<a href={`mailto:${user.email}`}>{user.email}</a>}
						/>
						<Divider />
						<Title level={4}>{album?.title}</Title>
						{/* Photo Grid */}
						<Row gutter={[16, 16]}>
							{photos?.map((photo, idx) => (
								<Col xs={12} sm={8} md={6} lg={4} key={photo.id}>
									<div className="photo-item" onClick={() => openLightbox(idx)}>
										<img alt={photo.title} src={photo.thumbnailUrl} />
										<div className="overlay">
											<EyeOutlined style={{ color: '#fff' }} />
											Preview
										</div>
									</div>
								</Col>
							))}
						</Row>

						{/* Lightbox Modal */}
						<Modal
							open={isModalOpen}
							footer={null}
							onCancel={closeLightbox}
							width="80%"
							bodyStyle={{ padding: 0 }}
							centered
						>
							<Carousel initialSlide={currentIndex} dots={false}>
								{photos?.map((photo) => (
									<div key={photo.id} className="lightbox-slide">
										<img src={photo.url} alt={photo.title} className="lightbox-img" />
									</div>
								))}
							</Carousel>
						</Modal>
					</Card>
				)}
			</div>
      {/* User Info */}
      

    </div>
  );
}
