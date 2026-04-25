import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import UserHeader from '../../../components/UserHeader'

const Project = () => {
  return (
   <>
   <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
       <UserHeader />
      </View>
    </SafeAreaView>
   </>
  )
}

export default Project