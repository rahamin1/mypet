import React, { Component } from 'react';
import {
  Dimensions,
  ScrollView,
  View,
  Text,
  Button,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class Slides extends Component {

  constructor(props) {
    super(props);
    this.renderSlides = this.renderSlides.bind(this);
  }

  render() {
    return (
      <ScrollView horizontal pagingEnabled style={styles.container}>
        {this.renderSlides()}
      </ScrollView>
    );
  }

  renderSlides() {
    const length = this.props.data.length;
    return this.props.data.map((slide, index) => {
      return (
        <View  key={index} style={[styles.outer, { backgroundColor: slide.color }]}>
          <Text style={styles.innerText}>{slide.text}</Text>
          { index === length - 1 && this.renderButton(slide) }
        </View>
      );
    });
  }

  renderButton(slide) {
    if (slide.buttonText) {
      return (
        <TouchableOpacity style={styles.button}
          raised
          onPress={this.props.onComplete}>
          <Text style={styles.buttonText}>{slide.buttonText}</Text>
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  outer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
  },
  innerText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  button: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    borderRadius: 10
  },
  buttonText: {
    color: '#222',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
