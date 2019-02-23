import React from 'react';
import { SafeAreaView, BackHandler } from 'react-native';
import {
  Container, Header, Title, Left, Icon, Right, Button,
  Body, Content, Text, Card, CardItem, Thumbnail
} from "native-base";
import { logo } from '../../../constants/miscConstants';
import styles from '../styles';

export default class Food extends React.Component {
  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Container style={styles.container}>
          <Header style={styles.header}>
            <Left>
              <Button
                transparent
                onPress={() => this.props.navigation.openDrawer()}>
                <Icon name="menu" />
              </Button>
            </Left>
            <Body>
              <Title>Food History</Title>
            </Body>
            <Right>
              <Button
                transparent
                onPress={() => this.setHelpModalVisible(true)}>
                <Icon name="md-help" />
              </Button>
              <Button
                transparent
                onPress={this.deleteItems}>
                <Icon name="ios-trash" />
              </Button>
              <Button
                transparent
                onPress={() => this.edit(this.props.navigation, null)}>
                <Icon name="md-add" />
              </Button>
            </Right>
          </Header>
          <Content padder style={styles.content}>
            <Card style={{ marginTop: 50 }}>
              <CardItem bordered>
                <Left>
                  <Thumbnail source={logo} />
                  <Body>
                    <Text>Not implemented yet</Text>
                    <Text note>Food History</Text>
                  </Body>
                </Left>
              </CardItem>
            </Card>
          </Content>
        </Container>
      </SafeAreaView>
    );
  }

  handleBackPress = () => {
    this.props.navigation.navigate('Photos');
    return true;
  }
}
