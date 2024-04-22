import React from 'react';
import {Pressable, Text, View, StyleSheet} from 'react-native';
import {useNavigate} from 'react-router';

interface HomeProps {
  signedIn: boolean;
}

const Home: React.FC<HomeProps> = ({signedIn}) => {
  const navigate = useNavigate();

  const handleCreateGanttChart = () => {
    if (signedIn) {
      navigate('/create');
    } else {
      navigate('/signin');
    }
  };

  const handleViewGanttChart = () => {
    if (signedIn) {
      navigate('/my-gantt-charts');
    } else {
      navigate('/signin');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to my project</Text>
      <Text style={styles.description}>cis408 project.</Text>
      <View style={styles.buttonsContainer}>
        <Pressable style={styles.button} onPress={handleCreateGanttChart}>
          <Text>create gantt chart</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={handleViewGanttChart}>
          <Text>view created gantt chart</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => navigate('/about')}>
          <Text>About</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => navigate('/')}>
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
