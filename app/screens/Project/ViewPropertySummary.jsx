import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import api from '../../api';

export default function ViewPropertySummary() {
    const router = useRouter();
    const { projectId, projectName } = useLocalSearchParams();

    const [loading, setLoading] = useState(true);
    const [summaries, setSummaries] = useState([]);
    const [expandedPtId, setExpandedPtId] = useState('');
    const [activeSubPtId, setActiveSubPtId] = useState('');
    const [lightboxImage, setLightboxImage] = useState(null);

    const fetchSummaries = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get(`/projects/${projectId}/summaries`);
            if (res.data?.success) {
                const summariesList = res.data.data || [];
                setSummaries(summariesList);

                if (summariesList.length > 0) {
                    const firstPt = summariesList[0].propertyType?._id || summariesList[0].propertyType;
                    setExpandedPtId(firstPt);

                    const firstSubPt = summariesList[0].subPropertyType?._id || summariesList[0].subPropertyType;
                    setActiveSubPtId(firstSubPt);
                }
            }
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Failed to load property summaries.');
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        fetchSummaries();
    }, [fetchSummaries]);

    const handleDeleteSummary = summaryId => {
        Alert.alert(
            'Delete Specifications Group',
            'Are you sure you want to permanently delete this property summary group?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            const res = await api.delete(`/projects/${projectId}/summaries/${summaryId}`);
                            if (res.data?.success) {
                                Alert.alert('Deleted', 'Summary group has been deleted successfully.');
                                fetchSummaries();
                            }
                        } catch (err) {
                            console.error(err);
                            Alert.alert('Error', 'Failed to delete summary group.');
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    const groupedByPropertyType = summaries.reduce((acc, curr) => {
        const ptId = curr.propertyType?._id || curr.propertyType;
        if (!ptId) return acc;
        if (!acc[ptId]) {
            acc[ptId] = {
                details: curr.propertyType,
                items: [],
            };
        }
        acc[ptId].items.push(curr);
        return acc;
    }, {});

    const activeSummaries = summaries.filter(
        s => (s.propertyType?._id || s.propertyType) === expandedPtId &&
            (s.subPropertyType?._id || s.subPropertyType) === activeSubPtId
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
            {/* Header bar */}
            <LinearGradient colors={['#006B73', '#008E96']} style={{ paddingHorizontal: wp('4%'), paddingTop: hp('5%'), paddingBottom: hp('2.8%'), borderBottomLeftRadius: wp('7%'), borderBottomRightRadius: wp('7%') }} className="shadow-sm">
                <View style={{ gap: wp('3%') }} className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()} style={{ padding: wp('1%') }}>
                        <Ionicons name="arrow-back" size={wp('6%')} color="white" />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: '700', fontSize: wp('4.8%'), lineHeight: wp('6%') }} className="text-white">
                            View Property Summary
                        </Text>
                        <Text style={{ fontWeight: '400', fontSize: wp('3.2%') }} className="text-white/85">
                            Project: {projectName || 'N/A'}
                        </Text>
                    </View>
                </View>
            </LinearGradient>

            {loading ? (
                <View style={{ paddingVertical: hp('8%') }} className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#008E96" />
                    <Text style={{ fontWeight: '500', marginTop: hp('1.8%'), fontSize: wp('3.5%') }} className="text-gray-500">
                        Loading summaries...
                    </Text>
                </View>
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ padding: wp('4%'), paddingBottom: hp('5%') }}
                    className="flex-1"
                >
                    {Object.keys(groupedByPropertyType).length === 0 ? (
                        <View style={{ paddingVertical: hp('8%'), paddingHorizontal: wp('8%') }} className="items-center justify-center">
                            <View style={{ width: wp('16%'), height: wp('16%'), marginBottom: hp('1.8%') }} className="rounded-full bg-[#E6F7F6] items-center justify-center">
                                <MaterialCommunityIcons name="home-city" size={wp('8%')} color="#008E96" />
                            </View>
                            <Text style={{ fontWeight: '700', fontSize: wp('4%') }} className="text-[#101828] text-center">
                                No summaries found
                            </Text>
                            <Text style={{ fontWeight: '400', fontSize: wp('3.2%'), marginTop: hp('0.8%') }} className="text-gray-500 text-center">
                                There are no property summaries added for this project yet.
                            </Text>
                        </View>
                    ) : (
                        Object.keys(groupedByPropertyType).map(ptId => {
                            const pt = groupedByPropertyType[ptId];
                            const isExpanded = expandedPtId === ptId;

                            const subPts = pt.items.reduce((acc, curr) => {
                                const subPt = curr.subPropertyType;
                                const subId = subPt?._id || subPt;
                                if (subId && !acc.some(s => s._id === subId)) {
                                    acc.push(subPt);
                                }
                                return acc;
                            }, []);

                            const ptTotalUnits = pt.items.reduce((sum, item) => {
                                const rowSum = item.summaries?.reduce((rSum, r) => rSum + (r.quantity || 0), 0) || 0;
                                return sum + rowSum;
                            }, 0);

                            return (
                                <View key={ptId} style={{ borderRadius: wp('3%'), marginBottom: hp('2.2%') }} className="bg-white border border-[#2B5A6B]/20 overflow-hidden shadow-sm">
                                    {/* Accordion header */}
                                    <TouchableOpacity
                                        onPress={() => {
                                            setExpandedPtId(isExpanded ? '' : ptId);
                                            if (subPts.length > 0) {
                                                setActiveSubPtId(subPts[0]._id || subPts[0]);
                                            }
                                        }}
                                        style={{ paddingHorizontal: wp('4%'), paddingVertical: hp('1.5%') }}
                                        className="bg-[#2B5A6B] flex-row justify-between items-center"
                                    >
                                        <View style={{ gap: wp('2%') }} className="flex-row items-center">
                                            <View style={{ width: wp('5%'), height: wp('5%') }} className="rounded-full bg-white/20 items-center justify-center">
                                                <Ionicons name="checkmark" size={wp('3%')} color="white" />
                                            </View>
                                            <Text style={{ fontWeight: '700', fontSize: wp('4%'), maxWidth: wp('50%') }} className="text-white" numberOfLines={1}>
                                                {pt.details?.label || pt.details?.name || 'Property Group'}
                                            </Text>
                                            <View style={{ paddingHorizontal: wp('2.5%'), paddingVertical: hp('0.3%'), marginLeft: wp('2%') }} className="bg-white/20 rounded-full">
                                                <Text style={{ fontWeight: '700', fontSize: wp('2.9%') }} className="text-white">
                                                    {ptTotalUnits} Units
                                                </Text>
                                            </View>
                                        </View>
                                        <Ionicons
                                            name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                            size={wp('4.5%')}
                                            color="white"
                                        />
                                    </TouchableOpacity>

                                    {isExpanded && (
                                        <View style={{ padding: wp('4%') }} className="bg-white">
                                            {/* Horizontal tabs */}
                                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingBottom: hp('1.2%'), marginBottom: hp('1.8%') }} className="flex-row">
                                                {subPts.map(subPt => {
                                                    const subId = subPt._id || subPt;
                                                    const isActive = activeSubPtId === subId;

                                                    const subTotalUnits = pt.items
                                                        .filter(s => (s.subPropertyType?._id || s.subPropertyType) === subId)
                                                        .reduce((sum, item) => {
                                                            const rowSum = item.summaries?.reduce((rSum, r) => rSum + (r.quantity || 0), 0) || 0;
                                                            return sum + rowSum;
                                                        }, 0);

                                                    return (
                                                        <TouchableOpacity
                                                            key={subId}
                                                            onPress={() => setActiveSubPtId(subId)}
                                                            style={{ paddingHorizontal: wp('3%'), paddingVertical: hp('0.7%'), borderRadius: wp('5%'), marginRight: wp('2%'), gap: wp('1.5%') }}
                                                            className={`border flex-row items-center ${isActive ? 'bg-[#3B6E80] border-[#3B6E80]' : 'bg-white border-gray-200'
                                                                }`}
                                                        >
                                                            <Text
                                                                style={{ fontFamily: isActive ? 'Inter-SemiBold' : 'Inter-Medium', fontSize: wp('3.5%') }}
                                                                className={`${isActive ? 'text-white' : 'text-[#3B6E80]'}`}
                                                            >
                                                                {subPt.label || subPt.name}
                                                            </Text>
                                                            <View style={{ paddingHorizontal: wp('1.5%'), paddingVertical: hp('0.25%'), borderRadius: wp('1.5%') }} className={`${isActive ? 'bg-white/20' : 'bg-gray-100'}`}>
                                                                <Text
                                                                    style={{ fontWeight: '700', fontSize: wp('2.7%') }}
                                                                    className={`${isActive ? 'text-white' : 'text-gray-600'}`}
                                                                >
                                                                    {subTotalUnits}
                                                                </Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    );
                                                })}
                                            </ScrollView>

                                            {/* Specification Items Table */}
                                            {activeSummaries.length === 0 ? (
                                                <View style={{ paddingVertical: hp('2.5%') }} className="items-center">
                                                    <Text style={{ fontWeight: '500', fontSize: wp('3.2%') }} className="text-gray-400">
                                                        Select a sub-category tab above to view specification rows.
                                                    </Text>
                                                </View>
                                            ) : (
                                                activeSummaries.map(summaryGroup => {
                                                    const totalQty = summaryGroup.summaries?.reduce((sum, r) => sum + (r.quantity || 0), 0) || 0;

                                                    return (
                                                        <View key={summaryGroup._id} style={{ marginBottom: hp('2.5%'), borderRadius: wp('3%') }} className="overflow-hidden border border-gray-200 bg-white shadow-sm">
                                                            {/* Table Header */}
                                                            <View style={{ paddingHorizontal: wp('3%'), paddingVertical: hp('1.2%') }} className="bg-[#1F3E4D] flex-row items-center">
                                                                <Text style={{ fontWeight: '700', fontSize: wp('2.9%'), width: wp('8%') }} className="text-white">S/N</Text>
                                                                <Text style={{ fontWeight: '700', fontSize: wp('2.9%') }} className="text-white flex-1">DETAILS</Text>
                                                                <Text style={{ fontWeight: '700', fontSize: wp('2.9%'), width: wp('17%') }} className="text-white">PRICE</Text>
                                                                <Text style={{ fontWeight: '700', fontSize: wp('2.9%'), width: wp('10%') }} className="text-white text-center">UNITS</Text>
                                                                <Text style={{ fontWeight: '700', fontSize: wp('2.9%'), width: wp('19%'), marginLeft: wp('2%') }} className="text-white text-center">ACTION</Text>
                                                            </View>

                                                            {/* Table Rows */}
                                                            {summaryGroup.summaries?.map((row, rIdx) => {
                                                                const structText = row.structure?.id
                                                                    ? `${row.structure.value} ${row.structure.id?.name || row.structure.id?.label || ''}`
                                                                    : null;

                                                                return (
                                                                    <View key={row._id || rIdx} style={{ paddingHorizontal: wp('3%'), paddingVertical: hp('1.2%') }} className="flex-row items-center border-b border-gray-100 bg-white">
                                                                        {/* S/N */}
                                                                        <Text style={{ fontWeight: '500', fontSize: wp('3.2%'), width: wp('8%') }} className="text-[#4B5563]">
                                                                            {rIdx + 1}
                                                                        </Text>

                                                                        {/* DETAILS */}
                                                                        <View style={{ paddingRight: wp('1%') }} className="flex-1">
                                                                            <Text style={{ fontWeight: '700', fontSize: wp('3.5%') }} className="text-[#101828]">
                                                                                {structText || row.propertyItem?.label || row.propertyItem?.name || 'Specification'}
                                                                            </Text>
                                                                            <Text style={{ fontWeight: '500', fontSize: wp('2.7%'), marginTop: hp('0.25%') }} className="text-gray-500">
                                                                                {row.propertyItem?.label || 'Item'} • {row.area} {row.areaUnit?.label || 'Sq.Ft'}
                                                                            </Text>

                                                                            {/* Photos */}
                                                                            {row.images && row.images.length > 0 && (
                                                                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: hp('0.7%') }} className="flex-row">
                                                                                    {row.images.map((img, iIdx) => (
                                                                                        <TouchableOpacity
                                                                                            key={iIdx}
                                                                                            onPress={() => setLightboxImage(img)}
                                                                                            style={{ width: wp('6%'), height: wp('6%'), borderRadius: wp('1%'), marginRight: wp('1%') }}
                                                                                            className="bg-gray-50 border border-gray-200 overflow-hidden"
                                                                                        >
                                                                                            <Image source={{ uri: img }} className="w-full h-full" resizeMode="cover" />
                                                                                        </TouchableOpacity>
                                                                                    ))}
                                                                                </ScrollView>
                                                                            )}
                                                                        </View>

                                                                        {/* PRICE */}
                                                                        <Text style={{ fontWeight: '700', fontSize: wp('2.9%'), width: wp('17%') }} className="text-[#101828]" numberOfLines={1}>
                                                                            {row.price ? `₹${row.price.toLocaleString('en-IN')}` : 'N/A'}
                                                                        </Text>

                                                                        {/* UNITS */}
                                                                        <Text style={{ fontWeight: '700', fontSize: wp('3.2%'), width: wp('10%') }} className="text-[#101828] text-center">
                                                                            {row.quantity}
                                                                        </Text>

                                                                        {/* ACTION */}
                                                                        <View style={{ width: wp('19%'), marginLeft: wp('2%'), gap: wp('1%') }} className="flex-row items-center justify-center">

                                                                            <TouchableOpacity onPress={() => {
                                                                                router.push({
                                                                                    pathname: '/screens/Project/PropertySummary',
                                                                                    params: { 
                                                                                        projectId: projectId, 
                                                                                        projectName: projectName, 
                                                                                        mode: 'edit', 
                                                                                        summaryGroup: JSON.stringify(summaryGroup) 
                                                                                    }
                                                                                });
                                                                            }} style={{ width: wp('5.5%'), height: wp('5.5%'), borderRadius: wp('1%') }} className="border border-blue-200 items-center justify-center bg-blue-50/30">
                                                                                <Ionicons name="pencil" size={wp('2.9%')} color="#3B82F6" />
                                                                            </TouchableOpacity>

                                                                        </View>
                                                                    </View>
                                                                );
                                                            })}

                                                            {/* Included Amenities (if any) */}
                                                            {summaryGroup.amenities && summaryGroup.amenities.length > 0 && (
                                                                <View style={{ paddingHorizontal: wp('3%'), paddingVertical: hp('1.2%') }} className="bg-gray-50 border-b border-gray-100 flex-row items-center flex-wrap">
                                                                    <Text style={{ fontWeight: '700', fontSize: wp('2.7%'), marginRight: wp('2%'), letterSpacing: 1.5 }} className="text-gray-500 uppercase">
                                                                        Amenities:
                                                                    </Text>
                                                                    <View style={{ gap: wp('1.5%') }} className="flex-row flex-wrap">
                                                                        {summaryGroup.amenities.map(am => (
                                                                            <View
                                                                                key={am._id || am}
                                                                                style={{ paddingHorizontal: wp('2%'), paddingVertical: hp('0.3%'), borderRadius: wp('1%') }}
                                                                                className="bg-white border border-gray-200 shadow-sm"
                                                                            >
                                                                                <Text style={{ fontWeight: '500', fontSize: wp('2.7%') }} className="text-gray-600">
                                                                                    {am.label || am.name || 'Amenity'}
                                                                                </Text>
                                                                            </View>
                                                                        ))}
                                                                    </View>
                                                                </View>
                                                            )}

                                                            {/* Grand Total Footer */}
                                                            <View style={{ paddingHorizontal: wp('4%'), paddingVertical: hp('1.2%') }} className="bg-[#4D98A4] flex-row justify-between items-center">
                                                                <Text style={{ fontWeight: '700', fontSize: wp('3.7%') }} className="text-white">
                                                                    Grand Total:
                                                                </Text>
                                                                <View style={{ gap: wp('4%') }} className="flex-row items-center">
                                                                    <Text style={{ fontWeight: '700', fontSize: wp('3.7%') }} className="text-white">
                                                                        {totalQty} Units
                                                                    </Text>
                                                                    <TouchableOpacity
                                                                        onPress={() => handleDeleteSummary(summaryGroup._id)}
                                                                        style={{ paddingHorizontal: wp('2%'), paddingVertical: hp('0.5%'), borderRadius: wp('1.5%') }}
                                                                        className="bg-red-500/20"
                                                                    >
                                                                        <Ionicons name="trash-outline" size={wp('3.7%')} color="#FFF" />
                                                                    </TouchableOpacity>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    );
                                                })
                                            )}
                                        </View>
                                    )}
                                </View>
                            );
                        })
                    )}
                </ScrollView>
            )}

            {/* Lightbox full screen viewer */}
            {lightboxImage && (
                <Modal
                    visible={!!lightboxImage}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setLightboxImage(null)}
                >
                    <View style={{ padding: wp('4%') }} className="flex-1 bg-black/90 justify-center items-center">
                        <TouchableOpacity
                            onPress={() => setLightboxImage(null)}
                            style={{ top: hp('5%'), right: wp('5%'), width: wp('10%'), height: wp('10%') }}
                            className="absolute rounded-full bg-white/20 items-center justify-center z-50"
                        >
                            <Ionicons name="close" size={wp('6%')} color="white" />
                        </TouchableOpacity>
                        <Image
                            source={{ uri: lightboxImage }}
                            style={{ width: wp('92%'), height: hp('70%') }}
                            resizeMode="contain"
                        />
                    </View>
                </Modal>
            )}
        </SafeAreaView>
    );
}
