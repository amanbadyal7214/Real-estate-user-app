import { Image, Text, View } from 'react-native';

/**
 * TestimonialCardPG
 *
 * Props:
 *  - name      (string)  – reviewer name
 *  - subtitle  (string)  – e.g. "PG resident for 2 years"
 *  - comment   (string)  – review text
 *  - image     (string)  – avatar URI
 */
const TestimonialCardPG = ({ name, subtitle, comment, image }) => {
  return (
    <View
      className="bg-white rounded-2xl"
      style={{
        width: 320,
        height: 257.83,
        borderWidth: 0.667,
        borderColor: '#E4E7EC',
        borderRadius: 16,
        paddingHorizontal: 20.67,
        paddingTop: 20.67,
        paddingBottom: 0.67,
      }}
    >
      {/* User Info Row */}
      <View className="flex-row items-center" style={{ gap: 12 }}>
        <Image
          source={{ uri: image }}
          className="rounded-xl"
          style={{ width: 64, height: 64, borderRadius: 12 }}
        />
        <View style={{ gap: 4 }}>
          <Text
            className="text-[16px] leading-[24px] text-[#101828]"
            style={{ fontWeight: '600' }}
            numberOfLines={1}
          >
            {name}
          </Text>
          <Text
            className="text-[13px] leading-[16px] text-[#9CA3AF]"
            style={{ fontWeight: '400' }}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        </View>
      </View>

      {/* Testimonial Text */}
      <Text
        className="text-[14px] leading-[23px] text-[#4A5565] mt-4"
        style={{ fontWeight: '400' }}
        numberOfLines={7}
      >
        {comment}
      </Text>
    </View>
  );
};

export default TestimonialCardPG;
