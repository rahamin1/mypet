import React from 'react';
import {
  Left, Icon, Right, Text, CardItem
} from "native-base";
import styles from '../styles';

// TODO avoid rerendering of all items
// Involves definition of onPress?
// https://facebook.github.io/react-native/docs/flatlist
export default class MedicalItem extends React.PureComponent {
//class MedicalItem extends React.Component {

  /*
  shouldComponentUpdate(nextProps) {
    const { navigation, selectionIcon, item, index, date, setItemSelection, edit } = this.props;
    console.log(`shouldComponentUpdate <MedicalItem> ${index}`);
    if (nextProps.navigation !== navigation) console.log('--navigation changed');
    if (nextProps.selectionIcon !== selectionIcon) console.log('--selectionIcon changed');
    if (nextProps.item !== item) console.log('--item changed');
    if (nextProps.index !== index) console.log('--index changed');
    if (nextProps.date !== date) console.log('--date changed');
    if (nextProps.setItemSelection !== setItemSelection) console.log('--setItemSelection changed');
    if (nextProps.edit !== edit) console.log('--edit changed');
    console.log(`end comparison props <MedicalItem> ${this.props.index}`);
    return true;
  }
  */

  render() {
    // console.log(`render <MedicalItem> ${this.props.index}`);
    const { navigation, item, index, date, edit, getMedicalIcon,
      selectionIcon, setItemSelection, selection,
      dimBackgroundItems } = this.props;

    const background = selection ? 'rgba(130,130,130,0.7)' : 'rgba(255,255,255,0)';

    return (
      <CardItem key={item.key}
        style={dimBackgroundItems ? styles.dimItems : { backgroundColor: background }}>
        <Left>
          <Icon name={selectionIcon}
            style={{ fontSize: 14, padding: 10 }}
             onPress={() => setItemSelection(index)} />
          <Text></Text>
          <Icon name={getMedicalIcon(item.type)}
            style={[{ fontSize: 26 },
              dimBackgroundItems ? styles.dimText : null]}
            onPress={() =>
            navigation.navigate('MedicalDisplay', { item })} />
          <Text
            style={dimBackgroundItems ? styles.dimText : null}
            onPress={() =>
            navigation.navigate('MedicalDisplay', { item })}>
            {/*date.toString().substr(4, 12)*/}
            {date}: {item.type}
          </Text>
        </Left>
        <Right>
          <Icon name="ios-paper"
            style={[{ fontSize: 22, color: '#444' },
              dimBackgroundItems ? styles.dimText : null]}
            onPress={() => edit(navigation, item)} />
        </Right>
      </CardItem>
    );
  }
}
