import React from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, BackHandler } from "react-native";
import {
  Container, Body, Content, Header, Left, Right,
  Icon, Card, CardItem, Thumbnail, Title, Button, Text
} from "native-base";
import { logo } from '../../constants/miscConstants';
import styles from './styles';

class Bugs extends React.Component {

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
              <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title>Known Bugs</Title>
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
              <Text style={styles.textSubTitle}>Bugs</Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem bordered>
          <Text style={styles.textPadding}>
            The application is still being developed.
            There are few bugs we are aware of and are working on:
          </Text>
        </CardItem>
        <CardItem bordered>
          <Icon active name="md-bug" />
          <Text style={styles.textPadding}>
            Saving of photos does not work properly (either selected
            or taken with the camera), in all applicable parts
            (photos, pet profile, contacts): the saved photos cannot be displayed.
          </Text>
        </CardItem>
        <CardItem bordered>
          <Icon active name="md-bug" />
          <Text style={styles.textPadding}>
            The android 'back' button doesn't work in some places.
          </Text>
        </CardItem>
        <CardItem bordered>
          <Left />
          <Text style={[styles.textPadding, { alignSelf: 'center' }]}>
            We are doing our best to fix these issues soon.
          </Text>
          <Right />
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

export default connect(mapStateToProps)(Bugs);
