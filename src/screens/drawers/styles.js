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
  textTitle: {
    fontSize: 20,
    fontWeight: '500'
  },
  textSubTitle: {
    fontSize: 16,
    fontWeight: '300'
  },
  blueTextStyle: {
    color: '#00f',
    fontWeight: 'bold',
    alignSelf: 'center',
    padding: 5
  },
  lightBlueTextStyle: {
    color: '#7e7d84',
    fontWeight: 'bold',
    alignSelf: 'center',
    padding: 5
  },
  marginAll: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10
  },
  textPadding: {
    paddingRight: 20
  }
});

export default styles;
