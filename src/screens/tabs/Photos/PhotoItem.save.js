import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Left, Icon, Right, Body, Text, Card, CardItem } from "native-base";
import { photoHeight } from '../../../constants/miscConstants';
import styles from '../styles';

export default class PhotoItem extends React.PureComponent {

  render() {
    const { navigation, item, index, date, edit,
      selectionIcon, setItemSelection, selection,
      dimBackgroundItems } = this.props;

    // item is dark when selected
    const background = selection ? 'rgba(130,130,130,0.7)' : 'rgba(255,255,255,0)';

    return (
      <TouchableOpacity onPress={() => navigation.navigate('PhotoDisplay', { item })}>
        <Card key={item.key}>

          <CardItem
            style={dimBackgroundItems ? styles.dimItems : { backgroundColor: background }}>
            <Left>
              <Icon name={selectionIcon}
                style={{ fontSize: 14, padding: 10 }}
                 onPress={() => setItemSelection(index)} />
            </Left>
            <Body></Body>
            <Right>
              <Icon name="ios-paper"
                style={[{ fontSize: 22, color: '#444' },
                  dimBackgroundItems ? styles.dimText : null]}
                onPress={() => edit(navigation, item)} />
            </Right>
          </CardItem>

          <CardItem cardBody>
            <Image source={{ uri: item.photo }}
            style={{ height: photoHeight, width: null,
            resizeMode: 'contain', flex: 1 }}/>
            <View style={[{ position: 'absolute', top: 0, left: 0, right: 0,
              bottom: 0, backgroundColor: background },
              dimBackgroundItems ? styles.dimItems : null]} />
          </CardItem>

          <CardItem style={dimBackgroundItems ? styles.dimItems : { backgroundColor: background }}>
            <Body>
              <Text style={dimBackgroundItems ? styles.dimText : null}>
                {item.title}
              </Text>
            </Body>
            <Right>
              <Text note
                style={[{ color: '#000' }, dimBackgroundItems ?
                  styles.dimText : null]} >
                {date}
              </Text>
            </Right>
          </CardItem>

        </Card>
      </TouchableOpacity>
    );
  }
}
