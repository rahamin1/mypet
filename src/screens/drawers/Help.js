import React from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, BackHandler } from "react-native";
import {
  Container, Body, Content, Header, Left, Right,
  Icon, Card, CardItem, Thumbnail, Title, Button, Text
} from "native-base";
import { logo } from '../../constants/miscConstants';
import styles from './styles';

class Help extends React.Component {

  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    this.props.navigation.navigate('Main');
    return true;
  }

  render() {

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Container style={styles.container}>
          <Header style={styles.header}>
            <Left>
              <Button transparent onPress={() => this.props.navigation.navigate('Main')}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title>Help</Title>
            </Body>
            <Right />
          </Header>
          <Content padder style={styles.content}>
            {this.help.bind(this)()}
          </Content>
        </Container>
      </SafeAreaView>
    );
  }

  help() {
    return (
      <Card style={styles.marginAll}>
        <CardItem bordered>
          <Left>
            { renderPhoto(this.props.pet) }
            <Body>
              <Text style={styles.textTitle}>My Pet!</Text>
              <Text style={styles.textSubTitle}>Help</Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem bordered>
          <Icon active name="md-appstore" />
          <Text style={styles.textPadding}>
            We love our pet, and always wanted an application that
            contains all the important information about her, so...
            we built it.
          </Text>
        </CardItem>
        <CardItem bordered>
          <Icon active name="md-person" />
          <Text style={[{ fontWeight: '500' }, styles.textPadding]}>
            You may use MyPet in one of two ways: as a guest user or
            as a signed user. The limitation for a guest user is that
            data that you save is kept only until the next installation.
            For a signed user, the data is being saved permanently.
            You may also login with user test@mail.com, password 123456,
            in order to view a user account that already has data in it.
          </Text>
        </CardItem>
        <CardItem bordered>
          <Icon active name="md-medkit" />
          <Text style={styles.textPadding}>
            You can store here all your pet's medical info: regular
            doctor appointments and their details, vaccination details,
            information about medications, etc.
          </Text>
        </CardItem>
        <CardItem bordered>
          <Icon name="md-pizza" active/>
          <Text style={styles.textPadding}>
            Food information is also very important (especially if
              there are stomach and other food-related issues):
              which food you have used, and when.
          </Text>
        </CardItem>
        <CardItem bordered>
          <Icon active name="md-photos" />
          <Text style={styles.textPadding}>
            Like us, you probably also have numerous photos.
            The application will let you save the most beautiful ones,
            so that they are always handy.
          </Text>
        </CardItem>
        <CardItem bordered>
          <Icon active name="md-contacts" />
          <Text style={styles.textPadding}>
            Last but not least: important contacts that are related to
            your pet: details of doctors, pet stores, her/his friends :)
          </Text>
        </CardItem>
        <CardItem bordered>
          <Icon active name="md-bug" />
          <Text style={styles.textPadding}
            onPress={() => this.props.navigation.navigate('Bugs')}>
          The application is still being developed.
          There are few bugs we are aware of and are working on;
          Click here to view the list...
          </Text>
        </CardItem>
        <CardItem bordered>
          <Left />
          <Text style={[styles.textPadding, { alignSelf: 'center' }]}>
            We hope that you find
            <Text style={{ fontWeight: '500' }}> MyPet </Text>
              useful!
          </Text>
          <Right />
        </CardItem>
        <CardItem bordered>
          <Body>
            <Button block onPress={() => {
              this.props.navigation.navigate('Main');
            }}>
              <Text>Close</Text>
            </Button>
          </Body>
        </CardItem>
      </Card>
     );
  }
}

export const renderPhoto = (pet) => {
  const { name, photo } = pet;

  if (name !== '') {
    return (
      <Thumbnail circle large source={{ uri: photo }}
        style={{
          marginLeft: 0, paddingLeft: 0,
          marginRight: 10, paddingRight: 0 }}/>
    );
  } else {
    return (
      <Thumbnail circle large source={logo}
        style={{
          marginLeft: 0, paddingLeft: 0,
          marginRight: 10, paddingRight: 0 }}/>
    );
  }
};

function mapStateToProps(state) {
  return {
    pet: state.pet
  };
}

export default connect(mapStateToProps)(Help);
