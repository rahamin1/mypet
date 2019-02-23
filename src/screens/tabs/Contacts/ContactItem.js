import React from 'react';
import { TouchableOpacity } from 'react-native';
import {
  Left, Right, Icon, Text, Card, CardItem, Thumbnail
} from "native-base";
import styles from '../styles';

// TODO avoid rerendering of all items
// Involves definition of onPress?
// https://facebook.github.io/react-native/docs/flatlist
export default class ContactItem extends React.PureComponent {
//class ContactItem extends React.Component {

  /*
  shouldComponentUpdate(nextProps) {
    const { navigation, selectionIcon, item, index, date, setItemSelection, edit } = this.props;
    console.log(`shouldComponentUpdate <ContactItem> ${index}`);
    if (nextProps.navigation !== navigation) console.log('--navigation changed');
    if (nextProps.selectionIcon !== selectionIcon) console.log('--selectionIcon changed');
    if (nextProps.item !== item) console.log('--item changed');
    if (nextProps.index !== index) console.log('--index changed');
    if (nextProps.date !== date) console.log('--date changed');
    if (nextProps.setItemSelection !== setItemSelection) console.log('--setItemSelection changed');
    if (nextProps.edit !== edit) console.log('--edit changed');
    console.log(`end comparison props <ContactItem> ${this.props.index}`);
    return true;
  }
  */

  render() {
    // console.log(`render <ContactItem> ${this.props.index}`);
    const { navigation, item, index, edit,
      selectionIcon, setItemSelection, selection,
      dimBackgroundItems } = this.props;

    const background = selection ? 'rgba(130,130,130,0.7)' : 'rgba(255,255,255,0)';

    return (
      <Card>
        <TouchableOpacity onPress={() => this.display(navigation, item)}>
          <CardItem header key={item.key}
            style={dimBackgroundItems ? styles.dimItems :
              { backgroundColor: background, paddingBottom: 0 }}>
            <Left>
              <Icon name={selectionIcon}
                style={{ fontSize: 14, padding: 10 }}
                 onPress={() => setItemSelection(index)} />

              <Thumbnail circle small source={require('../../../images/profile.png')}
                style={dimBackgroundItems ? styles.dim : null}/>
              <Text
                style={dimBackgroundItems ? styles.dim : null}>
                {item.name}
              </Text>
            </Left>

            <Right>
              <Icon name="ios-paper"
                style={[{ fontSize: 22, color: '#444' },
                  dimBackgroundItems ? styles.dimText : null]}
                onPress={() => edit(navigation, item)} />
            </Right>
          </CardItem>

          <CardItem
            style={dimBackgroundItems ? styles.dimItems :
            { backgroundColor: background, paddingTop: 0 }}>
            <Left style={{ marginLeft: 65 }}>
              <Text
                style={dimBackgroundItems ? styles.dimText : null}>
                {item.phone}
              </Text>
            </Left>
            <Right />
          </CardItem>
        </TouchableOpacity>
      </Card>
    );
  }

  display(navigation, item) {
    navigation.navigate('ContactDisplay', { item });
  }
}
