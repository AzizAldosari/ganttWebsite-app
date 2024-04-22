import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Platform, Pressable, Text} from 'react-native';
import {
  Routes,
  Route,
  BrowserRouter,
  useParams,
  Navigate,
} from 'react-router-dom';
import {useNavigate} from 'react-router';
import CreateGantt from './components/CreateGantt';
import GanttChart from './components/GanttChart';
import GanttList from './components/GanttList';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ShareGantt from './components/ShareGantt';
import Home from './components/Home';
import {auth} from './firebaseConfig';
import {doc, getDoc} from 'firebase/firestore';
import {firestore} from './firebaseConfig';
import About from './components/About';

interface GanttChartWrapperProps {
  tasks: any[];
}
const GanttChartWrapper: React.FC<GanttChartWrapperProps> = ({tasks}) => {
  const {ganttChartId} = useParams<{ganttChartId: string}>();
  const [projectName, setProjectName] = useState<string | null>(null);
  const navigate = useNavigate();
  const handleHomeNavigation = () => {
    navigate('/');
  };

  useEffect(() => {
    const fetchGanttChartData = async () => {
      if (ganttChartId) {
        const ganttChartRef = doc(firestore, 'gantt_charts', ganttChartId);
        getDoc(ganttChartRef)
          .then(ganttChartSnapshot => {
            const ganttChartData = ganttChartSnapshot.data();

            if (ganttChartData) {
              setProjectName(ganttChartData.projectName);
              // setTasks(ganttChartData.tasks);
            }
          })
          .catch(error => {
            console.error('Error fetching Gantt chart data:', error);
          });
      }
    };
    fetchGanttChartData();
  }, [ganttChartId]);

  // const handleCreate = (
  //  projectName: string,
  //  tasks: any[],
  // ganttChartId: string,
  // newTasks: any[]
  // ) => {
  //  setTasks(newTasks);
  //  navigate(`/gantt/${ganttChartId}`);
  // };

  return (
    <>
      {/*  <CreateGantt onCreate={handleCreate} signedIn={true} /> */}
      <GanttChart
        projectName={projectName}
        tasks={tasks}
        ganttChartId={ganttChartId ?? null}
      />
      {ganttChartId && <ShareGantt ganttChartId={ganttChartId} />}
      <Pressable style={styles.homeButton} onPress={handleHomeNavigation}>
        <Text style={styles.buttonText}>Home</Text>{' '}
      </Pressable>
    </>
  );
};

const Router: React.FC = () => {
  const navigate = useNavigate();
  const handleCreate = (
    projectName: string,
    tasks: any[],
    ganttChartId: string,
    newTasks: any[],
  ) => {
    setTasks(newTasks);
    navigate(`/gantt/${ganttChartId}`);
  };
  const [signedIn, setSignedIn] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setSignedIn(!!user);
    });
    return unsubscribe;
  }, []);

  if (!signedIn) {
    return (
      <Routes>
        <Route path="/" element={<Home signedIn={signedIn} />} />
        <Route path="/about" element={<About signedIn={signedIn} />} />
        <Route
          path="/signin"
          element={<SignIn onSignIn={() => setSignedIn(true)} />}
        />
        <Route
          path="/signup"
          element={<SignUp onSignUp={() => setSignedIn(false)} />}
        />
        <Route
          path="/create"
          element={<CreateGantt onCreate={handleCreate} signedIn={signedIn} />}
        />
        <Route
          path="/my-gantt-charts"
          element={<GanttList signedIn={signedIn} />}
        />
      </Routes>
    );
  }

  if (signedIn) {
    return (
      <Routes>
        <Route path="/" element={<Home signedIn={signedIn} />} />
        <Route path="/about" element={<About signedIn={signedIn} />} />
        <Route
          path="/create"
          element={<CreateGantt onCreate={handleCreate} signedIn={signedIn} />}
        />
        <Route
          path="/gantt/:ganttChartId"
          element={<GanttChartWrapper tasks={tasks} />}
        />
        <Route
          path="/my-gantt-charts"
          element={<GanttList signedIn={signedIn} />}
        />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home signedIn={signedIn} />} />
      <Route path="/about" element={<About signedIn={signedIn} />} />
      <Route
        path="/create"
        element={<CreateGantt onCreate={handleCreate} signedIn={signedIn} />}
      />
      <Route
        path="/gantt/:ganttChartId"
        element={<GanttChartWrapper tasks={tasks} />}
      />
      <Route
        path="/my-gantt-charts"
        element={<GanttList signedIn={signedIn} />}
      />
    </Routes>
  );
};

const App: React.FC = () => {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <BrowserRouter>
          <React.StrictMode>
            <Router />
          </React.StrictMode>
        </BrowserRouter>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <React.StrictMode>
        <Router />
      </React.StrictMode>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#b9d8f4',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
