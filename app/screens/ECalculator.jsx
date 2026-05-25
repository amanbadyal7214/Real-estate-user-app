import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ECalculator = () => {
  const router = useRouter();
  const [salary, setSalary] = useState(25000);
  const [tenure, setTenure] = useState(30);
  const [interestRate, setInterestRate] = useState(7.25);
  const [otherEmi, setOtherEmi] = useState(0);
  const [showEligibilityResult, setShowEligibilityResult] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState(null);

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
    setShowEligibilityResult(false);
  };

  const handleTenureChange = (value) => {
    setTenure(value);
    setShowEligibilityResult(false);
  };

  const handleInterestRateChange = (value) => {
    setInterestRate(value);
    setShowEligibilityResult(false);
  };

  const handleOtherEmiChange = (value) => {
    setOtherEmi(value);
    setShowEligibilityResult(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Top Bar */}
      <View className="flex-row items-center justify-between px-4 py-2">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="#101828" />
        </TouchableOpacity>
        
          <TouchableOpacity onPress={() => router.push('/ComingSoon')} className="flex-row items-center bg-[#008E96] px-4 py-2 rounded-xl">
          <Ionicons name="home-outline" size={16} color="white" />
          <Text style={{ fontFamily: 'Inter-Medium' }} className="text-white font-medium ml-2">Home Loans</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="px-4 gap-y-4">
          
          {/* Main Card */}
          <View className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <Text style={{ fontFamily: 'Inter-Bold' }} className="text-lg font-semibold text-[#101828] mb-6">
              Home Loan Eligibility Calculator
            </Text>

            <View className="gap-y-8">
              {/* Monthly Salary */}
              <View>
                <View className="flex-row justify-between items-center mb-4">
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-base text-[#101828]">Your Monthly Salary (INR)</Text>
                  <View className="bg-white border border-gray-200 px-3 py-2 rounded-lg min-w-[100px] items-center">
                    <Text style={{ fontFamily: 'Inter-Regular' }} className="text-base text-[#101828]">{formatCurrency(salary)}</Text>
                  </View>
                </View>
                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={0}
                  maximumValue={10000000}
                  step={5000}
                  value={salary}
                  onValueChange={handleSalaryChange}
                  minimumTrackTintColor="#008E96"
                  maximumTrackTintColor="#E5E7EB"
                  thumbTintColor="#008E96"
                />
                <View className="flex-row justify-between mt-1">
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-xs text-gray-500">₹0</Text>
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-xs text-gray-500">₹1 Cr</Text>
                </View>
              </View>

              {/* Tenure */}
              <View>
                <View className="flex-row justify-between items-center mb-4">
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-base text-[#101828]">Tenure (Years)</Text>
                  <View className="bg-white border border-gray-200 px-3 py-2 rounded-lg min-w-[50px] items-center">
                    <Text style={{ fontFamily: 'Inter-Regular' }} className="text-base text-[#101828]">{tenure}</Text>
                  </View>
                </View>
                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={2}
                  maximumValue={30}
                  step={1}
                  value={tenure}
                  onValueChange={handleTenureChange}
                  minimumTrackTintColor="#008E96"
                  maximumTrackTintColor="#E5E7EB"
                  thumbTintColor="#008E96"
                />
                <View className="flex-row justify-between mt-1">
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-xs text-gray-500">2 Years</Text>
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-xs text-gray-500">30 Years</Text>
                </View>
              </View>

              {/* Interest Rate */}
              <View>
                <View className="flex-row justify-between items-center mb-4">
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-base text-[#101828]">Interest Rates (%P.A.)</Text>
                  <View className="bg-white border border-gray-200 px-3 py-2 rounded-lg min-w-[60px] items-center">
                    <Text style={{ fontFamily: 'Inter-Regular' }} className="text-base text-[#101828]">{interestRate}</Text>
                  </View>
                </View>
                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={1}
                  maximumValue={30}
                  step={0.25}
                  value={interestRate}
                  onValueChange={handleInterestRateChange}
                  minimumTrackTintColor="#008E96"
                  maximumTrackTintColor="#E5E7EB"
                  thumbTintColor="#008E96"
                />
                <View className="flex-row justify-between mt-1">
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-xs text-gray-500">1%</Text>
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-xs text-gray-500">30%</Text>
                </View>
              </View>

              {/* Other EMIs */}
              <View>
                <View className="flex-row justify-between items-center mb-4">
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-base text-[#101828]">Other monthly EMI&apos;s (INR)</Text>
                  <View className="bg-white border border-gray-200 px-3 py-2 rounded-lg min-w-[60px] items-center">
                    <Text style={{ fontFamily: 'Inter-Regular' }} className="text-base text-[#101828]">{formatCurrency(otherEmi)}</Text>
                  </View>
                </View>
                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={0}
                  maximumValue={10000000}
                  step={1000}
                  value={otherEmi}
                  onValueChange={handleOtherEmiChange}
                  minimumTrackTintColor="#008E96"
                  maximumTrackTintColor="#E5E7EB"
                  thumbTintColor="#008E96"
                />
                <View className="flex-row justify-between mt-1">
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-xs text-gray-500">₹0</Text>
                  <Text style={{ fontFamily: 'Inter-Regular' }} className="text-xs text-gray-500">₹1 Cr</Text>
                </View>
              </View>

              {/* Calculate Button */}
              <TouchableOpacity
                onPress={calculateEligibility}
                className="bg-[#008E96] w-full py-4 rounded-2xl items-center mt-4"
              >
                <Text style={{ fontFamily: 'Inter-Bold' }} className="text-white text-lg font-semibold">Calculate Eligibility</Text>
              </TouchableOpacity>

              {showEligibilityResult && eligibilityResult && (
                <View className="mt-4 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#4A5565] text-sm">Eligible Loan Amount</Text>
                    <Text style={{ fontFamily: 'Inter-SemiBold' }} className="text-[#008E96] text-sm">
                      {formatCurrency(eligibilityResult.eligibleLoanAmount)}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between mb-2">
                    <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#4A5565] text-sm">Available EMI Capacity</Text>
                    <Text style={{ fontFamily: 'Inter-SemiBold' }} className="text-[#101828] text-sm">
                      {formatCurrency(eligibilityResult.availableEmiCapacity)}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between mb-2">
                    <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#4A5565] text-sm">Estimated Property Budget</Text>
                    <Text style={{ fontFamily: 'Inter-SemiBold' }} className="text-[#101828] text-sm">
                      {formatCurrency(eligibilityResult.estimatedPropertyCost)}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between mb-2">
                    <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#4A5565] text-sm">Estimated Down Payment</Text>
                    <Text style={{ fontFamily: 'Inter-SemiBold' }} className="text-[#101828] text-sm">
                      {formatCurrency(eligibilityResult.estimatedDownPayment)}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Text style={{ fontFamily: 'Inter-Regular' }} className="text-[#4A5565] text-sm">FOIR Used</Text>
                    <Text style={{ fontFamily: 'Inter-SemiBold' }} className="text-[#101828] text-sm">
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
            className="rounded-2xl p-6 relative overflow-hidden h-[200px] justify-center"
          >
            <View className="absolute right-[-40px] top-[-20px] opacity-20">
              <MaterialCommunityIcons name="home-city" size={200} color="white" />
            </View>
            
            <View className="z-10">
              <Text style={{ fontFamily: 'Inter-Bold' }} className="text-2xl font-bold text-white mb-2">Home Loans</Text>
              <Text style={{ fontFamily: 'Inter-Regular' }} className="text-white/90 text-sm mb-6 max-w-[200px]">
                One place to compare offers from all the best bank
              </Text>
              <TouchableOpacity className="bg-[#1CB2A9] self-start px-6 py-3 rounded-xl">
                <Text style={{ fontFamily: 'Inter-Medium' }} className="text-white font-semibold">Explore Home Loan</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Info Card */}
          <View className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <Text style={{ fontFamily: 'Inter-Bold' }} className="text-lg font-semibold text-[#101828] mb-3">
              What is Home Loan Eligibility?
            </Text>
            <Text style={{ fontFamily: 'Inter-Regular' }} className="text-sm text-[#4A5565] leading-relaxed">
              Home loan eligibility is defined as a set of criteria based on which a financial institution assesses the creditworthiness of a customer to understand their capacity of repaying the loan. It depends on various factors such as age, income, existing debts, and the property&apos;s value.
            </Text>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ECalculator;
