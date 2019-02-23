import React, { Component } from "react";
import { SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import {
  Container, Header, Title, Left, Icon, Right, Button,
  Body, Content, Text, List, ListItem, Thumbnail
} from "native-base";

import { signoutUser } from '../../../actions';

import styles from '../styles';

class Photos extends Component {
  static navigationOptions = {
    header: null
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Container>
          <Header style={styles.header}>
            <Left>
              <Button
                transparent
                onPress={() => this.props.navigation.openDrawer()}>
                <Icon name="menu" />
              </Button>
            </Left>
            <Body>
              <Title>Photos</Title>
            </Body>
            <Right />
          </Header>

          <Content>
            <List>

              <ListItem thumbnail>
                <Left>
                  <Thumbnail square source={require('mypet/images/robot-prod.png')} />
                </Left>
                <Body>
                  <Text>Edit Item</Text>
                  <Text note numberOfLines={1}>Its time to build a difference . .</Text>
                </Body>
                <Right>
                  <Button transparent onPress={() =>
                    this.props.navigation.navigate('PhotoEdit')}>
                    <Text>Edit</Text>
                  </Button>
                </Right>
              </ListItem>

              <ListItem thumbnail>
                <Left>
                  <Thumbnail square source={require('mypet/images/icon.png')} />
                </Left>
                <Body>
                  <Text>Welcome / Auth</Text>
                  <Text note numberOfLines={1}>Go to Tab2 . .</Text>
                </Body>
                <Right>
                  <Button transparent onPress={() =>
                    this.props.navigation.navigate('Tab2')}>
                    <Text>Tab2</Text>
                  </Button>
                </Right>
              </ListItem>

              <ListItem thumbnail>
                <Left>
                  <Thumbnail square source={require('mypet/images/robot-prod.png')} />
                </Left>
                <Body>
                  <Text>Sign Out</Text>
                  <Text note numberOfLines={1}>out out out</Text>
                </Body>
                <Right>
                  <Button transparent onPress={() =>
                    this.props.signoutUser(this.props.navigation)}>
                    <Text>Out</Text>
                  </Button>
                </Right>
              </ListItem>

            </List>
          </Content>
        </Container>
      </SafeAreaView>
    );
  }
}
export default connect(null, { signoutUser })(Photos);
