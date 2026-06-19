import { Image, Text, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const LastSearchedCard = ({ image, price, title, builder, location }) => {
  return (
    <View 
      className="bg-white"
      style={{
        marginRight: wp('3.2%'),
        paddingBottom: hp('1%'),
        marginBottom: hp('1%'),
        marginTop: hp('0.5%'),
        width: wp('44.8%'),
        borderRadius: wp('4.3%'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: hp('0.4%') },
        shadowOpacity: 0.08,
        shadowRadius: wp('1.1%'),
        elevation: 3,
      }}
    >
      <View style={{ width: '100%', height: hp('16.3%'), borderRadius: wp('5.3%'), overflow: 'hidden' }}>
        <Image 
          source={{ uri: image }} 
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      </View>
      
      <View style={{ paddingTop: hp('1.5%'), paddingLeft: wp('3.2%'), paddingRight: wp('3.2%'), flex: 1, justifyContent: 'flex-start' }}>
        <Text 
          className="font-inter-bold text-[#101828]" 
          style={{ fontSize: wp('3.7%'), lineHeight: hp('2.5%'), marginBottom: hp('0.5%') }}
          numberOfLines={1}
        >
          {price}
        </Text>
        
        <Text 
          className="font-inter-semibold text-[#101828]" 
          style={{ fontSize: wp('3.7%'), lineHeight: hp('2.5%'), marginBottom: hp('0.7%') }}
          numberOfLines={1}
        >
          {title}
        </Text>
        
        <Text 
          className="font-inter-regular text-[#6A7282]" 
          style={{ fontSize: wp('3.2%'), lineHeight: hp('2.2%'), marginBottom: hp('0.2%') }}
          numberOfLines={1}
        >
          {builder}
        </Text>
        
        <Text 
          className="font-inter-regular text-[#6A7282]" 
          style={{ fontSize: wp('3.2%'), lineHeight: hp('2.2%') }}
          numberOfLines={1}
        >
          {location}
        </Text>
      </View>
    </View>
  );
};

export default LastSearchedCard;
