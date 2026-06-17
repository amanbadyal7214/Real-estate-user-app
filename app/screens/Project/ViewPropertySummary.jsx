import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
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
        <SafeAreaView className="flex-1 bg-[#F9FAFB]">
            {/* Header bar */}
            <LinearGradient colors={['#006B73', '#008E96']} className="px-4 pt-10 pb-6 rounded-b-[28px] shadow-sm">
                <View className="flex-row items-center gap-3">
                    <TouchableOpacity onPress={() => router.back()} className="p-1">
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text style={{ fontFamily: 'Inter-Bold' }} className="text-white text-lg leading-snug">
                            View Property Summary
                        </Text>
                        <Text style={{ fontFamily: 'Inter-Regular' }} className="text-white/85 text-xs">
                            Project: {projectName || 'N/A'}
                        </Text>
                    </View>
                </View>
            </LinearGradient>

            {loading ? (
                <View className="flex-1 items-center justify-center py-20">
                    <ActivityIndicator size="large" color="#008E96" />
                    <Text style={{ fontFamily: 'Inter-Medium' }} className="mt-4 text-gray-500">
                        Loading summaries...
                    </Text>
                </View>
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
                    className="flex-1"
                >
                    {Object.keys(groupedByPropertyType).length === 0 ? (
                        <View className="items-center justify-center py-20 px-8">
                            <View className="w-16 h-16 rounded-full bg-[#E6F7F6] items-center justify-center mb-4">
                                <MaterialCommunityIcons name="home-city" size={32} color="#008E96" />
                            </View>
                            <Text style={{ fontFamily: 'Inter-Bold' }} className="text-[#101828] text-base text-center">
                                No summaries found
                            </Text>
                            <Text style={{ fontFamily: 'Inter-Regular' }} className="text-gray-500 text-xs text-center mt-2">
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
                                <View key={ptId} className="bg-white border border-[#2B5A6B]/20 rounded-xl overflow-hidden mb-5 shadow-sm">
                                    {/* Accordion header */}
                                    <TouchableOpacity
                                        onPress={() => {
                                            setExpandedPtId(isExpanded ? '' : ptId);
                                            if (subPts.length > 0) {
                                                setActiveSubPtId(subPts[0]._id || subPts[0]);
                                            }
                                        }}
                                        className="bg-[#2B5A6B] px-4 py-3 flex-row justify-between items-center"
                                    >
                                        <View className="flex-row items-center gap-2">
                                            <View className="w-5 h-5 rounded-full bg-white/20 items-center justify-center">
                                                <Ionicons name="checkmark" size={12} color="white" />
                                            </View>
                                            <Text style={{ fontFamily: 'Inter-Bold' }} className="text-white text-[15px] truncate max-w-[200px]">
                                                {pt.details?.label || pt.details?.name || 'Property Group'}
                                            </Text>
                                            <View className="bg-white/20 px-2.5 py-0.5 rounded-full ml-2">
                                                <Text style={{ fontFamily: 'Inter-Bold' }} className="text-white text-[11px]">
                                                    {ptTotalUnits} Units
                                                </Text>
                                            </View>
                                        </View>
                                        <Ionicons
                                            name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                            size={18}
                                            color="white"
                                        />
                                    </TouchableOpacity>

                                    {isExpanded && (
                                        <View className="p-4 bg-white">
                                            {/* Horizontal tabs */}
                                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row pb-3 mb-4">
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
                                                            className={`px-3 py-1.5 rounded-full border mr-2 flex-row items-center gap-1.5 ${isActive ? 'bg-[#3B6E80] border-[#3B6E80]' : 'bg-white border-gray-200'
                                                                }`}
                                                        >
                                                            <Text
                                                                style={{ fontFamily: isActive ? 'Inter-SemiBold' : 'Inter-Medium' }}
                                                                className={`text-[13px] ${isActive ? 'text-white' : 'text-[#3B6E80]'}`}
                                                            >
                                                                {subPt.label || subPt.name}
                                                            </Text>
                                                            <View className={`px-1.5 py-0.5 rounded-md ${isActive ? 'bg-white/20' : 'bg-gray-100'}`}>
                                                                <Text
                                                                    style={{ fontFamily: 'Inter-Bold' }}
                                                                    className={`text-[10px] ${isActive ? 'text-white' : 'text-gray-600'}`}
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
                                                <View className="py-6 items-center">
                                                    <Text style={{ fontFamily: 'Inter-Medium' }} className="text-gray-400 text-xs">
                                                        Select a sub-category tab above to view specification rows.
                                                    </Text>
                                                </View>
                                            ) : (
                                                activeSummaries.map(summaryGroup => {
                                                    const totalQty = summaryGroup.summaries?.reduce((sum, r) => sum + (r.quantity || 0), 0) || 0;

                                                    return (
                                                        <View key={summaryGroup._id} className="mb-6 rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                                                            {/* Table Header */}
                                                            <View className="bg-[#1F3E4D] px-3 py-2.5 flex-row items-center">
                                                                <Text style={{ fontFamily: 'Inter-Bold' }} className="text-white text-[11px] w-8">S/N</Text>
                                                                <Text style={{ fontFamily: 'Inter-Bold' }} className="text-white text-[11px] flex-1">DETAILS</Text>
                                                                <Text style={{ fontFamily: 'Inter-Bold' }} className="text-white text-[11px] w-[65px]">PRICE</Text>
                                                                <Text style={{ fontFamily: 'Inter-Bold' }} className="text-white text-[11px] w-[40px] text-center">UNITS</Text>
                                                                <Text style={{ fontFamily: 'Inter-Bold' }} className="text-white text-[11px] w-[75px] text-center ml-2">ACTION</Text>
                                                            </View>

                                                            {/* Table Rows */}
                                                            {summaryGroup.summaries?.map((row, rIdx) => {
                                                                const structText = row.structure?.id
                                                                    ? `${row.structure.value} ${row.structure.id?.name || row.structure.id?.label || ''}`
                                                                    : null;

                                                                return (
                                                                    <View key={row._id || rIdx} className="flex-row items-center border-b border-gray-100 px-3 py-3 bg-white">
                                                                        {/* S/N */}
                                                                        <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[#4B5563] text-[12px] w-8">
                                                                            {rIdx + 1}
                                                                        </Text>

                                                                        {/* DETAILS */}
                                                                        <View className="flex-1 pr-1">
                                                                            <Text style={{ fontFamily: 'Inter-Bold' }} className="text-[#101828] text-[13px]">
                                                                                {structText || row.propertyItem?.label || row.propertyItem?.name || 'Specification'}
                                                                            </Text>
                                                                            <Text style={{ fontFamily: 'Inter-Medium' }} className="text-gray-500 text-[10px] mt-0.5">
                                                                                {row.propertyItem?.label || 'Item'} • {row.area} {row.areaUnit?.label || 'Sq.Ft'}
                                                                            </Text>

                                                                            {/* Photos */}
                                                                            {row.images && row.images.length > 0 && (
                                                                                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mt-1.5">
                                                                                    {row.images.map((img, iIdx) => (
                                                                                        <TouchableOpacity
                                                                                            key={iIdx}
                                                                                            onPress={() => setLightboxImage(img)}
                                                                                            className="w-6 h-6 rounded bg-gray-50 border border-gray-200 overflow-hidden mr-1"
                                                                                        >
                                                                                            <Image source={{ uri: img }} className="w-full h-full" resizeMode="cover" />
                                                                                        </TouchableOpacity>
                                                                                    ))}
                                                                                </ScrollView>
                                                                            )}
                                                                        </View>

                                                                        {/* PRICE */}
                                                                        <Text style={{ fontFamily: 'Inter-Bold' }} className="text-[#101828] text-[11px] w-[65px]" numberOfLines={1}>
                                                                            {row.price ? `₹${row.price.toLocaleString('en-IN')}` : 'N/A'}
                                                                        </Text>

                                                                        {/* UNITS */}
                                                                        <Text style={{ fontFamily: 'Inter-Bold' }} className="text-[#101828] text-[12px] w-[40px] text-center">
                                                                            {row.quantity}
                                                                        </Text>

                                                                        {/* ACTION */}
                                                                        <View className="flex-row items-center justify-center gap-1 w-[75px] ml-2">

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
                                                                            }} className="w-[22px] h-[22px] rounded border border-blue-200 items-center justify-center bg-blue-50/30">
                                                                                <Ionicons name="pencil" size={11} color="#3B82F6" />
                                                                            </TouchableOpacity>

                                                                        </View>
                                                                    </View>
                                                                );
                                                            })}

                                                            {/* Included Amenities (if any) */}
                                                            {summaryGroup.amenities && summaryGroup.amenities.length > 0 && (
                                                                <View className="px-3 py-2.5 bg-gray-50 border-b border-gray-100 flex-row items-center flex-wrap">
                                                                    <Text style={{ fontFamily: 'Inter-Bold' }} className="text-[10px] text-gray-500 uppercase tracking-widest mr-2">
                                                                        Amenities:
                                                                    </Text>
                                                                    <View className="flex-row flex-wrap gap-1.5">
                                                                        {summaryGroup.amenities.map(am => (
                                                                            <View
                                                                                key={am._id || am}
                                                                                className="bg-white border border-gray-200 px-2 py-0.5 rounded shadow-sm"
                                                                            >
                                                                                <Text style={{ fontFamily: 'Inter-Medium' }} className="text-[10px] text-gray-600">
                                                                                    {am.label || am.name || 'Amenity'}
                                                                                </Text>
                                                                            </View>
                                                                        ))}
                                                                    </View>
                                                                </View>
                                                            )}

                                                            {/* Grand Total Footer */}
                                                            <View className="bg-[#4D98A4] px-4 py-3 flex-row justify-between items-center">
                                                                <Text style={{ fontFamily: 'Inter-Bold' }} className="text-white text-[14px]">
                                                                    Grand Total:
                                                                </Text>
                                                                <View className="flex-row items-center gap-4">
                                                                    <Text style={{ fontFamily: 'Inter-Bold' }} className="text-white text-[14px]">
                                                                        {totalQty} Units
                                                                    </Text>
                                                                    <TouchableOpacity
                                                                        onPress={() => handleDeleteSummary(summaryGroup._id)}
                                                                        className="bg-red-500/20 px-2 py-1 rounded-md"
                                                                    >
                                                                        <Ionicons name="trash-outline" size={14} color="#FFF" />
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
                    <View className="flex-1 bg-black/90 justify-center items-center p-4">
                        <TouchableOpacity
                            onPress={() => setLightboxImage(null)}
                            className="absolute top-10 right-5 w-10 h-10 rounded-full bg-white/20 items-center justify-center z-50"
                        >
                            <Ionicons name="close" size={24} color="white" />
                        </TouchableOpacity>
                        <Image
                            source={{ uri: lightboxImage }}
                            style={{ width: Dimensions.get('window').width - 32, height: Dimensions.get('window').height * 0.7 }}
                            resizeMode="contain"
                        />
                    </View>
                </Modal>
            )}
        </SafeAreaView>
    );
}
