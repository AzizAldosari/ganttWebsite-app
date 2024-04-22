import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import 'firebase/firestore';
import {doc, updateDoc} from 'firebase/firestore';
import {firestore} from '../firebaseConfig';
import Svg, {Rect} from 'react-native-svg';
interface Task {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  weeks: number;
}
interface Props {
  projectName: string | null;
  tasks?: Task[] | null;
  ganttChartId: string | null;
  sharedToken?: string | null;
}
const GanttChart: React.FC<Props> = ({
  projectName,
  tasks = [],
  ganttChartId,
}) => {
  const taskHeight = 20;
  const gap = 4;
  const scale = 20;
  const weekTextWidth = 20;
  const weekGap = 15;

  const renderTasks = () => {
    return tasks?.map((task, index) => {
      const y = index * (taskHeight + gap) + 40;
      const width = task.weeks * (scale + weekGap) - weekGap;

      return (
        <Rect
          key={task.id}
          x={0}
          y={y}
          width={width}
          height={taskHeight}
          fill="blue"
        />
      );
    });
  };

  const renderWeekNumbers = () => {
    const numberOfWeeks = Math.max(
      ...(tasks?.map(task => task.weeks) || []),
      0,
    );
    const weekNumbers = [];
    for (let i = 1; i <= numberOfWeeks; i++) {
      weekNumbers.push(
        <Text
          key={i}
          style={[styles.weekNumber, {left: (i - 1) * (scale + weekGap)}]}>
          week{i}
        </Text>,
      );
    }
    return weekNumbers;
  };

  const renderMonths = () => {
    const numberOfMonths = Math.ceil(
      Math.max(...(tasks?.map(task => task.weeks) || []), 0) / 4,
    );
    const monthNames = [];
    for (let i = 1; i <= numberOfMonths; i++) {
      monthNames.push(
        <Text
          key={i}
          style={[
            styles.monthName,
            {left: (i - 1) * (4 * (scale + weekGap)) + scale / 2},
          ]}>
          Month {i}
        </Text>,
      );
    }
    return monthNames;
  };

  const renderTaskNames = () => {
    return tasks?.map((task, index) => {
      const y = index * (taskHeight + gap) + 10;

      return (
        <Text key={task.id} style={[styles.taskName, {top: y + 30}]}>
          {task.title}
        </Text>
      );
    });
  };

  const svgWidth =
    Math.max(...(tasks?.map(task => task.weeks) || []), 0) * (scale + weekGap);
  const svgHeight = (tasks?.length || 0) * (taskHeight + gap) + 24 + 20;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{projectName}</Text>
      <View style={styles.chartArea}>
        {renderWeekNumbers()}
        {renderMonths()}
        {renderTaskNames()}
        <Svg width={svgWidth} height={svgHeight}>
{renderTasks()}
</Svg>
</View>
</View>
);
};

const styles = StyleSheet.create({
container: {
flex: 1,
justifyContent: 'flex-start',
alignItems: 'center',
backgroundColor: '#F5FCFF',
width: '70%',
alignSelf: 'center',
},
title: {
fontSize: 24,
marginBottom: 16,
},
chartArea: {
position: 'relative',
paddingRight: 40,
},
weekNumber: {
position: 'absolute',
top: 0,
fontSize: 10,
},
monthName: {
position: 'absolute',
top: -20,
fontSize: 14,
},
taskName: {
position: 'absolute',
left: -100,
fontSize: 12,
},
});

export default GanttChart;
