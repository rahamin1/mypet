import React from "react";
import { SafeAreaView, View } from "react-native";
import { connect } from 'react-redux';
import { Container, Content, Text, List, ListItem, Left, Right,
  Button, Icon, Body, Thumbnail } from "native-base";

import { signoutUser, petFetch } from '../../actions';
import { checkFacebookLogin } from '../../helpers/facebookAuthHelpers';

const listItems = [
  { title: "Help", route: "Help", icon: "md-help" },
  { title: "About", route: "About", icon: "ios-information-circle-outline" }
];

class Drawer extends React.Component {

  componentDidMount() {
    const { userId } = this.props.auth;
    if (userId && userId !== '')
      this.props.petFetch(userId);
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Container>
          <Content contentContainerStyle={{
            justifyContent: 'flex-start', marginTop: 30
            }}>
            {this.renderUserPetDetails.bind(this)()}

            <List
              dataArray={listItems}
              renderRow={data => {
                return (
                  <ListItem onPress={() => this.props.navigation.navigate(data.route)} icon>
                    <Left>
                      <Button onPress={() => this.props.navigation.navigate(data.route)}
                        style={{ backgroundColor: "#888" }}>
                        <Icon active name={data.icon} />
                      </Button>
                    </Left>
                    <Body>
                      <Text
                        style={{ fontSize: 14, fontWeight: '600' }}>
                        {data.title}</Text>
                    </Body>
                  </ListItem>
                );
              }}
            />
          </Content>
        </Container>
      </SafeAreaView>
    );
  }

  renderUserPetDetails() {
    const { email, fbToken, fbExpires, fbUser, guest } = this.props.auth;
    // Set user name text
    let userText = '';
    if (guest) {
      userText = 'Guest user';
    } else if (email !== '') {
      userText = email;
    } else if (checkFacebookLogin(fbToken, fbExpires)) {
      userText = fbUser;
    }

    if (!userText || userText === '')
      return null;

    return (
      <View>
        <View style={{ marginLeft: 10 }}>
          <Text style={{
            fontSize: 14, fontWeight: '600', marginLeft: 10,
            fontStyle: 'italic', color: '#4253f4' }}>
            {userText}
          </Text>
        </View>
        { this.renderPetInfo.bind(this)() }
        <View>
          <ListItem icon>
            <Left>
              <Button onPress={() =>
                this.props.signoutUser(email, this.props.navigation)}
                style={{ backgroundColor: "#888" }}>
                <Icon active name="md-exit" />
              </Button>
            </Left>
            <Body>
              <Text style={{ fontSize: 14, fontWeight: '600' }}
                onPress={() =>
                  this.props.signoutUser(email, this.props.navigation)}>
                Sign out</Text>
            </Body>
          </ListItem>
        </View>
      </View>
    );
  }

  renderPetInfo() {
    const { name, photo } = this.props.pet;
    if (name !== '') {
      return (
        <View>
          <ListItem onPress={() =>
            this.props.navigation.navigate('Pet')}>
            <Left>
              <Thumbnail medium circle style={{
                borderWidth: 1, borderColor: '#888',
                marginLeft: 0, paddingLeft: 0,
                marginRight: 10, paddingRight: 0 }}
                source={{ uri: photo }}/>
              <Text style={{ fontSize: 14, fontWeight: '600',
                  color: '#4253f4', marginRight: 10 }}>
                {this.props.pet.name}
              </Text>
            </Left>
            <Right style={{ marginLeft: 10 }} />
          </ListItem>
        </View>
      );
    } else {
      return (
        <ListItem icon onPress={() => this.props.navigation.navigate('Pet')}>
          <Left>
            <Button
              style={{ backgroundColor: "#888" }}>
              <Icon active name='md-barcode' />
            </Button>
          </Left>
          <Body>
            <Text style={{ fontSize: 14, fontWeight: '600' }}>
              My Pet Details
            </Text>
          </Body>
        </ListItem>
      );
    }
  }
}

function mapStateToProps({ auth, pet }) {
  return { auth, pet };
}

export default connect(mapStateToProps, { signoutUser, petFetch })(Drawer);
