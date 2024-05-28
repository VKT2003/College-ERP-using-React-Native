import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from './firebase';
import { LinearGradient } from "expo-linear-gradient";
import { firebase } from '@react-native-firebase/firestore';


export default function Home({ navigation }) {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('');
  const [attendance, setAttendance] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [firstLetter, setFirstLetter] = useState('');
  const [isLoggedIn, setIsloggedIn] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          setUserName(user.displayName); // Set user's name
          const userId = user.uid;
          const q = query(collection(db, 'students'), where('userId', '==', userId));
          const querySnapshot = await getDocs(q);
          const studentData = [];
          querySnapshot.forEach((doc) => {
            studentData.push({ id: doc.id, ...doc.data() });
          });
          const firstletter = user.displayName ? user.displayName.charAt(0) : '';
          setFirstLetter(firstletter);
          setIsloggedIn(true);
          setStudents(studentData);
        } else {
          // Handle the case when the user is not logged in
          setFirstLetter('');
          setIsloggedIn(false);
          setStatusMessage('You must log in to access this page.');
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchData(); // Fetch data when the component mounts
  }, []);
  const handleToggleLogin = async () => {
   try{
    await auth.signOut();
    navigation.navigate('Login');
    setIsloggedIn(false);
   }catch(error){
    console.error('Error logging out:', error);
   }
  };
  const addStudent = async () => {
    if (name && branch) {
      try {
        const userId = auth.currentUser.uid;
        const docRef = await addDoc(collection(db, 'students'), { name, branch, userId });
        setStudents([...students, { name, branch, id: docRef.id, status: 'absent' }]);
        setName('');
        setBranch('');
        setStatusMessage('Student added successfully.');
      } catch (error) {
        console.error('Error adding student:', error);
        setStatusMessage('Error adding student. Please try again.');
      }
    } else {
      setStatusMessage('Please enter both name and branch.');
    }
  };
  const toggleStatus = (index) => {
    const updatedStudents = [...students];
    updatedStudents[index].status = updatedStudents[index].status === 'absent' ? 'present' : 'absent';
    setStudents(updatedStudents);
  };

  const renderStudentItem = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{`${item.name}`}</Text>
      <Text style={styles.cell}>{`${item.branch}`}</Text>
      <TouchableOpacity onPress={() => toggleStatus(index)}>
        <Text style={[styles.cell, { backgroundColor: item.status === 'absent' ? '#c50404' : '#006666' }, { color: 'white' }, { borderRadius: 10 }, { borderWidth: 0 }]}>
          {item.status === 'absent' || item.status === 'present' ? '' : 'Set Status'}{item.status}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const submitAttendance = async () => {
    const presentStudents = students.filter((student) => student.status === 'present');
    if (presentStudents.length > 0) {
      try {
        await addDoc(collection(db, 'attendance'), {
          date: serverTimestamp(),
          userName: userName, // Include user's name in attendance
          students: presentStudents,
        });
        setAttendance([]);
        setStatusMessage('Attendance submitted successfully!');
      } catch (error) {
        console.error('Error submitting attendance:', error);
        setStatusMessage('Error submitting attendance. Please try again.');
      }
    } else {
      setStatusMessage('No students are marked as present.');
    }
  };

  return (
    <>
      <LinearGradient
        colors={["rgba(4,210,165,1)", "rgba(239,47,167,1)"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.gradContainer}
      >
        <View style={styles.container1}>
          <View style={styles.circle}>
            <Text style={styles.text}>{firstLetter}</Text>
          </View>
          <TouchableOpacity
            style={styles.togglebut}
            onPress={handleToggleLogin}
          >
            <Text style={styles.toggleButText}>{isLoggedIn ? 'logout' : 'login'}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <LinearGradient
        colors={["rgba(200,255,243,1)", "rgba(255,144,213,1)"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.container}
      >
        <View style={styles.container}>

          <Text style={styles.header}>Attendance dashboard for prof 🎓 {userName}</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={(text) => setName(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Branch"
              value={branch}
              onChangeText={(text) => setBranch(text)}
            />
            <TouchableOpacity
              style={[styles.addstud, styles.button]}
              onPress={addStudent}
            >
              <Text style={styles.buttonText}>Add Student</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={students}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderStudentItem}
          />
          <TouchableOpacity
            style={[styles.addstud, styles.button]}
            onPress={submitAttendance}
          >
            <Text style={styles.buttonText}>Submit Attendance</Text>
          </TouchableOpacity>
          {statusMessage !== '' && <Text style={styles.statusMessage}>{statusMessage}</Text>}
        </View>
      </LinearGradient>
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 26,
    // backgroundColor:'rgba(50,20,30,0.5)'
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'black',
    borderWidth: 1.5,
    borderRadius: 10,
    marginRight: 8,
    paddingLeft: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cell: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 10,
    borderColor: 'black',
    padding: 10,
    marginRight: 8,
    color: 'black',
    fontWeight: 'bold'
  },
  statusMessage: {
    marginTop: 16,
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#006666'
  },
  addstud: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    padding: 10,
    // margin: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  container1: {
    flexDirection: 'row',
    justifyContent: "space-between",
    // margin:-1
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#d2047e',
    alignItems: 'center',
    justifyContent: 'center',
    margin:2
  },
  text: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold'
  },
  togglebut: {
    height:35,
    width:70,
    alignItems:'center',
    margin:10, 
    borderRadius:10,
    backgroundColor:'#006666',
  },
  toggleButText:{
    margin:4,
    color:'white',
    fontWeight:'bold',
    fontSize:18
  }
});
