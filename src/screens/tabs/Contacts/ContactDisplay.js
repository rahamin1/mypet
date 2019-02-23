import React from "react";
import { SafeAreaView, View, BackHandler } from "react-native";
import {
  Container, Body, Content, Header, Card, CardItem, Thumbnail,
  Left, Right, Title, Button, Text, Icon
} from "native-base";

import styles from '../styles';

class ContactDisplay extends React.Component {
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
    this.props.navigation.goBack();
    return true;
  }

  render() {
    console.log('ContactDisplay/render. item:');
    console.log(this.props.navigation.state.params.item);

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Container style={styles.container}>
          <Header>
            <Left>
              <Button transparent onPress={() =>
                 this.props.navigation.goBack()}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title>{'Contact Details'}</Title>
            </Body>
            <Right />
          </Header>
          <Content padder>
            {this.renderContactItem.bind(this)()}
          </Content>
        </Container>
      </SafeAreaView>
    );
  }

  renderContactItem() {
    const { photo, name, phone, mail, comments } = this.props.navigation.state.params.item;
    return (
      <Card style={{ flex: 1, padding: 10, alignItems: 'flex-start' }}>

        <CardItem style={{ marginBottom: 20, alignItems: 'center' }}>
          <Thumbnail circle large
            source={require('../../../images/profile.png')}/>
          <Text style={{ fontWeight: '500', paddingRight: 60, paddingLeft: 10 }}>{name}</Text>
        </CardItem>

        <View style={{ flexDirection: 'row' }}>
          <Icon style={{ marginRight: 10, marginBottom: 20 }} name='md-call' />
          <Text style={styles.textTitle}>
            {phone}
          </Text>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <Icon style={{ marginRight: 10, marginBottom: 20 }} name='md-mail' />
          <Text style={styles.textTitle}>
            {mail}
          </Text>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <Icon style={{ marginRight: 10 }} name='md-clipboard' />
          <Text style={styles.textTitle}>
            Comments:{' '}
          </Text>
        </View>
        <Text style={{ marginBottom: 20 }}>{comments}</Text>

      </Card>
    );
  }
}

export default ContactDisplay;
