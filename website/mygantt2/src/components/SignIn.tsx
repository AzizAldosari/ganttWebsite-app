import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import {useNavigate} from 'react-router';
import {app} from '../firebaseConfig';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';

interface Props {
  onSignIn: () => void;
}

const SignIn: React.FC<Props> = ({onSignIn}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const handleSignIn = async () => {
    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);
      onSignIn(); // Call onSignIn after successful sign in
      navigate('/create'); // Navigate to CreateGantt after successful sign in
    } catch (err) {
      setError('Please double check your email or password.');
    }
  };

  const handleSignUpNavigation = () => {
    navigate('/signup');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        textContentType="emailAddress"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        textContentType="password"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </Pressable>
      <Text style={styles.text}>Don't have an account?</Text>
      <Pressable onPress={handleSignUpNavigation}>
        <Text style={styles.link}>Sign Up</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Platform.select({web: 16, default: 8}),
  },
  title: {
    fontSize: Platform.select({web: 24, default: 18}),
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  text: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  error: {
    color: 'black',
    marginBottom: 8,
  },
});

export default SignIn;
