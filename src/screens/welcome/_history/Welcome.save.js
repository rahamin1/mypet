import React, { Component } from 'react';
import { View, AsyncStorage, StyleSheet, SafeAreaView } from 'react-native';
import { AppLoading } from 'expo';

import Slides from 'mypet/components/Slides';
import styles from './styles';

import Example from 'mypet/components/CarouselExample/CarouselExample'

const SLIDE_DATA = [
  { text: 'Welcome to Sample Routing App', color: '#00aced' },
  { text: 'Swipe away to continue', color: '#64d448',
    buttonText: 'Press OK to exit welcome screens' }
];

export default class WelcomeWithSlides extends Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true, firstExecution: true };
    this.checkFirstExecution = this.checkFirstExecution.bind(this);
  }

  componentDidMount() {
    this.checkFirstExecution();
    AsyncStorage.setItem('welcomeExecuted', 'already executed');
  }

  render() {
    if (this.state.isLoading) {
      return (
        <AppLoading />
      );
    }

    if (!this.state.firstExecution) {
      this.props.navigation.navigate('auth');
    }

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Slides data={SLIDE_DATA} onComplete={this.onSlidesComplete.bind(this)}/>
        </View>
      </SafeAreaView>
    );
  }

  onSlidesComplete() {
    this.props.navigation.navigate('Auth');
  }

  async checkFirstExecution() {
    let executed;
    try {
      executed = await AsyncStorage.getItem('welcomeExecuted');
      this.setState({ isLoading: false, firstExecution: (executed === null) });
    } catch (error) {
      this.setState({ isLoading: false, firstExecution: true });
    }
  }
}
