import { ChevronRight } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const CalculatorCard = ({ titlePrefix, description, vectorsConfig = [], onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.95}
      style={{
        width: wp('49.6%'),
        height: hp('29.5%'),
        backgroundColor: '#FFFFFF',
        borderWidth: 0.8,
        borderColor: '#D4A574',
        borderRadius: wp('4.8%'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: hp('0.7%') },
        shadowOpacity: 0.08,
        shadowRadius: wp('3.2%'),
        elevation: 3,
        marginRight: wp('3.2%'),
        padding: wp('4.3%'),
        paddingBottom: hp('2.5%'),
        overflow: 'visible'
      }}
    >
      <View style={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
        <Text style={{ fontFamily: 'Inter-Bold', fontSize: wp('4.3%'), color: '#8B6F47', lineHeight: hp('2.5%') }}>{titlePrefix}</Text>
        <Text style={{ fontFamily: 'Inter-Bold', fontSize: wp('3.7%'), color: '#8B6F47', marginTop: hp('0.2%') }}>Calculator</Text>
      </View>

      <Text numberOfLines={2} style={{ fontFamily: 'Inter-Regular', fontSize: wp('3.2%'), color: '#6A7282', marginTop: hp('1.5%'), minHeight: hp('4.2%') }}>
        {description}
      </Text>

      <View style={{ height: hp('10.6%'), marginTop: hp('1%'), position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
        {/* Oval background */}
        <View
          style={{
            position: 'absolute',
            width: wp('40%'),
            height: hp('7.9%'),
            borderRadius: wp('10.7%'),
            backgroundColor: '#FCEFE2',
            bottom: hp('0.2%'),
            alignSelf: 'center'
          }}
        />
          {vectorsConfig.map((v, i) => {
          const left = v.left !== undefined ? (typeof v.left === 'number' ? `${v.left}%` : v.left) : undefined;
          const top = v.top !== undefined ? (typeof v.top === 'number' ? `${v.top}%` : v.top) : undefined;
          const right = v.right !== undefined ? (typeof v.right === 'number' ? `${v.right}%` : v.right) : undefined;
          const bottom = v.bottom !== undefined ? (typeof v.bottom === 'number' ? `${v.bottom}%` : v.bottom) : undefined;

          return (
            <View
              key={i}
              style={{
                position: 'absolute',
                left,
                top,
                right,
                bottom,
                backgroundColor: v.background || 'transparent',
                borderWidth: v.borderWidth || 0,
                borderColor: v.borderColor || 'transparent',
                borderRadius: v.rounded ? wp('2.1%') : 0,
                width: v.width || undefined,
                height: v.height || undefined,
              }}
            />
          );
        })}
      </View>
      <View style={{ position: 'absolute', right: wp('3.2%'), bottom: hp('1.5%') }}>
        <View
          style={{
            width: wp('10.7%'),
            height: wp('10.7%'),
            borderRadius: wp('5.3%'),
            backgroundColor: '#D4A574',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: hp('0.4%') },
            shadowOpacity: 0.1,
            shadowRadius: wp('1.6%'),
            elevation: 3
          }}
        >
          <ChevronRight size={wp('4.3%')} color="#FFFFFF" strokeWidth={1.5} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CalculatorCard;
