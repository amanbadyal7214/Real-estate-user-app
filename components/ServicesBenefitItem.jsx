import { Text, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

/* ─────────────────────────────────────────────
   Illustration: purple circle background + vectors
   ───────────────────────────────────────────── */

/** PremiumProductsIllustration – benefit 1 */
const PremiumProductsIllustration = () => (
    <View className="rounded-full overflow-hidden" style={{ width: wp('26.7%'), height: wp('26.7%'), backgroundColor: '#8B5CF6' }}>
        {/* bag body */}
        <View className="absolute bg-[#FBBF24]" style={{ left: '35%', right: '35%', top: '38%', bottom: '27%' }} />
        {/* bag top/handle frame */}
        <View className="absolute" style={{ left: '35%', right: '35%', top: '28%', bottom: '58%', borderWidth: 2, borderColor: '#F59E0B' }} />
        {/* left sparkle */}
        <View className="absolute bg-[#FCD34D]" style={{ left: '24%', right: '68%', top: '31%', bottom: '61%' }} />
        {/* right sparkle top */}
        <View className="absolute bg-[#FCD34D]" style={{ left: '69%', right: '25%', top: '37%', bottom: '57%' }} />
        {/* right sparkle bottom */}
        <View className="absolute bg-[#FCD34D]" style={{ left: '66%', right: '26%', top: '61%', bottom: '31%' }} />
        {/* left sparkle bottom */}
        <View className="absolute bg-[#FDE68A]" style={{ left: '23%', right: '73%', top: '65%', bottom: '31%' }} />
        {/* right sparkle top 2 */}
        <View className="absolute bg-[#FDE68A]" style={{ left: '73%', right: '23%', top: '30%', bottom: '64%' }} />
    </View>
);

/** RewardsIllustration – benefit 2 */
const RewardsIllustration = () => (
    <View className="rounded-full overflow-hidden" style={{ width: wp('26.7%'), height: wp('26.7%'), backgroundColor: '#8B5CF6' }}>
        {/* gift box body */}
        <View className="absolute bg-[#EC4899]" style={{ left: '30%', right: '30%', top: '45%', bottom: '25%' }} />
        {/* ribbon vertical */}
        <View className="absolute bg-[#DB2777]" style={{ left: '47%', right: '47%', top: '45%', bottom: '25%' }} />
        {/* gift lid */}
        <View className="absolute bg-[#F472B6]" style={{ left: '30%', right: '30%', top: '37%', bottom: '47%' }} />
        {/* bow bottom */}
        <View className="absolute bg-[#DB2777]" style={{ left: '47%', right: '47%', top: '30%', bottom: '55%' }} />
        {/* bow left */}
        <View className="absolute bg-[#F472B6]" style={{ left: '34%', right: '50%', top: '24%', bottom: '64%' }} />
        {/* bow right */}
        <View className="absolute bg-[#F472B6]" style={{ left: '50%', right: '34%', top: '24%', bottom: '64%' }} />
        {/* sparkles */}
        <View className="absolute bg-[#FCD34D]" style={{ left: '22%', right: '72%', top: '32%', bottom: '62%' }} />
        <View className="absolute bg-[#10B981]" style={{ left: '72%', right: '22%', top: '37%', bottom: '57%' }} />
        <View className="absolute bg-[#FCD34D]" style={{ left: '67.5%', right: '27.5%', top: '62.5%', bottom: '32.5%' }} />
        <View className="absolute bg-[#60A5FA]" style={{ left: '28%', right: '68%', top: '65%', bottom: '31%' }} />
        <View className="absolute bg-[#F87171]" style={{ left: '72%', right: '25%', top: '55%', bottom: '42%' }} />
    </View>
);

/** CustomerSupportIllustration – benefit 3 */
const CustomerSupportIllustration = () => (
    <View className="rounded-full overflow-hidden" style={{ width: wp('26.7%'), height: wp('26.7%'), backgroundColor: '#8B5CF6' }}>
        {/* face */}
        <View className="absolute bg-[#FBBF24]" style={{ left: '38%', right: '38%', top: '23%', bottom: '53%' }} />
        {/* torso */}
        <View className="absolute bg-[#10B981]" style={{ left: '38%', right: '38%', top: '47%', bottom: '25%' }} />
        {/* left ear/headphone */}
        <View className="absolute bg-[#1F2937]" style={{ left: '32%', right: '65%', top: '35%', bottom: '54%' }} />
        {/* right ear/headphone */}
        <View className="absolute bg-[#1F2937]" style={{ left: '65%', right: '32%', top: '35%', bottom: '54%' }} />
        {/* headband */}
        <View className="absolute" style={{ left: '32%', right: '32%', top: '25.5%', bottom: '67%', borderWidth: 3, borderColor: '#1F2937' }} />
        {/* mic left */}
        <View className="absolute bg-[#1F2937]" style={{ left: '42%', right: '54%', top: '32%', bottom: '64%' }} />
        {/* mic right */}
        <View className="absolute bg-[#1F2937]" style={{ left: '54%', right: '42%', top: '32%', bottom: '64%' }} />
        {/* mic connector */}
        <View className="absolute" style={{ left: '43%', right: '43%', top: '39%', bottom: '59.5%', borderWidth: 2, borderColor: '#1F2937' }} />
        {/* note left */}
        <Text className="absolute text-[#60A5FA]" style={{ left: '24%', top: '20%', fontSize: wp('2.7%'), lineHeight: wp('3.2%') }}>♪</Text>
        {/* note right */}
        <Text className="absolute text-[#60A5FA]" style={{ left: '72%', top: '22%', fontSize: wp('2.7%'), lineHeight: wp('3.2%') }}>♪</Text>
        {/* left sparkle */}
        <View className="absolute bg-[#FCD34D]" style={{ left: '25%', right: '69%', top: '57%', bottom: '37%' }} />
        {/* right sparkle */}
        <View className="absolute bg-[#F472B6]" style={{ left: '69%', right: '25%', top: '55%', bottom: '39%' }} />
    </View>
);

const illustrations = [
    PremiumProductsIllustration,
    RewardsIllustration,
    CustomerSupportIllustration,
];

/**
 * ServicesBenefitItem
 *
 * Props:
 *  - index  (0 | 1 | 2)  – selects the illustration
 *  - text   (string)      – benefit description
 */
const ServicesBenefitItem = ({ index = 0, text }) => {
    const Illustration = illustrations[index] || PremiumProductsIllustration;

    return (
        <View className="flex-row items-center self-stretch" style={{ paddingVertical: hp('1.5%'), gap: wp('5%') }}>
            {/* Illustration */}
            <View style={{ width: wp('22%'), height: wp('22%') }}>
                <Illustration />
            </View>

            {/* Text */}
            <Text
                className="font-inter-regular text-[#4A5565] flex-1"
                style={{ fontSize: wp('3.5%'), lineHeight: wp('5.5%') }}
            >
                {text}
            </Text>
        </View>
    );
};

export default ServicesBenefitItem;
