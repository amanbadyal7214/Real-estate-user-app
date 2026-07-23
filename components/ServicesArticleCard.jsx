import { Image, Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

/**
 * ServicesArticleCard
 *
 * Props:
 *  - title    (string) – article title
 *  - date     (string) – e.g. "Feb 2025"
 *  - excerpt  (string) – short description
 *  - image    (string) – image URI
 *  - onPress  (fn)     – tap handler
 */
const ServicesArticleCard = ({ title, date, excerpt, image, onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.85}
            className="bg-white overflow-hidden mr-4"
            style={{
                width: wp('77.3%'),
                borderWidth: 0.667,
                borderColor: '#E4E7EC',
                borderRadius: wp('4.3%'),
            }}
        >
            {/* Article Image */}
            <Image
                source={{ uri: image }}
                className="w-full"
                style={{ height: hp('17.2%') }}
                resizeMode="cover"
            />

            {/* Content */}
            <View style={{ paddingHorizontal: wp('4.3%'), paddingTop: hp('2%'), paddingBottom: hp('2%'), gap: hp('0.5%') }}>
                {/* Title */}
                <Text
                    className="font-semibold text-[#101828]"
                    style={{ fontSize: wp('4.3%'), lineHeight: wp('5.3%') }}
                    numberOfLines={2}
                >
                    {title}
                </Text>

                {/* Date */}
                <Text
                    className="font-medium text-[#6A7282]"
                    style={{ fontSize: wp('3.2%'), lineHeight: wp('4.8%'), marginTop: hp('0.4%') }}
                >
                    {date}
                </Text>

                {/* Excerpt */}
                <Text
                    className="font-medium text-[#4A5565]"
                    style={{ fontSize: wp('3.7%'), lineHeight: wp('6.1%'), marginTop: hp('0.4%') }}
                    numberOfLines={2}
                >
                    {excerpt}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default ServicesArticleCard;
