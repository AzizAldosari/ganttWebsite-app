import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native';

interface AboutProps {
  signedIn: boolean;
}

type Props = StackScreenProps<ParamListBase, 'About'> & AboutProps;

const About: React.FC<Props> = ({ signedIn, navigation }) => {
  const handleCreateGanttChart = () => {
    if (signedIn) {
      navigation.navigate('CreateGantt');
    } else {
      navigation.navigate('SignIn');
    }
  };

  const handleViewGanttChart = () => {
    if (signedIn) {
      navigation.navigate('GanttList');
    } else {
      navigation.navigate('SignIn');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>About this app</Text>
      <Text style={styles.description}>
        This website is dedicated to helping you manage your projects with Gantt
        charts.
      </Text>
      <View style={styles.buttonsContainer}>
        <Pressable style={styles.button} onPress={handleCreateGanttChart}>
          <Text>create gantt chart</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={handleViewGanttChart}>
          <Text>view created gantt chart</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => navigation.navigate('About')}>
          <Text>About</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => navigation.navigate('Home')}>
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
    fontSize: 30,
    marginBottom: 16,
  },
  description: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    marginHorizontal: 8,
  },
});

export default About;
