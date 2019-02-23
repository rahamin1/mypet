import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { AppLoading } from 'expo';
import { sleep } from '../../helpers/miscHelpers';
import WelcomeCarousel from '../../components/Carousel/WelcomeCarousel';

export default class WelcomeWithSlides extends Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true, firstExecution: true };
    this.checkFirstExecution = this.checkFirstExecution.bind(this);
  }

  componentDidMount() {
    this.checkFirstExecution();
    AsyncStorage.setItem('welcomeExecuted', 'already executed');
    // The following line can be used to reset - make welcome appear again
    // AsyncStorage.removeItem('welcomeExecuted');
  }

  render() {
    if (this.state.isLoading) {
      return (
        <AppLoading />
      );
    }

    if (!this.state.firstExecution) {
      this.props.navigation.navigate('Auth');
    }

    return (
      <WelcomeCarousel onComplete={this.onSlidesComplete.bind(this)}/>
    );
  }

  onSlidesComplete() {
    this.props.navigation.navigate('Auth');
  }

  // The following is a modified version of checkFirstExecution
  // (the original version can be found below)
  // There were cases in which welcome screen was displayed for
  // a fraction of a second. We are trying to avoid it here
  async checkFirstExecution() {
    try {
      const executed = await AsyncStorage.getItem('welcomeExecuted');
      this.setState({
        firstExecution: (executed === null)
      }, () => {
        // see the comment above this function
        sleep(100);
        this.setState({ isLoading: false });
      });
    } catch (error) {
      this.setState({ isLoading: false, firstExecution: true });
    }
  }

  /*
  async checkFirstExecution() {
    try {
      const executed = await AsyncStorage.getItem('welcomeExecuted');
      this.setState({ isLoading: false, firstExecution: (executed === null) });
    } catch (error) {
      this.setState({ isLoading: false, firstExecution: true });
    }
  }
  */
}
