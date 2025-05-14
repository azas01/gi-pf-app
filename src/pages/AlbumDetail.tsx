import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Card, Avatar, Typography, Row, Col, Spin, Divider, Image } from 'antd';
import type { Album, Photo, User } from '../types';
import { getAvatarColor, getInitials } from '../services/avatar';
import './AlbumDetail.css';

const { Title } = Typography;

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

  if (loadingAlbum || loadingUser || loadingPhotos) {
    return <Spin size="large" style={{ display: 'block', margin: 'auto', marginTop: 100 }} />;
  }

  return (
    <div className="container">
      {user && (
        <Card>
          <Card.Meta
            avatar={
              <Avatar style={{ backgroundColor: getAvatarColor(user.id), color: 'black' }}>
                {getInitials(user.name)}
              </Avatar>
            }
            title={<Link to={`/users/${user.id}`}>{user.name}</Link>}
            description={<a href={`mailto:${user.email}`}>{user.email}</a>}
          />
          <Divider />
          <Title level={4}>{album?.title}</Title>
          <Spin spinning={loadingPhotos}>
            <Image.PreviewGroup>
              <Row gutter={[16, 16]}>
                {photos?.map((photo) => (
                  <Col xs={12} sm={8} md={6} lg={4} key={photo.id}>
                    <Image
                      src={photo.thumbnailUrl}
                      alt={photo.title}
                      preview={{ src: photo.url }}
                      className="photo-item"
                      style={{ cursor: 'pointer' }}
                    />
                  </Col>
                ))}
              </Row>
            </Image.PreviewGroup>
          </Spin>
        </Card>
      )}
    </div>
  );
}
