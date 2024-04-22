import React, {useEffect, useState} from 'react';
import {Pressable, Text, View} from 'react-native';
import {useNavigate} from 'react-router';
import {auth} from '../firebaseConfig';
import {firestore} from '../firebaseConfig';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
} from 'firebase/firestore';

interface GanttChart {
  id: string;
  projectName: string;
}

interface Props {
  signedIn: boolean;
}

const GanttList: React.FC<Props> = ({signedIn}) => {
  const [ganttCharts, setGanttCharts] = useState<GanttChart[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGanttCharts = async () => {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const q = query(
          collection(firestore, 'gantt_charts'),
          where('userId', '==', userId),
        );
        const querySnapshot = await getDocs(q);
        const ganttChartsData: GanttChart[] = [];

        querySnapshot.forEach(doc => {
          ganttChartsData.push({
            id: doc.id,
            projectName: doc.data().projectName,
          });
        });

        setGanttCharts(ganttChartsData);
      }
    };

    fetchGanttCharts();
  }, []);

  const handleClick = (ganttChartId: string) => {
    if (signedIn) {
      navigate(`/gantt/${ganttChartId}`);
    } else {
      navigate('/signin');
    }
  };

  const handleDelete = async (ganttChartId: string) => {
    await deleteDoc(doc(firestore, 'gantt_charts', ganttChartId));
    setGanttCharts(ganttCharts.filter(chart => chart.id !== ganttChartId));
  };

  return (
    <View>
      <Pressable onPress={() => navigate('/')}>
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
