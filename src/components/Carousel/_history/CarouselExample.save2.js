import React, { Component } from 'react';
import { Platform, View, ScrollView, Text, StatusBar, SafeAreaView } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { sliderWidth, itemWidth } from 'example/src/styles/SliderEntry.style';
import SliderEntry from 'example/src/components/SliderEntry';
import styles, { colors } from 'example/src/styles/index.style';
import { ENTRIES1, ENTRIES2 } from 'example/src/static/entries';
import { scrollInterpolators, animatedStyles } from 'example/src/utils/animations';

const IS_ANDROID = Platform.OS === 'android';
const SLIDER_1_FIRST_ITEM = 0;

export default class CarouselExample extends Component {

    constructor(props) {
        super(props);
        this.state = {
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM
        };
    }

    _renderItem({ item, index }) {
        return <SliderEntry data={item} even={(index + 1) % 2 === 0} />;
    }

    _renderItemWithParallax({ item, index }, parallaxProps) {
        return (
            <SliderEntry
              data={item}
              even={(index + 1) % 2 === 0}
              parallax={true}
              parallaxProps={parallaxProps}
            />
        );
    }

    _renderLightItem({ item, index }) {
        return <SliderEntry data={item} even={false} />;
    }

    _renderDarkItem({ item, index }) {
        return <SliderEntry data={item} even={true} />;
    }

    showCareousel() {
        const { slider1ActiveSlide } = this.state;

        return (
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Welcome to My Pet!</Text>
                <Text style={styles.subtitle}>The place for holding the important information about your pet.</Text>
                <Carousel
                  ref={c => this._slider1Ref = c}
                  data={ENTRIES1}
                  renderItem={this._renderItemWithParallax}
                  sliderWidth={sliderWidth}
                  itemWidth={itemWidth}
                  hasParallaxImages={true}
                  firstItem={SLIDER_1_FIRST_ITEM}
                  inactiveSlideScale={0.94}
                  inactiveSlideOpacity={0.7}
                  // inactiveSlideShift={20}
                  containerCustomStyle={styles.slider}
                  contentContainerCustomStyle={styles.sliderContentContainer}
                  loop={false}
                  loopClonesPerSide={2}
                  autoplay={false}
                  autoplayDelay={15000}
                  autoplayInterval={15000}
                  onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
                />
                <Pagination
                  dotsLength={ENTRIES1.length}
                  activeDotIndex={slider1ActiveSlide}
                  containerStyle={styles.paginationContainer}
                  dotColor={'rgba(255, 255, 255, 0.92)'}
                  dotStyle={styles.paginationDot}
                  inactiveDotColor={colors.black}
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.6}
                  carouselRef={this._slider1Ref}
                  tappableDots={!!this._slider1Ref}
                />
            </View>
        );
    }

    render() {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.outerContainer}>
                    <StatusBar
                      translucent={true}
                      backgroundColor={'rgba(0, 0, 0, 0.3)'}
                      barStyle={'light-content'}
                    />
                    {/* this.gradient */}
                    <ScrollView
                      style={styles.scrollview}
                      scrollEventThrottle={200}
                      directionalLockEnabled={true}>
                        { this.showCareousel() }
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
}
