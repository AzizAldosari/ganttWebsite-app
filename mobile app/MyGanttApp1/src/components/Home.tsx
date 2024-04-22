import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native';

interface HomeProps extends StackScreenProps<ParamListBase, 'Home'> {
  signedIn: boolean;
}

const Home: React.FC<HomeProps> = (props) => {
  const { signedIn } = props;
  const handleCreateGanttChart = () => {
    if (signedIn) {
      props.navigation.navigate('CreateGantt');
    } else {
      props.navigation.navigate('SignIn');
    }
  };

  const handleViewGanttChart = () => {
    if (signedIn) {
      props.navigation.navigate('GanttList');
    } else {
      props.navigation.navigate('SignIn');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to my project</Text>
      <Text style={styles.description}>mobile app project.</Text>
      <View style={styles.buttonsContainer}>
        <Pressable style={styles.button} onPress={handleCreateGanttChart}>
          <Text>create gantt chart</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={handleViewGanttChart}>
          <Text>view created gantt chart</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => props.navigation.navigate('About')}>
          <Text>About</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => props.navigation.navigate('Home')}>
          <Text>Home</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  description: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    marginHorizontal: 8,
  },
});

export default Home;
