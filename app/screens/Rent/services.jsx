import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useNavigation } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import ServicesArticleCard from '../../../components/ServicesArticleCard';
import ServicesBenefitItem from '../../../components/ServicesBenefitItem';
import ServicesCalculatorCard from '../../../components/ServicesCalculatorCard';

const { width } = Dimensions.get('window');

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
            question: 'What is The Property Wall Premium?',
            answer: 'The Property Wall Premium is an exclusive service that provides verified listings, relationship managers, and priority support for your property search.'
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
        <View className="flex-1 bg-white">
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <LinearGradient
                colors={['#008E96', '#1CB2A9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="h-[240px] rounded-b-[24px] overflow-hidden"
            >
                {/* Back Button */}
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="absolute left-4 top-12 w-10 h-10 justify-center items-center"
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>

                {/* Text Container */}
                <View className="absolute left-4 gap-1" style={{ top: 120 }}>
                    <Text className="text-white text-[14px] font-inter-medium tracking-[0.7px] leading-[21px]">HOUSING</Text>
                    <Text className="text-white text-[40px] font-inter-bold leading-[40px] -mt-1" style={{ letterSpacing: -1 }}>EDGE</Text>
                </View>

                {/* Abstract Illustration – Buildings */}
                <View className="absolute top-0 w-[200px] h-[200px] opacity-20" style={{ right: -10 }}>

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
                className="flex-1 mt-[-20px]"
                style={[
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: translateY }]
                    }
                ]}
            >
                <ScrollView
                    className="flex-1 mt-[23px]"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 60 }}
                >
                    {/* All Services Section */}
                    <View className="px-4 pt-6 gap-4">
                        {/* Heading */}
                        <Text className="text-[22px] font-inter-semibold text-[#101828] leading-[33px]">All Services (1)</Text>

                        {/* Service Cards Row */}
                        <View className="flex-row items-start gap-6">
                            {/* ServiceCard – Home Loans */}
                            <TouchableOpacity
                                onPress={() => router.push('/screens/ComingSoon')}
                                className="w-[100px] items-center gap-3"
                            >
                                <View className="w-[100px] h-[100px] bg-[#EEF2FF] rounded-2xl justify-center items-center">
                                    <MaterialCommunityIcons name="home-city-outline" size={40} color="#6366F1" />
                                </View>
                                <Text className="text-[14px] font-inter-medium text-[#101828] text-center leading-[18px]">Home Loans</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Calculators Section */}
                    <View className="px-4 gap-4 mt-8">
                        <Text className="text-[22px] font-inter-semibold text-[#101828] leading-[33px]">Home Loan Calculators</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingRight: 8 }}
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
                    {/* Benefits Section */}
                    <View className="mt-8 px-4">
                        {/* Header */}
                        <View className="gap-1 mb-4">
                            <Text className="text-[13px] font-inter-medium tracking-[0.65px]" style={{ color: '#EC4899' }}>BENEFITS</Text>
                            <Text className="text-[22px] font-inter-semibold text-[#101828] leading-[33px]">Why to choose Housing Edge</Text>
                        </View>

                        {/* Divider */}
                        <View className="items-center mb-4">
                            <View style={{ width: 40, height: 2, backgroundColor: '#E4E7EC', borderRadius: 2 }} />
                        </View>

                        {/* Benefit Items */}
                        <View className="gap-6">
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
                            <Text className="text-[13px] font-inter-medium tracking-[0.65px]" style={{ color: '#EC4899' }}>TESTIMONIALS</Text>
                            <Text className="text-[22px] font-inter-semibold text-[#101828] leading-[33px]">What our users say</Text>
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
                    <View className="mt-8">
                        {/* Header */}
                        <View className="px-4 gap-1 mb-4">
                            <Text className="text-[13px] font-inter-medium tracking-[0.65px]" style={{ color: '#EC4899' }}>ARTICLES</Text>
                            <Text className="text-[22px] font-inter-semibold text-[#101828] leading-[33px]">Read more about our services</Text>
                        </View>

                        {/* Divider */}
                        <View className="items-center mb-4">
                            <View style={{ width: 40, height: 2, backgroundColor: '#E4E7EC', borderRadius: 2 }} />
                        </View>

                        {/* Cards */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
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
                    <View className="mt-8">
                        {/* Header */}
                        <View className="px-4 gap-1 mb-4">
                            <Text className="text-[13px] font-inter-medium tracking-[0.65px]" style={{ color: '#EC4899' }}>SUPPORT</Text>
                            <Text className="text-[22px] font-inter-semibold text-[#101828] leading-[33px]">Frequently asked questions</Text>
                        </View>

                        {/* Divider */}
                        <View className="items-center mb-4">
                            <View style={{ width: 40, height: 2, backgroundColor: '#E4E7EC', borderRadius: 2 }} />
                        </View>

                        {/* Tab Buttons */}
                        <View className="flex-row px-4 gap-2 mb-5">
                            <TouchableOpacity
                                className="rounded-[10px] px-4 justify-center items-center"
                                style={{ height: 58, backgroundColor: '#F3F4F6' }}
                            >
                                <Text className="font-inter-medium text-[#6A7282] text-center" style={{ fontSize: 14, lineHeight: 21 }}>
                                    Questions{'\n'}about
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="rounded-[10px] px-4 justify-center items-center"
                                style={{ height: 58, backgroundColor: 'rgba(0, 142, 150, 0.1)' }}
                            >
                                <Text className="font-inter-medium text-center" style={{ fontSize: 14, lineHeight: 21, color: '#008E96' }}>
                                    Home{'\n'}Loans
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* FAQ Accordion */}
                        <View className="px-4 gap-3">
                            {faqs.map((faq) => (
                                <TouchableOpacity
                                    key={faq.id}
                                    className="bg-white rounded-xl overflow-hidden"
                                    style={{
                                        borderWidth: 0.667,
                                        borderColor: expandedFaq === faq.id ? '#008E96' : '#E4E7EC',
                                        borderRadius: 12,
                                    }}
                                    onPress={() => setExpandedFaq(expandedFaq === faq.id ? -1 : faq.id)}
                                    activeOpacity={0.8}
                                >
                                    <View className="flex-row justify-between items-center px-4" style={{ minHeight: 56 }}>
                                        <Text
                                            className="font-inter-medium text-[#101828] flex-1 mr-4"
                                            style={{ fontSize: 15, lineHeight: 22 }}
                                        >
                                            {faq.question}
                                        </Text>
                                        <Ionicons
                                            name={expandedFaq === faq.id ? 'remove' : 'add'}
                                            size={20}
                                            color="#6A7282"
                                        />
                                    </View>
                                    {expandedFaq === faq.id && (
                                        <Text
                                            className="font-inter-regular text-[#4A5565] px-4 pb-4"
                                            style={{ fontSize: 14, lineHeight: 22 }}
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
