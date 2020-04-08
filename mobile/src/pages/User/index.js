import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';
import api from '../../services/api';

export default class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stars: [],
      loading: false,
      page: 2,
    };
  }

  async componentDidMount() {
    const { route } = this.props;
    const { navigation } = this.props;
    const { user } = route.params;

    navigation.setOptions({ title: user.name });
    this.setState({ loading: true });
    const response = await api.get(`/users/${user.login}/starred`);
    this.setState({ stars: response.data, loading: false });
  }

  async loadMore() {
    const { page, stars } = this.state;
    const { route } = this.props;
    const { user } = route.params;

    const newStars = await api.get(`/users/${user.login}/starred?page=${page}`);
    if (newStars.data.length) {
      this.setState({
        stars: [...stars, ...newStars.data],
        page: page + 1,
        loading: false,
      });
    }
  }

  render() {
    const { route } = this.props;
    const { stars, loading } = this.state;
    const { user } = route.params;
    return (
      <Container loading={loading}>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {loading ? (
          <ActivityIndicator color="#ccc" />
        ) : (
          <Stars
            data={stars}
            onEndReachedThreshold={0.2}
            onEndReached={() => {
              this.loadMore();
            }}
            keyExtractor={(star) => String(star.id)}
            renderItem={({ item }) => (
              <Starred>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}

User.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.object,
  }).isRequired,
  navigation: PropTypes.shape({
    setOptions: PropTypes.func,
  }).isRequired,
};
