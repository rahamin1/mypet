import { StyleSheet } from 'react-native';

export const colors = {
    black: '#1a1917',
    gray: '#888888',
    background: '#cc68dd',
    background1: '#3a65e8',
    background2: '#cc68dd',
    background3: '#cc68dd',
    button: '#ba33e8',
    titleDark: '#4315a5',
    titleDark1: '#8929aa',
    titleDark2: '#84eddd',
    titleDark3: '#4315a5'
};

export default StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.black
    },
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    gradient: {
        ...StyleSheet.absoluteFillObject
    },
    scrollview: {
      flex: 1
    },
    innerContainer: {
      marginTop: 30,
      paddingVertical: 30
    },
    exampleContainerDark: {
        backgroundColor: colors.black
    },
    exampleContainerLight: {
        backgroundColor: 'white'
    },
    title: {
        paddingHorizontal: 30,
        backgroundColor: 'transparent',
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    titleDark: {
        color: colors.titleDark
    },
    subtitle: {
        marginTop: 5,
        paddingHorizontal: 30,
        backgroundColor: 'transparent',
        color: 'rgba(255, 255, 255, 0.75)',
        fontSize: 16,
        fontWeight: '500',
        // fontStyle: 'italic',
        textAlign: 'center'
    },
    slider: {
        marginTop: 15,
        overflow: 'visible' // for custom animations
    },
    sliderContentContainer: {
        paddingVertical: 10 // for custom animation
    },
    paginationContainer: {
        paddingVertical: 8
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 8
    },
    buttonText: {
      fontSize: 16,
      color: '#000',
      fontWeight: '600'
    },
    button: {
      backgroundColor: colors.button
    }
});
