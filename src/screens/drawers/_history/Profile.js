import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Content, Button, Text } from 'native-base';

export default class Profile extends React.Component {
  static navigationOptions = {
    header: null
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container}>
          <View style={styles.welcomeContainer}>
            <Content>
              <Button style={styles.buttonStyle} primary block
                onPress={() =>
                this.props.navigation.navigate('Welcome')}>
                <Text> Go to Welcome </Text>
              </Button>
              <Button style={styles.buttonStyle} success block
                onPress={() =>
                this.props.navigation.navigate('Main')}>
                <Text> Go to Tabs </Text>
              </Button>
              <Button style={styles.buttonStyle} info block
                onPress={() =>
                this.props.navigation.navigate('Login')}>
                <Text> Go to Login </Text>
              </Button>
              <Button style={styles.buttonStyle} success block
                onPress={() =>
                this.props.navigation.openDrawer()}>
                <Text> Open Drawer </Text>
              </Button>
            </Content>
          </View>

          <View style={styles.getStartedContainer}>
            <Text style={styles.getStartedText}>Profile</Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    paddingTop: 30
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50
  },
  buttonStyle: {
    marginBottom: 10
  },
  getStartedText: {
    fontSize: 30,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 40,
    textAlign: 'center'
  }
});
