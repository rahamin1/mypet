import { StyleSheet, Platform, StatusBar } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    ...Platform.select({
      android: {
        marginTop: StatusBar.currentHeight
      }
    })
  },
  dim: {
    backgroundColor: 'rgba(80,80,80,0.3)'
  },
  dimItems: {
    backgroundColor: 'rgba(20,20,20,0.3)'
  },
  dimText: {
    color: 'rgba(80,80,80,0.3)'
  },
  content: {
    flex: 1
  },
  header: {
    backgroundColor: '#41b8f4'
    // backgroundColor: '#ad41ad'
  },
  button: {
    marginBottom: 10
  },
  errorTextStyle: {
    color: 'red'
  },
  largeTitle: {
    fontSize: 20,
    fontWeight: '500'
  },
  textTitle: {
    fontWeight: '500'
  },
  textMargins: {
    marginRight: 10,
    paddingRight: 10
  },
  minimalPadding: {
    paddingLeft: 10,
    paddingRight: 10
  },
  marginAll: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10
  },
  icon: {
    color: '#444'
  }
});

export default styles;
