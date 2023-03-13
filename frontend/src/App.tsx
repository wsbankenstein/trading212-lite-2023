import { StyleSheet, View } from "react-native"
import { SignupForm } from "./signup/SignupForm"

export default function App() {
  return (
    <View style={styles.container}>
      <SignupForm />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
})
