import React from "react";
import { SafeAreaView, View, Image } from "react-native";
import { connect } from 'react-redux';
import { Container, Content, Text, List, ListItem } from "native-base";

import { checkFacebookLogin } from 'mypet/helpers/facebookAuthHelpers';

const routes = ["Profile", "Signout", "Help", "About"];

class Drawer extends React.Component {

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Container>
          <Content contentContainerStyle={{
            justifyContent: 'flex-start', marginTop: 30
            }}>
            {this.renderUsername.bind(this)()}
              <Image
                square
                style={{ height: 80, width: 70, marginLeft: 10 }}
                source={require('mypet/images/chats-icon.png')}
              />
            <List
              dataArray={routes}
              renderRow={data => {
                return (
                  <ListItem
                    button
                    onPress={() => this.props.navigation.navigate(data)}>
                    <Text style={{ fontSize: 12, fontWeight: '600' }}>{data}</Text>
                  </ListItem>
                );
              }}
            />
          </Content>
        </Container>
      </SafeAreaView>
    );
  }

  renderUsername() {
    const email = (this.props.email === '') ? "No email user" : this.props.email;
    // console.warn(`FB token: ${this.props.fbToken}`);
    const fbUser = (checkFacebookLogin()) ? "No FB user" : `FB: ${this.props.fbUser}`;
    return (
      <View style={{ marginLeft: 10 }}>
        <Text>
          {email}
        </Text>
        <Text>
          {fbUser}
        </Text>
      </View>
    );
  }
}

function mapStateToProps({ auth, facebookAuth }) {
  return {
    email: auth.email,
    fbUser: facebookAuth.fbUser
  };
}

export default connect(mapStateToProps)(Drawer);
