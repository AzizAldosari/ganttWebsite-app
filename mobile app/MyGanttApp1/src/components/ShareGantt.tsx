import React, {useState, useEffect} from 'react';
import {Text, Pressable, Alert, Platform, Share} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import {doc, getDoc} from 'firebase/firestore';
import {firestore} from '../firebaseConfig';

interface ShareGanttProps {
  ganttChartId: string | null;
}

declare const window: any;
declare const navigator: any;

const ShareGantt: React.FC<ShareGanttProps> = ({ganttChartId}) => {
  const [sharedToken, setSharedToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchSharedToken = async () => {
      if (ganttChartId) {
        const ganttChartRef = doc(firestore, 'gantt_charts', ganttChartId);
        const ganttChartSnapshot = await getDoc(ganttChartRef);
        const ganttChartData = ganttChartSnapshot.data();
        if (ganttChartData && ganttChartData.sharedToken) {
          setSharedToken(ganttChartData.sharedToken);
        }
      }
    };
    fetchSharedToken();
  }, [ganttChartId]);
 // const baseURL = 'https://myGantt1.com'; not deployed yet but if it was hosted with firebase it should look like this.
 const baseURL = 'website is not hosted yet ';
  const shareURL =
    ganttChartId && sharedToken
    //  ? `${window.location.origin}/gantt/${ganttChartId}?token=${sharedToken}`
     // : '';
     ? `${baseURL}/gantt/${ganttChartId}?token=${sharedToken}`
     : '';

  console.log('Share URL:', shareURL);

  const handleCopyLink = () => {
    if (Platform.OS === 'web') {
      navigator.clipboard.writeText(shareURL).then(
        () => {
          Alert.alert('Link copied to clipboard');
        },
        (_err: Error) => {
          Clipboard.setString(shareURL);
          Alert.alert('Failed to copy link');
        },
      );
    } else {
      console.log('Sharing URL:', shareURL);
      Share.share({
        message: `Check out my Gantt chart: ${shareURL}`,
        url: shareURL,
        title: 'Share Gantt Chart',
      })
        .then(() => {
          console.log('Shared successfully');
        })
        .catch(error => {
          console.log('Sharing failed', error);
        });
    }
  };

  return (
    <Pressable onPress={handleCopyLink}>
      <Text>Copy Shareable Link</Text>
    </Pressable>
  );
};

export default ShareGantt;
