import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

const ECalculator = () => {
  const router = useRouter();
  const [salary, setSalary] = useState(25000);
  const [tenure, setTenure] = useState(30);
  const [interestRate, setInterestRate] = useState(7.25);
  const [otherEmi, setOtherEmi] = useState(0);

  const [salaryInput, setSalaryInput] = useState('25000');
  const [tenureInput, setTenureInput] = useState('30');
  const [interestRateInput, setInterestRateInput] = useState('7.25');
  const [otherEmiInput, setOtherEmiInput] = useState('0');

  const [showEligibilityResult, setShowEligibilityResult] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [showInfo, setShowInfo] = useState(true);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value).replace('₹', '₹ ');
  };

  const getFoir = (monthlyIncome) => {
    if (monthlyIncome < 50000) return 0.5;
    if (monthlyIncome < 100000) return 0.55;
    return 0.6;
  };

  const calculateEligibility = () => {
    const monthlyIncome = Number(salary) || 0;
    const existingEmi = Number(otherEmi) || 0;
    const totalMonths = (Number(tenure) || 0) * 12;
    const monthlyRate = (Number(interestRate) || 0) / (12 * 100);

    if (monthlyIncome <= 0 || totalMonths <= 0) {
      setEligibilityResult({
        eligibleLoanAmount: 0,
        availableEmiCapacity: 0,
        estimatedPropertyCost: 0,
        estimatedDownPayment: 0,
        foir: 0,
      });
      setShowEligibilityResult(true);
      return;
    }

    const foir = getFoir(monthlyIncome);
    const availableEmiCapacity = Math.max((foir * monthlyIncome) - existingEmi, 0);

    let emiFactor = 0;
    if (monthlyRate === 0) {
      emiFactor = 1 / totalMonths;
    } else {
      const growth = (1 + monthlyRate) ** totalMonths;
      emiFactor = (monthlyRate * growth) / (growth - 1);
    }

    const eligibleLoanAmount = emiFactor > 0 ? (availableEmiCapacity / emiFactor) : 0;

    // Approximation with 80% LTV to give a practical property budget estimate.
    const estimatedPropertyCost = eligibleLoanAmount > 0 ? (eligibleLoanAmount / 0.8) : 0;
    const estimatedDownPayment = Math.max(estimatedPropertyCost - eligibleLoanAmount, 0);

    setEligibilityResult({
      eligibleLoanAmount: Math.max(eligibleLoanAmount, 0),
      availableEmiCapacity,
      estimatedPropertyCost: Math.max(estimatedPropertyCost, 0),
      estimatedDownPayment,
      foir,
    });
    setShowEligibilityResult(true);
  };

  const handleSalaryChange = (value) => {
    setSalary(value);
    setSalaryInput(value.toString());
    setShowEligibilityResult(false);
  };

  const handleSalaryText = (text) => {
    const cleanText = text.replace(/[^0-9]/g, '');
    setSalaryInput(cleanText);
    const val = parseInt(cleanText, 10) || 0;
    setSalary(val);
    setShowEligibilityResult(false);
  };

  const handleSalaryBlur = () => {
    let val = salary;
    if (val < 0) val = 0;
    if (val > 10000000) val = 10000000;
    setSalary(val);
    setSalaryInput(val.toString());
  };

  const handleTenureChange = (value) => {
    setTenure(value);
    setTenureInput(value.toString());
    setShowEligibilityResult(false);
  };

  const handleTenureText = (text) => {
    const cleanText = text.replace(/[^0-9]/g, '');
    setTenureInput(cleanText);
    const val = parseInt(cleanText, 10) || 0;
    setTenure(val);
    setShowEligibilityResult(false);
  };

  const handleTenureBlur = () => {
    let val = tenure;
    if (val < 2) val = 2;
    if (val > 30) val = 30;
    setTenure(val);
    setTenureInput(val.toString());
  };

  const handleInterestRateChange = (value) => {
    setInterestRate(value);
    setInterestRateInput(value.toString());
    setShowEligibilityResult(false);
  };

  const handleInterestRateText = (text) => {
    setInterestRateInput(text);
    const parsed = parseFloat(text);
    if (!isNaN(parsed)) {
      setInterestRate(parsed);
    } else {
      setInterestRate(0);
    }
    setShowEligibilityResult(false);
  };

  const handleInterestRateBlur = () => {
    let val = interestRate;
    if (val < 1) val = 1;
    if (val > 30) val = 30;
    setInterestRate(val);
    setInterestRateInput(val.toString());
  };

  const handleOtherEmiChange = (value) => {
    setOtherEmi(value);
    setOtherEmiInput(value.toString());
    setShowEligibilityResult(false);
  };

  const handleOtherEmiText = (text) => {
    const cleanText = text.replace(/[^0-9]/g, '');
    setOtherEmiInput(cleanText);
    const val = parseInt(cleanText, 10) || 0;
    setOtherEmi(val);
    setShowEligibilityResult(false);
  };

  const handleOtherEmiBlur = () => {
    let val = otherEmi;
    if (val < 0) val = 0;
    if (val > 10000000) val = 10000000;
    setOtherEmi(val);
    setOtherEmiInput(val.toString());
  };

  return (
    <View className="flex-1 bg-[#F9FAFB]">
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          {/* Top Bar */}
          <View className="flex-row items-center justify-between" style={{ paddingHorizontal: wp('4.3%'), paddingVertical: hp('1.5%'), height: hp('7.9%') }}>
            <TouchableOpacity onPress={() => router.back()} style={{ padding: wp('2.1%') }}>
              <Ionicons name="arrow-back" size={wp('6.4%')} color="#101828" />
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => router.push('/ComingSoon')}
              className="flex-row items-center bg-[#008E96]"
              style={{ paddingHorizontal: wp('4.3%'), paddingVertical: hp('1%'), borderRadius: wp('3.7%') }}
            >
              <Ionicons name="home-outline" size={wp('4.3%')} color="white" />
              <Text style={{ fontFamily: 'Inter-Medium', fontSize: wp('3.7%'), marginLeft: wp('2.1%') }} className="text-white font-medium">Home Loans</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            className="flex-1"
            style={{ paddingHorizontal: wp('4.3%') }}
            contentContainerStyle={{ paddingBottom: hp('4%') }}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ rowGap: hp('2%') }}>
              
              {/* Main Card */}
              <View className="bg-white shadow-sm border border-gray-100" style={{ borderRadius: wp('4.3%'), padding: wp('4.3%') }}>
                <Text style={{ fontFamily: 'Inter-Bold', fontSize: wp('4.8%'), marginBottom: hp('3%') }} className="font-semibold text-[#101828]">
                  Home Loan Eligibility Calculator
                </Text>

                <View style={{ rowGap: hp('3%') }}>
                  {/* Monthly Salary */}
                  <View>
                    <View className="flex-row justify-between items-center" style={{ marginBottom: hp('1.5%') }}>
                      <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('4.3%') }} className="text-[#101828]">Your Monthly Salary (INR)</Text>
                      <View className="bg-white border border-[#E5E7EB] flex-row items-center justify-end" style={{ borderRadius: wp('2.7%'), paddingHorizontal: wp('3.2%'), paddingVertical: hp('0.5%'), minWidth: wp('29.3%') }}>
                        <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('4.3%') }} className="text-[#101828] mr-1">₹</Text>
                        <TextInput
                          style={{ fontFamily: 'Inter-Regular', fontSize: wp('4.3%'), color: '#101828', padding: 0, textAlign: 'right', minWidth: wp('20%') }}
                          value={salaryInput}
                          onChangeText={handleSalaryText}
                          onBlur={handleSalaryBlur}
                          keyboardType="numeric"
                        />
                      </View>
                    </View>
                    <Slider
                      style={{ width: '100%', height: hp('4.9%') }}
                      minimumValue={0}
                      maximumValue={10000000}
                      step={5000}
                      value={salary}
                      onValueChange={handleSalaryChange}
                      minimumTrackTintColor="#008E96"
                      maximumTrackTintColor="#E5E7EB"
                      thumbTintColor="#008E96"
                    />
                    <View className="flex-row justify-between" style={{ marginTop: 0 }}>
                      <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('3.2%') }} className="text-gray-500">₹0</Text>
                      <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('3.2%') }} className="text-gray-500">₹1 Cr</Text>
                    </View>
                  </View>

                  {/* Tenure */}
                  <View>
                    <View className="flex-row justify-between items-center" style={{ marginBottom: hp('1.5%') }}>
                      <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('4.3%') }} className="text-[#101828]">Tenure (Years)</Text>
                      <View className="bg-white border border-[#E5E7EB] items-center justify-center" style={{ borderRadius: wp('2.7%'), paddingHorizontal: wp('3.2%'), paddingVertical: hp('0.5%'), minWidth: wp('12%') }}>
                        <TextInput
                          style={{ fontFamily: 'Inter-Regular', fontSize: wp('4.3%'), color: '#101828', padding: 0, textAlign: 'center' }}
                          value={tenureInput}
                          onChangeText={handleTenureText}
                          onBlur={handleTenureBlur}
                          keyboardType="numeric"
                        />
                      </View>
                    </View>
                    <Slider
                      style={{ width: '100%', height: hp('4.9%') }}
                      minimumValue={2}
                      maximumValue={30}
                      step={1}
                      value={tenure}
                      onValueChange={handleTenureChange}
                      minimumTrackTintColor="#008E96"
                      maximumTrackTintColor="#E5E7EB"
                      thumbTintColor="#008E96"
                    />
                    <View className="flex-row justify-between" style={{ marginTop: 0 }}>
                      <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('3.2%') }} className="text-gray-500">2 Years</Text>
                      <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('3.2%') }} className="text-gray-500">30 Years</Text>
                    </View>
                  </View>

                  {/* Interest Rate */}
                  <View>
                    <View className="flex-row justify-between items-center" style={{ marginBottom: hp('1.5%') }}>
                      <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('4.3%') }} className="text-[#101828]">Interest Rates (%P.A.)</Text>
                      <View className="bg-white border border-[#E5E7EB] flex-row items-center justify-center" style={{ borderRadius: wp('2.7%'), paddingHorizontal: wp('3.2%'), paddingVertical: hp('0.5%'), minWidth: wp('16%') }}>
                        <TextInput
                          style={{ fontFamily: 'Inter-Regular', fontSize: wp('4.3%'), color: '#101828', padding: 0, textAlign: 'center' }}
                          value={interestRateInput}
                          onChangeText={handleInterestRateText}
                          onBlur={handleInterestRateBlur}
                          keyboardType="numeric"
                        />
                        <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('4.3%'), color: '#101828', marginLeft: 1 }}>%</Text>
                      </View>
                    </View>
                    <Slider
                      style={{ width: '100%', height: hp('4.9%') }}
                      minimumValue={1}
                      maximumValue={30}
                      step={0.25}
                      value={interestRate}
                      onValueChange={handleInterestRateChange}
                      minimumTrackTintColor="#008E96"
                      maximumTrackTintColor="#E5E7EB"
                      thumbTintColor="#008E96"
                    />
                    <View className="flex-row justify-between" style={{ marginTop: 0 }}>
                      <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('3.2%') }} className="text-gray-500">1%</Text>
                      <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('3.2%') }} className="text-gray-500">30%</Text>
                    </View>
                  </View>

                  {/* Other EMIs */}
                  <View>
                    <View className="flex-row justify-between items-center" style={{ marginBottom: hp('1.5%') }}>
                      <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('4.3%') }} className="text-[#101828]">Other monthly EMI's (INR)</Text>
                      <View className="bg-white border border-[#E5E7EB] flex-row items-center justify-end" style={{ borderRadius: wp('2.7%'), paddingHorizontal: wp('3.2%'), paddingVertical: hp('0.5%'), minWidth: wp('29.3%') }}>
                        <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('4.3%') }} className="text-[#101828] mr-1">₹</Text>
                        <TextInput
                          style={{ fontFamily: 'Inter-Regular', fontSize: wp('4.3%'), color: '#101828', padding: 0, textAlign: 'right', minWidth: wp('20%') }}
                          value={otherEmiInput}
                          onChangeText={handleOtherEmiText}
                          onBlur={handleOtherEmiBlur}
                          keyboardType="numeric"
                        />
                      </View>
                    </View>
                    <Slider
                      style={{ width: '100%', height: hp('4.9%') }}
                      minimumValue={0}
                      maximumValue={10000000}
                      step={1000}
                      value={otherEmi}
                      onValueChange={handleOtherEmiChange}
                      minimumTrackTintColor="#008E96"
                      maximumTrackTintColor="#E5E7EB"
                      thumbTintColor="#008E96"
                    />
                    <View className="flex-row justify-between" style={{ marginTop: 0 }}>
                      <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('3.2%') }} className="text-gray-500">₹0</Text>
                      <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('3.2%') }} className="text-gray-500">₹1 Cr</Text>
                    </View>
                  </View>

                  {/* Calculate Button */}
                  <TouchableOpacity
                    onPress={calculateEligibility}
                    className="bg-[#008E96] w-full items-center justify-center"
                    style={{ height: hp('6.4%'), borderRadius: wp('3.7%'), marginTop: hp('1%') }}
                  >
                    <Text style={{ fontFamily: 'Inter-Bold', fontSize: wp('4.3%') }} className="text-white font-semibold">Calculate Eligibility</Text>
                  </TouchableOpacity>

                  {showEligibilityResult && eligibilityResult && (
                    <View style={{ marginTop: hp('2%'), borderRadius: wp('3.2%'), padding: wp('3.2%') }} className="border border-[#E5E7EB] bg-[#F9FAFB]">
                      <View className="flex-row items-center justify-between" style={{ marginBottom: hp('1%') }}>
                        <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('3.7%') }} className="text-[#4A5565]">Eligible Loan Amount</Text>
                        <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: wp('3.7%') }} className="text-[#008E96]">
                          {formatCurrency(eligibilityResult.eligibleLoanAmount)}
                        </Text>
                      </View>
                      <View className="flex-row items-center justify-between" style={{ marginBottom: hp('1%') }}>
                        <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('3.7%') }} className="text-[#4A5565]">Available EMI Capacity</Text>
                        <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: wp('3.7%') }} className="text-[#101828]">
                          {formatCurrency(eligibilityResult.availableEmiCapacity)}
                        </Text>
                      </View>
                      <View className="flex-row items-center justify-between" style={{ marginBottom: hp('1%') }}>
                        <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('3.7%') }} className="text-[#4A5565]">Estimated Property Budget</Text>
                        <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: wp('3.7%') }} className="text-[#101828]">
                          {formatCurrency(eligibilityResult.estimatedPropertyCost)}
                        </Text>
                      </View>
                      <View className="flex-row items-center justify-between" style={{ marginBottom: hp('1%') }}>
                        <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('3.7%') }} className="text-[#4A5565]">Estimated Down Payment</Text>
                        <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: wp('3.7%') }} className="text-[#101828]">
                          {formatCurrency(eligibilityResult.estimatedDownPayment)}
                        </Text>
                      </View>
                      <View className="flex-row items-center justify-between">
                        <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('3.7%') }} className="text-[#4A5565]">FOIR Used</Text>
                        <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: wp('3.7%') }} className="text-[#101828]">
                          {`${Math.round((eligibilityResult.foir || 0) * 100)}%`}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>

              {/* Promo Card */}
              <LinearGradient
                colors={['#008E96', '#1CB2A9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="relative overflow-hidden justify-center"
                style={{ borderRadius: wp('4.3%'), padding: wp('6.4%'), height: hp('24.6%') }}
              >
                <View className="absolute opacity-20" style={{ right: -wp('10.7%'), top: -hp('2.5%') }}>
                  <MaterialCommunityIcons name="home-city" size={wp('53.3%')} color="white" />
                </View>
                
                <View className="z-10">
                  <Text style={{ fontFamily: 'Inter-Bold', fontSize: wp('6.4%'), marginBottom: hp('1%') }} className="font-bold text-white">Home Loans</Text>
                  <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('3.7%'), lineHeight: wp('5.3%'), marginBottom: hp('3%'), maxWidth: wp('53.3%') }} className="text-white/90">
                    One place to compare offers from all the best bank
                  </Text>
                  <TouchableOpacity
                    className="bg-[#1CB2A9] self-start"
                    style={{ paddingHorizontal: wp('6.4%'), paddingVertical: hp('1.5%'), borderRadius: wp('3.7%') }}
                  >
                    <Text style={{ fontFamily: 'Inter-Medium', fontSize: wp('4.3%') }} className="text-white font-semibold">Explore Home Loan</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>

              {/* Info Card */}
              <View className="bg-white shadow-sm border border-gray-100" style={{ borderRadius: wp('4.3%'), padding: wp('4.3%') }}>
                <TouchableOpacity
                  onPress={() => setShowInfo(!showInfo)}
                  className="flex-row justify-between items-center"
                  style={{ marginBottom: showInfo ? hp('1.5%') : 0 }}
                >
                  <Text style={{ fontFamily: 'Inter-Bold', fontSize: wp('4.8%') }} className="font-semibold text-[#101828] flex-1">
                    What is Home Loan Eligibility?
                  </Text>
                  <Ionicons name={showInfo ? "chevron-up" : "chevron-down"} size={wp('5.3%')} color="#008E96" />
                </TouchableOpacity>
                
                {showInfo && (
                  <Text style={{ fontFamily: 'Inter-Regular', fontSize: wp('3.7%'), lineHeight: wp('5.9%') }} className="text-[#4A5565]">
                    Home loan eligibility is defined as a set of criteria based on which a financial institution assesses the creditworthiness of a customer to understand their capacity of repaying the loan. It depends on various factors such as age, income, existing debts, and the property&apos;s value.
                  </Text>
                )}
              </View>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default ECalculator;

