import React, {useState} from 'react';
import {View, Text, TextInput, Pressable, StyleSheet} from 'react-native';
import {auth} from '../firebaseConfig';
import {firestore} from '../firebaseConfig';
import {collection, addDoc} from 'firebase/firestore';
import {formatISO} from 'date-fns';
import {differenceInWeeks} from 'date-fns';
import {useNavigate} from 'react-router';
import {v4 as uuidv4} from 'uuid';
interface CreateGanttProps {
  onCreate: (
    projectName: string,
    tasks: Task[],
    ganttChartId: string,
    newTasks: Task[],
  ) => void;
  signedIn: boolean;
}
interface Task {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  weeks: number;
}

const CreateGantt: React.FC<CreateGanttProps> = ({onCreate, signedIn}) => {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const handleNavigation = () => {
    if (signedIn) {
      navigate('/create');
    } else {
      navigate('/signin');
    }
  };

  const addTask = () => {
    if (taskTitle.trim() && startDate.trim() && endDate.trim()) {
      const weeks = differenceInWeeks(new Date(endDate), new Date(startDate));

      const newTask: Task = {
        id: formatISO(new Date()),
        title: taskTitle,
        startDate,
        endDate,
        weeks,
      };

      setTasks([...tasks, newTask]);
      setTaskTitle('');
      setStartDate('');
      setEndDate('');
    }
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleCreate = async () => {
    if (projectName.trim()) {
      const userId = auth.currentUser?.uid;
      const shareToken = uuidv4();
      const ganttChartRef = await addDoc(
        collection(firestore, 'gantt_charts'),
        {
          projectName,
          tasks,
          userId,
          shareToken,
        },
      );

      onCreate(projectName, tasks, ganttChartRef.id, tasks);
      setProjectName('');
      setTasks([]);
    }
  };
  return (
    <View>
      <Text>Create a new Gantt Chart</Text>
      <TextInput
        placeholder="Project Name"
        value={projectName}
        onChangeText={setProjectName}
      />
      <TextInput
        placeholder="Task Title"
        value={taskTitle}
        onChangeText={setTaskTitle}
      />
      <TextInput
        placeholder="Start Date (yyyy-MM-dd)"
        value={startDate}
        onChangeText={setStartDate}
      />
      <TextInput
        placeholder="End Date (yyyy-MM-dd)"
        value={endDate}
        onChangeText={setEndDate}
      />
      <Pressable style={styles.createButton} onPress={addTask}>
        <Text style={styles.buttonText}>Add Task</Text>
      </Pressable>
      {tasks.map(task => (
        <View key={task.id}>
          <Text>
            {task.title} ({task.startDate} - {task.endDate})
          </Text>
          <Pressable
            style={styles.createButton}
            onPress={() => removeTask(task.id)}>
            <Text style={styles.buttonText}>Remove</Text>
          </Pressable>
        </View>
      ))}
      <Pressable style={styles.createButton} onPress={handleCreate}>
        <Text style={styles.buttonText}>Create</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  createButton: {
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

export default CreateGantt;
