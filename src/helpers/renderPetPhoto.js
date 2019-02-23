import React from 'react';
import { Body, CardItem, Thumbnail } from 'native-base';
import { logo } from '../constants/miscConstants';

export const renderPetPhoto = (photo) => {
  if (photo && photo !== '') {
    return (
      <CardItem cardBody>
        <Body>
        <Thumbnail large circle style={{
          borderWidth: 1, borderColor: '#888',
          marginLeft: 0, marginTop: 10, alignSelf: 'center' }}
          source={{ uri: photo }}/>
        </Body>
      </CardItem>
    );
  } else {
    return (
      <CardItem cardBody>
        <Body>
        <Thumbnail large circle style={{
          borderWidth: 1, borderColor: '#888',
          marginLeft: 0, marginTop: 10, alignSelf: 'center' }}
          source={logo}/>
        </Body>
      </CardItem>
    );
  }
};
