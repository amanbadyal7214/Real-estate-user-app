import { Ionicons } from '@expo/vector-icons';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

/**
 * ServicesCalculatorCard
 *
 * Props:
 *  - title       (string)  – e.g. "EMI Calculator"
 *  - subtitle    (string)  – e.g. "EMI starts at ₹10.60K"
 *  - iconColor   (string)  – hex colour for the arrow button bg, default #FFA726
 *  - image       (string)  – URI for the illustration shown bottom-right
 *  - onPress     (fn)      – tap handler
 */
const ServicesCalculatorCard = ({
    title,
    subtitle,
    iconColor = '#FFA726',
    image,
    onPress,
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.85}
            className="bg-white mr-4 overflow-hidden"
            style={{
                width: wp('58%'),
                height: hp('17.5%'),
                borderWidth: 0.667,
                borderColor: '#E4E7EC',
                borderRadius: wp('4.3%'),
            }}
        >
            {/* Title + Subtitle */}
            <View className="absolute gap-1" style={{ left: wp('4.3%'), top: hp('2.7%') }}>
                <Text
                    className="font-semibold text-[#101828] leading-[22px]"
                    style={{ fontSize: wp('4.0%') }}
                    numberOfLines={2}
                >
                    {title}
                </Text>
                <Text
                    className="font-medium text-[#6A7282] leading-[16px]"
                    style={{ fontSize: wp('3.0%'), maxWidth: wp('37.3%') }}
                    numberOfLines={2}
                >
                    {subtitle}
                </Text>
            </View>

            {/* Arrow Button */}
            <View
                className="absolute justify-center items-center"
                style={{
                    backgroundColor: iconColor,
                    right: wp('3.7%'),
                    top: hp('2.7%'),
                    width: wp('8%'),
                    height: wp('8%'),
                    borderRadius: wp('4%'),
                }}
            >
                <Ionicons name="arrow-forward" size={wp('4.8%')} color="#FFFFFF" />
            </View>

            {/* Background Illustration */}
            {image ? (
                <Image
                    source={{ uri: image }}
                    className="absolute"
                    style={{ width: wp('21%'), height: wp('21%'), right: 0, bottom: 0 }}
                    resizeMode="cover"
                />
            ) : null}
        </TouchableOpacity>
    );
};

export default ServicesCalculatorCard;
