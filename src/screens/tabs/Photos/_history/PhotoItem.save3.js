import React from 'react';
import { FileSystem } from 'expo';
import { View, Image, TouchableOpacity } from 'react-native';
import {
  Left, Icon, Right, Body, Text, Card, CardItem, Spinner
} from "native-base";

const noPhoto = '../../../images/photo_does_not_exist.png';

export default class PhotoItem extends React.PureComponent {

  // render the photo only after checking whether it exists
  state = { photoChecked: false, photoExists: null };

  async componentDidMount() {
    const { item } = this.props;
    const { exists } = await FileSystem.getInfoAsync(item.photo);
    this.setState({ photoChecked: true, photoExists: exists });
  }

  render() {
    // console.log(`render <PhotoItem> ${this.props.index}`);
    const { navigation, item, index, date,
      setItemSelection, selectionIcon, selection, edit } = this.props;

    // item is dark when selected
    const background = selection ? 'rgba(130,130,130,0.7)' : 'rgba(255,255,255,0)';

    if (!this.state.photoChecked) {
      return (
        <View style={{ alignItems: 'center' }}>
          <CardItem>
            <Spinner color='#41b8f4'/>
          </CardItem>
        </View>
      );
    }

    return (
      <TouchableOpacity onPress={() => navigation.navigate('PhotoDisplay', { item })}>
        <Card
          key={item.key}>
          <CardItem style={{ backgroundColor: background }}>
            <Left>
              <Icon name={selectionIcon} style={{ fontSize: 12 }}
                 onPress={() => setItemSelection(index)} />
            </Left>
            <Body></Body>
            <Right>
              <Icon name="ios-paper" onPress={() => edit(navigation, item)} />
            </Right>
         </CardItem>
         <CardItem cardBody>

           { this.state.photoExists ?
           <Image source={{ uri: item.photo }}
             style={{ height: 240, width: null, flex: 1 }}/> :
           <Image source={require(noPhoto)}
            style={{ height: 240, width: null, flex: 1 }}/> }

            <View style={{ position: 'absolute', top: 0, left: 0, right: 0,
              bottom: 0, backgroundColor: background }} />
          </CardItem>
          <CardItem style={{ backgroundColor: background }}>
            <Body>
              <Text>{item.title}</Text>
            </Body>
            <Right>
              <Text style={{ color: '#000' }} note>{date}</Text>
            </Right>
          </CardItem>
        </Card>
      </TouchableOpacity>
    );
  }
}
