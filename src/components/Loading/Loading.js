import React from 'react';
import { View } from 'react-native';
import { Spinner } from 'native-base';

const Loading = () => (
  <View style={{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <Spinner color={'#4fbeee'}/>
  </View>
);

export default Loading;
