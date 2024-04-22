import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CreateGantt from './components/CreateGantt';
import GanttChart from './components/GanttChart';
import GanttList from './components/GanttList';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ShareGantt from './components/ShareGantt';
import Home from './components/Home';
import { auth } from './firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import { firestore } from './firebaseConfig';
import About from './components/About';
import { ParamListBase } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
const Stack = createStackNavigator();

interface GanttChartWrapperProps {
  route: any;
  navigation: any;
}

const GanttChartWrapper: React.FC<GanttChartWrapperProps> = ({ route, navigation }) => {
  const { ganttChartId } = route.params;
  const [projectName, setProjectName] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (ganttChartId) {
      const ganttChartRef = doc(firestore, 'gantt_charts', ganttChartId);
      console.log('Fetching Gantt chart data...');

      const unsubscribe = onSnapshot(ganttChartRef, ganttChartSnapshot => {
        console.log('Fetched Gantt chart data successfully');
        const ganttChartData = ganttChartSnapshot.data();
        if (ganttChartData) {
          setProjectName(ganttChartData.projectName);
          setTasks(ganttChartData.tasks);
        }
        setLoading(false);
      }, error => {
        console.error('Error fetching Gantt chart data:', error);
      });

      // Unsubscribes from the snapshot listener when the component unmounts
      return unsubscribe;
    } else {
      setLoading(false);
    }
  }, [ganttChartId]);

  if (loading) {
    return <ActivityIndicator color="#0000ff" />;
  }

  return (
    <>
      <GanttChart
        projectName={projectName}
        tasks={tasks}
        ganttChartId={ganttChartId ?? null}
      />
      {ganttChartId && <ShareGantt ganttChartId={ganttChartId} />}
      <Pressable style={styles.homeButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Home</Text>
      </Pressable>
    </>
  );
};

const App: React.FC = () => {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      console.log('onAuthStateChanged: signedIn:', !!user);
      setSignedIn(!!user);
    });
    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home">
            {(props: StackScreenProps<ParamListBase, 'Home'>) => (
              <Home {...props} signedIn={signedIn} />
            )}
          </Stack.Screen>
          <Stack.Screen name="About">
            {(props: StackScreenProps<ParamListBase, 'About'>) => (
          <About {...props} signedIn={signedIn} />
        )}
      </Stack.Screen>
      <Stack.Screen name="SignIn" component={SignIn
} />
<Stack.Screen name="SignUp">
{(props: StackScreenProps<ParamListBase, 'SignUp'>) => (
<SignUp {...props} onSignUp={() => setSignedIn(false)} />
)}
</Stack.Screen>
<Stack.Screen name="CreateGantt">
  {(props: StackScreenProps<ParamListBase, 'CreateGantt'>) => (
    <CreateGantt {...props} onCreate={() => {}} signedIn={signedIn} navigation={props.navigation} />
  )}
</Stack.Screen>
<Stack.Screen name="GanttChartWrapper" component={GanttChartWrapper}  />
<Stack.Screen name="GanttList">
  {(props: StackScreenProps<ParamListBase, 'GanttList'>) => (
    <GanttList {...props} signedIn={signedIn} navigation={props.navigation} />
  )}
</Stack.Screen>
</Stack.Navigator>
</NavigationContainer>
</View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b9d8f4',
  },
  
homeButton: {
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
});

export default App;
