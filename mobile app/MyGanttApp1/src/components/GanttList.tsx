import React, {useEffect, useState} from 'react';
import {Pressable, Text, View} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {auth} from '../firebaseConfig';
import {firestore} from '../firebaseConfig';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  deleteDoc, onSnapshot,
} from 'firebase/firestore';

interface GanttChart {
  id: string;
  projectName: string;
}

interface Props {
  signedIn: boolean;
  navigation: any;
}

const GanttList: React.FC<Props> = ({ signedIn, navigation }) => {
  const [ganttCharts, setGanttCharts] = useState<GanttChart[]>([]);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      const ganttChartsRef = collection(firestore, 'gantt_charts');
      const q = query(ganttChartsRef, where('userId', '==', userId));
  
      console.log('Subscribing to Gantt chart data...');
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        console.log('Received Gantt chart data update');
        const ganttChartsData: GanttChart[] = [];
  
        querySnapshot.forEach((doc) => {
          ganttChartsData.push({
            id: doc.id,
            projectName: doc.data().projectName,
          });
        });
  
        setGanttCharts(ganttChartsData);
      });
  
      return () => {
        console.log('Unsubscribing from Gantt chart data');
        unsubscribe();
      };
    }
  }, []);  
  const handleClick = (ganttChartId: string) => {
    console.log('handleClick: signedIn:', signedIn);
    if (signedIn) {
      navigation.navigate('GanttChartWrapper', { ganttChartId });
    } else {
       navigation.navigate('SignIn', { shouldNavigateToGanttList: true });
    }
  };

  const handleDelete = async (ganttChartId: string) => {
    await deleteDoc(doc(firestore, 'gantt_charts', ganttChartId));
    setGanttCharts(ganttCharts.filter(chart => chart.id !== ganttChartId));
  };

  return (
    <View>
      <Pressable onPress={() => navigation.navigate('Home')}>
        <Text>Home</Text>
      </Pressable>
      <Text>My Gantt Charts</Text>
      {ganttCharts.map(ganttChart => (
        <View key={ganttChart.id}>
          <Pressable onPress={() => handleClick(ganttChart.id)}>
            <Text>{ganttChart.projectName}</Text>
          </Pressable>
          <Pressable onPress={() => handleDelete(ganttChart.id)}>
            <Text>Delete</Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
};

export default GanttList;
