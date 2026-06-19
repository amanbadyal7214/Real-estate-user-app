import { Image, Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const NewsCard = ({ image, title, meta, description }) => {
  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      className="bg-white"
      style={{
        marginRight: wp('4.3%'),
        marginBottom: hp('1%'),
        marginTop: hp('0.5%'),
        width: wp('72.5%'),
        height: hp('29.5%'),
        borderRadius: wp('4.3%'),
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: hp('0.4%') },
        shadowOpacity: 0.08,
        shadowRadius: wp('1.1%'),
        elevation: 3,
        overflow: 'hidden'
      }}
    >
      <View style={{ width: '100%', height: hp('15.8%') }}>
        <Image 
          source={{ uri: image }} 
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      </View>
      
      <View style={{ paddingHorizontal: wp('3.7%'), paddingTop: hp('1%'), paddingBottom: hp('1.5%') }}>
        <Text 
          className="font-inter-bold text-[#101828]" 
          style={{ fontSize: wp('3.7%'), lineHeight: hp('2.2%'), marginBottom: hp('0.5%') }}
          numberOfLines={2}
        >
          {title}
        </Text>
        
        <Text 
          className="font-inter-regular text-[#6A7282]" 
          style={{ fontSize: wp('2.9%'), lineHeight: hp('2%'), marginBottom: hp('0.5%') }}
        >
          {meta}
        </Text>
        
        <Text 
          className="font-inter-regular text-[#4A5565]" 
          style={{ fontSize: wp('2.9%'), lineHeight: hp('2.2%') }}
          numberOfLines={2}
        >
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default NewsCard;
