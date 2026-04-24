import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router'; // or '@react-navigation/native'
import { Animated, Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const Services = () => {
    const [expandedFaq, setExpandedFaq] = useState(0);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(-100)).current;
    useFocusEffect(
        useCallback(() => {
            // Reset animated values
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
            
            return () => {
                // Optional cleanup
            };
        }, [])
    );

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
            question: 'What is Propertize Premium?',
            answer: 'Propertize Premium is an exclusive service that provides verified listings, relationship managers, and priority support for your property search.'
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
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <LinearGradient
                colors={['#008E96', '#1CB2A9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroHeader}
            >
                <SafeAreaView edges={['top']}>
                        <View style={styles.headerContent}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>

                        <View style={styles.titleSection}>
                            <Text style={styles.housingText}>HOUSING</Text>
                            <Text style={styles.edgeText}>EDGE</Text>
                        </View>
                    </View>
                </SafeAreaView>

                {/* Abstract Illustration (Buildings as seen in image) */}
                <View style={styles.illustrationContainer}>
                    {/* Tallest Building */}
                    <View style={[styles.building, { height: 120, width: 60, bottom: 0, right: 30, opacity: 0.15 }]}>
                         <View style={styles.windowsRow}>
                            <View style={styles.window} /><View style={styles.window} /><View style={styles.window} />
                         </View>
                         <View style={styles.windowsRow}>
                            <View style={styles.window} /><View style={styles.window} /><View style={styles.window} />
                         </View>
                         <View style={styles.windowsRow}>
                            <View style={styles.window} /><View style={styles.window} /><View style={styles.window} />
                         </View>
                    </View>
                    {/* Medium Building */}
                    <View style={[styles.building, { height: 90, width: 50, bottom: 0, right: 100, opacity: 0.1 }]}>
                        <View style={styles.windowsRow}>
                            <View style={styles.window} /><View style={styles.window} /><View style={styles.window} />
                        </View>
                        <View style={styles.windowsRow}>
                            <View style={styles.window} /><View style={styles.window} /><View style={styles.window} />
                        </View>
                    </View>
                    {/* Small Building */}
                    <View style={[styles.building, { height: 60, width: 40, bottom: 0, right: 160, opacity: 0.05 }]} />
                </View>
            </LinearGradient>

            <Animated.View
                style={[
                    styles.contentWrapper,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: translateY }]
                    }
                ]}
            >
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                >
                    {/* All Services Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>All Services (1)</Text>
                        <View style={styles.servicesGrid}>
                            <TouchableOpacity style={styles.serviceCard}>
                                <View style={[styles.serviceIconContainer, { backgroundColor: '#EEF2FF' }]}>
                                    <MaterialCommunityIcons name="home-city-outline" size={32} color="#6366F1" />
                                </View>
                                <Text style={styles.serviceText}>Home Loans</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Calculators Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Home Loan Calculators</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
                        >
                            {calculators.map((calc) => (
                                <TouchableOpacity key={calc.id} style={styles.calculatorCard}>
                                    <View style={styles.calcHeader}>
                                        <View>
                                            <Text style={styles.calcTitle}>{calc.title}</Text>
                                            <Text style={styles.calcSubtitle}>{calc.subtitle}</Text>
                                        </View>
                                        <View style={[styles.calcButton, { backgroundColor: calc.color }]}>
                                            <Ionicons name="arrow-forward" size={18} color="white" />
                                        </View>
                                    </View>
                                    <Image source={{ uri: calc.image }} style={styles.calcImage} />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Benefits Section */}
                    <View style={styles.section}>
                        <View style={styles.benefitsHeader}>
                            <Text style={styles.benefitsLabel}>BENEFITS</Text>
                            <Text style={styles.benefitsTitle}>Why to choose Propertize Edge</Text>
                        </View>
                        <View style={styles.benefitsList}>
                            {benefits.map((benefit) => (
                                <View key={benefit.id} style={styles.benefitItem}>
                                    <View style={[styles.benefitIconContainer, { backgroundColor: benefit.color + '20' }]}>
                                        <MaterialCommunityIcons name={benefit.icon} size={28} color={benefit.color} />
                                    </View>
                                    <Text style={styles.benefitText}>{benefit.text}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Testimonials Section */}
                    <View style={styles.section}>
                        <View style={styles.benefitsHeader}>
                            <Text style={[styles.benefitsLabel, { color: '#EC4899' }]}>TESTIMONIALS</Text>
                            <Text style={styles.benefitsTitle}>What our users say</Text>
                        </View>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingLeft: 16, paddingRight: 8, paddingTop: 16 }}
                        >
                            {testimonials.map((item) => (
                                <View key={item.id} style={styles.testimonialCard}>
                                    <View style={styles.testimonialHeader}>
                                        <View style={styles.userInfo}>
                                            <Image source={{ uri: item.image }} style={styles.userAvatar} />
                                            <View>
                                                <Text style={styles.userName}>{item.name}</Text>
                                                <Text style={styles.userLoc}>{item.location}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.ratingBox}>
                                            <Ionicons name="star" size={14} color="#FFA726" />
                                            <Text style={styles.ratingText}>{item.rating}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.testimonialText}>"{item.comment}"</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Articles Section */}
                    <View style={styles.section}>
                        <View style={styles.benefitsHeader}>
                            <Text style={[styles.benefitsLabel, { color: '#EC4899' }]}>ARTICLES</Text>
                            <Text style={styles.benefitsTitle}>Read more about our services</Text>
                        </View>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingLeft: 16, paddingRight: 8, paddingTop: 16 }}
                        >
                            {articles.map((article) => (
                                <TouchableOpacity key={article.id} style={styles.articleCard}>
                                    <Image source={{ uri: article.image }} style={styles.articleImage} />
                                    <View style={styles.articleContent}>
                                        <Text style={styles.articleTitle} numberOfLines={2}>{article.title}</Text>
                                        <Text style={styles.articleDate}>{article.date}</Text>
                                        <Text style={styles.articleExcerpt} numberOfLines={2}>{article.excerpt}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* FAQ Section */}
                    <View style={styles.section}>
                        <View style={styles.benefitsHeader}>
                            <Text style={[styles.benefitsLabel, { color: '#EC4899' }]}>SUPPORT</Text>
                            <Text style={styles.benefitsTitle}>Frequently asked questions</Text>
                        </View>

                        <View style={styles.faqCategories}>
                            <TouchableOpacity style={styles.faqCategoryBtn}>
                                <Text style={styles.faqCategoryText}>Housing Propertize</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.faqCategoryBtn, styles.faqCategoryBtnActive]}>
                                <Text style={styles.faqCategoryTextActive}>Home Loans</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.faqContainer}>
                            {faqs.map((faq) => (
                                <TouchableOpacity
                                    key={faq.id}
                                    style={[styles.faqItem, expandedFaq === faq.id && styles.faqItemExpanded]}
                                    onPress={() => setExpandedFaq(expandedFaq === faq.id ? -1 : faq.id)}
                                >
                                    <View style={styles.faqHeader}>
                                        <Text style={styles.faqQuestion}>{faq.question}</Text>
                                        <Ionicons
                                            name={expandedFaq === faq.id ? "remove" : "add"}
                                            size={20}
                                            color="#6A7282"
                                        />
                                    </View>
                                    {expandedFaq === faq.id && (
                                        <Text style={styles.faqAnswer}>{faq.answer}</Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                </ScrollView>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    heroHeader: {
        height: 240,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        overflow: 'hidden',
    },
    headerContent: {
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    titleSection: {
        marginTop: 24,
    },
    housingText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        letterSpacing: 0.7,
    },
    edgeText: {
        color: '#FFFFFF',
        fontSize: 40,
        fontFamily: 'Inter-Bold',
        letterSpacing: -1,
        marginTop: 4,
    },
    illustrationContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        bottom: 0,
        right: 0,
    },
    building: {
        position: 'absolute',
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
        padding: 4,
        gap: 4,
    },
    windowsRow: {
        flexDirection: 'row',
        gap: 4,
        justifyContent: 'center',
    },
    window: {
        width: 6,
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        borderRadius: 1,
    },
    scrollView: {
        flex: 1,
    },
    contentWrapper: {
        flex: 1,
        marginTop: -20,
    },
    section: {
        marginTop: 32,
    },
    sectionTitle: {
        fontSize: 22,
        fontFamily: 'Inter-SemiBold',
        color: '#101828',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    servicesGrid: {
        paddingHorizontal: 16,
    },
    serviceCard: {
        width: 100,
        alignItems: 'center',
    },
    serviceIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    serviceText: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        color: '#101828',
        textAlign: 'center',
    },
    calculatorCard: {
        width: 250,
        height: 160,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E4E7EC',
        borderRadius: 16,
        marginRight: 16,
        padding: 16,
        justifyContent: 'space-between',
    },
    calcHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    calcTitle: {
        fontSize: 18,
        fontFamily: 'Inter-SemiBold',
        color: '#101828',
        width: 160,
    },
    calcSubtitle: {
        fontSize: 13,
        fontFamily: 'Inter-Medium',
        color: '#6A7282',
        marginTop: 4,
        width: 160,
    },
    calcButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    calcImage: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: 100,
        height: 100,
        borderBottomRightRadius: 16,
        opacity: 0.8,
    },
    benefitsHeader: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    benefitsLabel: {
        fontSize: 13,
        fontFamily: 'Inter-Medium',
        color: '#EC4899',
        letterSpacing: 0.65,
        marginBottom: 4,
    },
    benefitsTitle: {
        fontSize: 22,
        fontFamily: 'Inter-SemiBold',
        color: '#101828',
    },
    benefitsList: {
        paddingHorizontal: 16,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    benefitIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    benefitText: {
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        color: '#4A5565',
        flex: 1,
        lineHeight: 24,
    },
    testimonialCard: {
        width: 300,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E4E7EC',
        borderRadius: 16,
        padding: 16,
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    testimonialHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    userName: {
        fontSize: 15,
        fontFamily: 'Inter-SemiBold',
        color: '#101828',
    },
    userLoc: {
        fontSize: 13,
        fontFamily: 'Inter-Regular',
        color: '#6A7282',
    },
    ratingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 14,
        fontFamily: 'Inter-SemiBold',
        color: '#101828',
    },
    testimonialText: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        color: '#4A5565',
        lineHeight: 22,
    },
    articleCard: {
        width: 290,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E4E7EC',
        borderRadius: 16,
        marginRight: 16,
        overflow: 'hidden',
    },
    articleImage: {
        width: '100%',
        height: 140,
    },
    articleContent: {
        padding: 16,
    },
    articleTitle: {
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
        color: '#101828',
        lineHeight: 22,
    },
    articleDate: {
        fontSize: 12,
        fontFamily: 'Inter-Medium',
        color: '#6A7282',
        marginVertical: 6,
    },
    articleExcerpt: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        color: '#4A5565',
        lineHeight: 20,
    },
    faqCategories: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 12,
        marginBottom: 20,
    },
    faqCategoryBtn: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#F3F4F6',
    },
    faqCategoryBtnActive: {
        backgroundColor: 'rgba(0, 142, 150, 0.1)',
    },
    faqCategoryText: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        color: '#6A7282',
    },
    faqCategoryTextActive: {
        color: '#008E96',
        fontSize: 14,
        fontFamily: 'Inter-Medium',
    },
    faqContainer: {
        paddingHorizontal: 16,
    },
    faqItem: {
        borderWidth: 1,
        borderColor: '#E4E7EC',
        borderRadius: 12,
        marginBottom: 12,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
    },
    faqItemExpanded: {
        borderColor: '#008E96',
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    faqQuestion: {
        fontSize: 15,
        fontFamily: 'Inter-Medium',
        color: '#101828',
        flex: 1,
    },
    faqAnswer: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        color: '#4A5565',
        lineHeight: 22,
        paddingHorizontal: 16,
        paddingBottom: 16,
    }
});

export default Services;
