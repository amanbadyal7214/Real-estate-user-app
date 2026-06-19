import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const PropertySuggestionCard = ({
  image,
  developerName,
  developerInitial,
  price,
  title,
  location,
  config,
  onPress
}) => {
  return (
    <Animated.View entering={FadeInUp.duration(600).delay(300)}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.93}
        style={styles.cardContainer}
      >
        <View style={styles.imageBackground}>
          <Image
            source={typeof image === 'string' ? { uri: image } : image}
            style={[StyleSheet.absoluteFill, { borderRadius: wp('5.3%') }]}
            contentFit="cover"
            transition={800}
            cachePolicy="memory-disk"
          />
          <LinearGradient
            colors={['rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.8)']}
            style={styles.fullGradient}
          >
            {/* Developer Badge Container */}
            <View style={styles.devBadge}>
              <LinearGradient
                colors={['#008E96', '#1CB2A9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.initialBubble}
              >
                <Text style={styles.initialText}>{developerInitial}</Text>
              </LinearGradient>
              <Text numberOfLines={1} style={styles.devNameText}>
                {developerName}
              </Text>
            </View>

            {/* Favorite/Heart Button */}
            <View style={styles.favButton}>
              <Heart size={wp('5.3%')} color="#4A5565" strokeWidth={1.5} />
            </View>

            {/* Pricing */}
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>{price}</Text>
            </View>

            {/* Project Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.titleLabel}>{title}</Text>
            </View>

            {/* Location & Config Details */}
            <View style={styles.detailsContainer}>
              <Text style={styles.detailText}>{location}</Text>
              <Text style={styles.detailText}>{config}</Text>
            </View>

          </LinearGradient>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: wp('53.3%'),
    height: hp('39.4%'),
    borderRadius: wp('5.3%'),
    overflow: 'hidden',
    marginRight: wp('3.2%'),
  },
  imageBackground: {
    flex: 1,
  },
  fullGradient: {
    flex: 1,
    position: 'relative',
  },
  devBadge: {
    position: 'absolute',
    left: wp('4.3%'),
    top: hp('2%'),
    width: wp('32%'),
    height: hp('4.4%'),
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: wp('5.3%'),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('1.6%'),
  },
  initialBubble: {
    width: wp('6.4%'),
    height: wp('6.4%'),
    borderRadius: wp('3.2%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('2.1%'),
  },
  initialText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    fontSize: wp('3.2%'),
    lineHeight: hp('2.2%'),
  },
  devNameText: {
    color: '#101828',
    fontFamily: 'Inter-Bold',
    fontSize: wp('2.7%'),
    lineHeight: hp('2%'),
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    flex: 1,
  },
  favButton: {
    position: 'absolute',
    left: wp('41.5%'),
    top: hp('1.5%'),
    width: wp('9.6%'),
    height: wp('9.6%'),
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: wp('4.8%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceContainer: {
    position: 'absolute',
    left: wp('4.3%'),
    top: hp('26.8%'),
    width: wp('44.8%'),
  },
  priceLabel: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    fontSize: wp('4.8%'),
    lineHeight: hp('3.2%'),
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  titleContainer: {
    position: 'absolute',
    left: wp('4.3%'),
    top: hp('30.3%'),
    width: wp('44.8%'),
  },
  titleLabel: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    fontSize: wp('3.7%'),
    lineHeight: hp('2.5%'),
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  detailsContainer: {
    position: 'absolute',
    left: wp('4.3%'),
    top: hp('33.3%'),
    width: wp('44.8%'),
  },
  detailText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Inter-Medium',
    fontSize: wp('2.9%'),
    lineHeight: hp('2%'),
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
});

export default PropertySuggestionCard;
