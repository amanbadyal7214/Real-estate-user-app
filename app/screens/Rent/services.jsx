import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useNavigation } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ServicesArticleCard from '../../../components/ServicesArticleCard';
import ServicesBenefitItem from '../../../components/ServicesBenefitItem';
import ServicesCalculatorCard from '../../../components/ServicesCalculatorCard';

const Services = () => {
    const [expandedFaq, setExpandedFaq] = useState(0);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(-200)).current;
    const navigation = useNavigation();

    useEffect(() => {
        const resetAndStartAnimation = () => {
            fadeAnim.setValue(0);
            translateY.setValue(-150);

            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                })
            ]).start();
        };

        // Run on initial mount
        resetAndStartAnimation();

        // Run every time the screen is focused
        const unsubscribe = navigation.addListener('focus', resetAndStartAnimation);

        return unsubscribe;
    }, [navigation, fadeAnim, translateY]);

    const calculators = [
        {
            id: 1,
            title: 'EMI Calculator',
            subtitle: 'EMI starts at ₹10.60K',
            icon: 'calculator',
            color: '#FFA726',
            image: 'https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&q=80&w=300'
        },
        {
            id: 2,
            title: 'Affordability Calculator',
            subtitle: 'Find the best budget for your home',
            icon: 'home-analytics',
            color: '#8B5E3C',
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=300'
        },
        {
            id: 3,
            title: 'Eligibility Calculator',
            subtitle: 'Find out your home loan eligibility limit',
            icon: 'account-check',
            color: '#7C3AED',
            image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=300'
        }
    ];

    const benefits = [
        {
            id: 1,
            text: 'Best-in-class products and services',
            icon: 'star-outline',
            color: '#8B5CF6'
        },
        {
            id: 2,
            text: 'The most rewarding way to get anything done',
            icon: 'gift-outline',
            color: '#EC4899'
        },
        {
            id: 3,
            text: 'Hassle free experience and great customer support',
            icon: 'headset',
            color: '#10B981'
        }
    ];

    const testimonials = [
        {
            id: 1,
            name: 'Priya Sharma',
            location: 'Mumbai',
            rating: '4.8',
            comment: 'Housing Edge made my home buying experience smooth and rewarding. Highly recommended!',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
        },
        {
            id: 2,
            name: 'Rajesh Kumar',
            location: 'Delhi',
            rating: '4.9',
            comment: 'Best platform for finding properties. The premium services are top-notch and saved me a lot of time.',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'
        }
    ];

    const articles = [
        {
            id: 1,
            title: 'All you need to know about rent agreements',
            date: 'Feb 2025',
            excerpt: 'Know the process to draft and register rent agreements online with ease.',
            image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=400'
        },
        {
            id: 2,
            title: 'To-dos before moving to a new apartment',
            date: 'Jan 2025',
            excerpt: 'We look at the simple steps that anyone can take to ensure a smooth shifting process.',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400'
        }
    ];

    const faqs = [
        {
            id: 0,
            question: 'What is HousingMania Premium?',
            answer: 'HousingMania Premium is an exclusive service that provides verified listings, relationship managers, and priority support for your property search.'
        },
        {
            id: 1,
            question: 'What can be your expectation as a Home Seeker?',
            answer: 'As a home seeker, you can expect end-to-end assistance, from finding the right property to legal documentation and home loans.'
        },
        {
            id: 2,
            question: 'What is the plan validity?',
            answer: 'Plan validity depends on the package selected, typically ranging from 30 days to 90 days.'
        }
    ];

    return (
        <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <LinearGradient
                colors={['#008E96', '#1CB2A9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ height: hp('24%'), borderBottomLeftRadius: wp('6.4%'), borderBottomRightRadius: wp('6.4%') }}
                className="overflow-hidden"
            >
                {/* Back Button */}
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="absolute justify-center items-center"
                    style={{ left: wp('4.3%'), top: hp('6%'), width: wp('10.6%'), height: wp('10.6%') }}
                >
                    <Ionicons name="arrow-back" size={wp('6.4%')} color="white" />
                </TouchableOpacity>

                {/* Text Container */}
                <View className="absolute gap-1" style={{ left: wp('4.3%'), top: hp('14.8%') }}>
                    <Text className="text-white font-medium tracking-[0.7px]" style={{ fontSize: wp('3.7%'), lineHeight: wp('5.6%') }}>HOUSING</Text>
                    <Text className="text-white font-bold" style={{ fontSize: wp('6%'), lineHeight: wp('6%'), letterSpacing: -1 }}>EDGE</Text>
                </View>

                {/* Abstract Illustration – Buildings */}
                <View className="absolute top-0 opacity-20" style={{ right: -wp('2.3%'), width: wp('45.3%'), height: wp('45.3%') }}>

                    {/* Building 3 – Small (leftmost) */}
                    <View className="absolute bg-white rounded-sm opacity-[0.15]" style={{ left: '37.5%', right: '52.5%', top: '60%', bottom: '10%' }} />

                    {/* Building 2 – Medium */}
                    <View className="absolute bg-white rounded-sm opacity-20" style={{ left: '50%', right: '32.5%', top: '50%', bottom: '10%' }} />
                    <View className="absolute bg-white opacity-40" style={{ left: '52.5%', right: '44.5%', top: '55%', bottom: '42%' }} />
                    <View className="absolute bg-white opacity-40" style={{ left: '57.5%', right: '39.5%', top: '55%', bottom: '42%' }} />
                    <View className="absolute bg-white opacity-40" style={{ left: '62.5%', right: '34.5%', top: '55%', bottom: '42%' }} />

                    {/* Building 1 – Tallest (rightmost) */}
                    <View className="absolute bg-white rounded-sm opacity-30" style={{ left: '70%', right: '10%', top: '40%', bottom: '10%' }} />

                    {/* Building 1 – Windows Row 1 */}
                    <View className="absolute bg-white opacity-50" style={{ left: '72.5%', right: '23.5%', top: '44%', bottom: '52%' }} />
                    <View className="absolute bg-white opacity-50" style={{ left: '78.5%', right: '17.5%', top: '44%', bottom: '52%' }} />
                    <View className="absolute bg-white opacity-50" style={{ left: '84.5%', right: '11.5%', top: '44%', bottom: '52%' }} />

                    {/* Building 1 – Windows Row 2 */}
                    <View className="absolute bg-white opacity-50" style={{ left: '72.5%', right: '23.5%', top: '52.5%', bottom: '43.5%' }} />
                    <View className="absolute bg-white opacity-50" style={{ left: '78.5%', right: '17.5%', top: '52.5%', bottom: '43.5%' }} />
                    <View className="absolute bg-white opacity-50" style={{ left: '84.5%', right: '11.5%', top: '52.5%', bottom: '43.5%' }} />
                </View>
            </LinearGradient>

            <Animated.View
                className="flex-1"
                style={[
                    {
                        marginTop: -wp('4.5%'),
                        opacity: fadeAnim,
                        transform: [{ translateY: translateY }]
                    }
                ]}
            >
                <ScrollView
                    className="flex-1"
                    style={{ marginTop: wp('5.2%') }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: hp('7.4%') }}
                >
                    {/* All Services Section */}
                    <View className="gap-4" style={{ paddingHorizontal: wp('4.3%'), paddingTop: hp('3%') }}>
                        {/* Heading */}
                        <Text className="font-semibold text-[#101828]" style={{ fontSize: wp('4%'), lineHeight: wp('5.8%') }}>All Services (1)</Text>

                        {/* Service Cards Row */}
                        <View className="flex-row items-start" style={{ gap: wp('6.4%') }}>
                            {/* ServiceCard – Home Loans */}
                            <TouchableOpacity
                                onPress={() => router.push('/screens/ComingSoon')}
                                className="items-center"
                                style={{ width: wp('22%'), gap: wp('2.5%') }}
                            >
                                <View className="bg-[#EEF2FF] rounded-2xl justify-center items-center" style={{ width: wp('22%'), height: wp('22%') }}>
                                    <MaterialCommunityIcons name="home-city-outline" size={wp('8%')} color="#6366F1" />
                                </View>
                                <Text className="font-medium text-[#101828] text-center" style={{ fontSize: wp('3.2%'), lineHeight: wp('4.2%') }}>Home Loans</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Calculators Section */}
                    <View className="gap-4" style={{ paddingHorizontal: wp('4.3%'), marginTop: hp('3.9%') }}>
                        <Text className="font-semibold text-[#101828]" style={{ fontSize: wp('4%'), lineHeight: wp('5.8%') }}>Home Loan Calculators</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingRight: wp('2.1%') }}
                        >
                            {calculators.map((calc) => (
                                <ServicesCalculatorCard
                                    key={calc.id}
                                    title={calc.title}
                                    subtitle={calc.subtitle}
                                    iconColor={calc.color}
                                    image={calc.image}
                                    onPress={() => {
                                        if (calc.id === 1) router.push('/screens/EMICalculator');
                                        else if (calc.id === 2) router.push('/screens/AffordabilityCalculator');
                                        else if (calc.id === 3) router.push('/screens/ECalculator');
                                    }}
                                />
                            ))}
                        </ScrollView>
                    </View>

                    {/* Benefits Section */}
                    <View style={{ marginTop: hp('3%'), paddingHorizontal: wp('3%') }}>
                        {/* Header */}
                        <View className="gap-1" style={{ marginBottom: hp('2%') }}>
                            <Text className="font-medium tracking-[0.65px]" style={{ color: '#EC4899', fontSize: wp('3.5%') }}>BENEFITS</Text>
                            <Text className="font-semibold text-[#101828]" style={{ fontSize: wp('3.6%'), lineHeight: wp('5%') }}>Why to choose Housing Edge</Text>
                        </View>

                        {/* Divider */}
                        <View className="items-center" style={{ marginBottom: hp('2%') }}>
                            <View style={{ width: wp('10.6%'), height: 2, backgroundColor: '#E4E7EC', borderRadius: 2 }} />
                        </View>

                        {/* Benefit Items */}
                        <View style={{ gap: hp('2%') }}>
                            {benefits.map((benefit, index) => (
                                <ServicesBenefitItem
                                    key={benefit.id}
                                    index={index}
                                    text={benefit.text}
                                />
                            ))}
                        </View>
                    </View>

                    {/* Testimonials Section */}
                    {/* <View className="mt-8"> */}
                    {/* Header */}
                    {/* <View className="px-4 gap-1 mb-4">
                            <Text className="text-[13px] font-medium tracking-[0.65px]" style={{ color: '#EC4899' }}>TESTIMONIALS</Text>
                            <Text className="text-[22px] font-semibold text-[#101828] leading-[33px]">What our users say</Text>
                        </View> */}

                    {/* Divider */}
                    {/* <View className="items-center mb-4">
                            <View style={{ width: 40, height: 2, backgroundColor: '#E4E7EC', borderRadius: 2 }} />
                        </View> */}

                    {/* Cards */}
                    {/* <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
                        >
                            {testimonials.map((item) => (
                                <ServicesTestimonialCard
                                    key={item.id}
                                    name={item.name}
                                    location={item.location}
                                    rating={item.rating}
                                    comment={item.comment}
                                    image={item.image}
                                />
                            ))}
                        </ScrollView> */}
                    {/* </View> */}

                    {/* Articles Section */}
                    <View style={{ marginTop: hp('3.9%') }}>
                        {/* Header */}
                        <View className="gap-1" style={{ paddingHorizontal: wp('4.3%'), marginBottom: hp('2%') }}>
                            <Text className="font-medium tracking-[0.65px]" style={{ color: '#EC4899', fontSize: wp('3.5%') }}>ARTICLES</Text>
                            <Text className="font-semibold text-[#101828]" style={{ fontSize: wp('5.9%'), lineHeight: wp('8.8%') }}>Read more about our services</Text>
                        </View>

                        {/* Divider */}
                        <View className="items-center" style={{ marginBottom: hp('2%') }}>
                            <View style={{ width: wp('10.6%'), height: 2, backgroundColor: '#E4E7EC', borderRadius: 2 }} />
                        </View>

                        {/* Cards */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingLeft: wp('4.3%'), paddingRight: wp('2.1%') }}
                        >
                            {articles.map((article) => (
                                <ServicesArticleCard
                                    key={article.id}
                                    title={article.title}
                                    date={article.date}
                                    excerpt={article.excerpt}
                                    image={article.image}
                                />
                            ))}
                        </ScrollView>
                    </View>

                    {/* FAQ Section */}
                    <View style={{ marginTop: hp('3.9%') }}>
                        {/* Header */}
                        <View className="gap-1" style={{ paddingHorizontal: wp('4.3%'), marginBottom: hp('2%') }}>
                            <Text className="font-medium tracking-[0.65px]" style={{ color: '#EC4899', fontSize: wp('3.5%') }}>SUPPORT</Text>
                            <Text className="font-semibold text-[#101828]" style={{ fontSize: wp('5.9%'), lineHeight: wp('8.8%') }}>Frequently asked questions</Text>
                        </View>

                        {/* Divider */}
                        <View className="items-center" style={{ marginBottom: hp('2%') }}>
                            <View style={{ width: wp('10.6%'), height: 2, backgroundColor: '#E4E7EC', borderRadius: 2 }} />
                        </View>

                        {/* Tab Buttons */}
                        <View className="flex-row gap-2 mb-5" style={{ paddingHorizontal: wp('4.3%'), gap: wp('2.1%') }}>
                            <TouchableOpacity
                                className="justify-center items-center"
                                style={{ height: hp('7.1%'), paddingHorizontal: wp('4.3%'), borderRadius: wp('2.7%'), backgroundColor: '#F3F4F6' }}
                            >
                                <Text className="font-medium text-[#6A7282] text-center" style={{ fontSize: wp('3.7%'), lineHeight: wp('5.6%') }}>
                                    Questions{'\n'}about
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="justify-center items-center"
                                style={{ height: hp('7.1%'), paddingHorizontal: wp('4.3%'), borderRadius: wp('2.7%'), backgroundColor: 'rgba(0, 142, 150, 0.1)' }}
                            >
                                <Text className="font-medium text-center" style={{ fontSize: wp('3.7%'), lineHeight: wp('5.6%'), color: '#008E96' }}>
                                    Home{'\n'}Loans
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* FAQ Accordion */}
                        <View style={{ paddingHorizontal: wp('4.3%'), gap: hp('1.5%') }}>
                            {faqs.map((faq) => (
                                <TouchableOpacity
                                    key={faq.id}
                                    className="bg-white overflow-hidden"
                                    style={{
                                        borderWidth: 0.667,
                                        borderColor: expandedFaq === faq.id ? '#008E96' : '#E4E7EC',
                                        borderRadius: wp('3.2%'),
                                    }}
                                    onPress={() => setExpandedFaq(expandedFaq === faq.id ? -1 : faq.id)}
                                    activeOpacity={0.8}
                                >
                                    <View className="flex-row justify-between items-center" style={{ minHeight: hp('6.9%'), paddingHorizontal: wp('4.3%') }}>
                                        <Text
                                            className="font-medium text-[#101828] flex-1 mr-4"
                                            style={{ fontSize: wp('2.8%'), lineHeight: wp('4.2%') }}
                                        >
                                            {faq.question}
                                        </Text>
                                        <Ionicons
                                            name={expandedFaq === faq.id ? 'remove' : 'add'}
                                            size={wp('5.3%')}
                                            color="#6A7282"
                                        />
                                    </View>
                                    {expandedFaq === faq.id && (
                                        <Text
                                            className="font-normal text-[#4A5565]"
                                            style={{ fontSize: wp('3.7%'), lineHeight: wp('5.9%'), paddingHorizontal: wp('4.3%'), paddingBottom: hp('2%') }}
                                        >
                                            {faq.answer}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                </ScrollView>
            </Animated.View>
        </View >
    );
};

export default Services;
