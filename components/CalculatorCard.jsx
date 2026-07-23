import { ChevronRight } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const CalculatorCard = ({ titlePrefix, description, vectorsConfig = [], onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.95}
      style={{
        width: wp('35%'),
        height: hp('25%'),
        backgroundColor: '#FFFFFF',
        borderWidth: 0.68,
        borderColor: '#D4A574',
        borderRadius: wp('3.4%'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: hp('0.6%') },
        shadowOpacity: 0.07,
        shadowRadius: wp('2.7%'),
        elevation: 2,
        marginRight: wp('2.7%'),
        padding: wp('3.1%'),
        paddingBottom: hp('1.7%'),
        overflow: 'visible'
      }}
    >
      <View style={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
        <Text style={{ fontWeight: '700', fontSize: wp('3.1%'), color: '#8B6F47', lineHeight: hp('1.9%') }}>{titlePrefix}</Text>
        <Text style={{ fontWeight: '700', fontSize: wp('2.7%'), color: '#8B6F47', marginTop: hp('0.2%') }}>Calculator</Text>
      </View>

      <Text numberOfLines={2} style={{ fontWeight: '400', fontSize: wp('2.4%'), color: '#6A7282', marginTop: hp('1.0%'), minHeight: hp('3.5%') }}>
        {description}
      </Text>

      <View style={{ height: hp('10.6%'), marginTop: hp('1%'), position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
        {/* Oval background */}
        <View
          style={{
            position: 'absolute',
            width: wp('29%'),
            height: hp('5.8%'),
            borderRadius: wp('7.6%'),
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
      <View style={{ position: 'absolute', right: wp('2.7%'), bottom: hp('1.2%') }}>
        <View
          style={{
            width: wp('9%'),
            height: wp('9%'),
            borderRadius: wp('4.5%'),
            backgroundColor: '#D4A574',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: hp('0.3%') },
            shadowOpacity: 0.1,
            shadowRadius: wp('1.6%'),
            elevation: 3
          }}
        >
          <ChevronRight size={wp('3.1%')} color="#FFFFFF" strokeWidth={1.5} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CalculatorCard;
