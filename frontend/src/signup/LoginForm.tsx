import { useCallback, useMemo, useState } from "react"
import { Button, StyleSheet, Text, TextInput, View } from "react-native"

const BACKEND = "localhost:4242"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const onEmailChange = useCallback((text: string | undefined) => {
    if (text) {
      setEmail(text)
    }
  }, [])

  const onPasswordChange = useCallback((text: string | undefined) => {
    if (text) {
      setPassword(text)
    }
  }, [])

  const textInputStyle = useMemo(
    () => ({
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: "black",
      padding: 20,
      marginVertical: 10,
    }),
    []
  )

  return (
    <View
      style={useMemo(
        () => ({
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: "black",
          padding: 20,
        }),
        []
      )}
    >
      <Text>Log in</Text>

      <TextInput
        style={textInputStyle}
        textContentType="emailAddress"
        placeholder="Email"
        onChangeText={onEmailChange}
      />

      <TextInput
        style={textInputStyle}
        textContentType="password"
        placeholder="Password"
        onChangeText={onEmailChange}
      />

      <Button title="Log in" onPress={async () => {
            const response = await fetch(`${BACKEND}/login`, 
                                {  
                                    method: "POST",
                                    body: JSON.stringify({email, password})
                                });
        }} />
    </View>
  )
}
