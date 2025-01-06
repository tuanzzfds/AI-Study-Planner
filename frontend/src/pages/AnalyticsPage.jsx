import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Container, Row, Col, ProgressBar, Button, Modal } from 'react-bootstrap';
import { Bar, Pie } from 'react-chartjs-2';
import './AnalyticsPage.css';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import Sidebar from '../components/Sidebar'; // Import Sidebar component
import { analyzeAnalytics } from '../services/geminiServiceAnalyticPage';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

let globalIntervalId = null;

const AnalyticsPage = () => {
  // Mock data for total time
  // const totalEstimatedTime = 1000; // in minutes
  // const totalTimeSpent = 750; // in minutes
  // const progressPercentage = Math.round((totalTimeSpent / totalEstimatedTime) * 100);

  const [totalEstimatedTime, setTotalEstimatedTime] = useState(180 * 60); // tính bằng giây
  const [totalTimeSpent, setTotalTimeSpent] = useState(() => {
    const savedTime = localStorage.getItem('totalTimeSpent');
    return savedTime ? parseInt(savedTime, 10) : 0;
  }); // tính bằng giây
  const [progressPercentage, setProgressPercentage] = useState(Math.round((totalTimeSpent / totalEstimatedTime) * 100));
  const [isRunning, setIsRunning] = useState(() => {
    const savedRunningState = localStorage.getItem('isRunning');
    return savedRunningState ? JSON.parse(savedRunningState) : true;
  });
  const totalTimeSpentRef = useRef(totalTimeSpent);


  // Mock data for daily time spent
  const [dailyData, setDailyData] = useState({
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Time Spent (minutes)',
        data: [], // Initialize with an empty array
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  });

  useEffect(() => {
    const fetchDailyData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/api/user/dailytimespent', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const dailyDataFromAPI = response.data.dailyTimeSpent; // Assuming the API returns an array of daily time spent in minutes
        setDailyData((prevData) => ({
          ...prevData,
          datasets: [
            {
              ...prevData.datasets[0],
              data: dailyDataFromAPI,
            },
          ],
        }));
      } catch (error) {
        console.error('Error fetching daily data:', error);
      }
    };

    fetchDailyData();
  }, []);

  useEffect(() => {
    const updateDailyData = () => {
      const currentDay = new Date().getDay();
      setDailyData((prevData) => {
        const newData = [...prevData.datasets[0].data];
        newData[currentDay] = totalTimeSpent / 60; // Convert seconds to minutes
        return {
          ...prevData,
          datasets: [
            {
              ...prevData.datasets[0],
              data: newData,
            },
          ],
        };
      });
    };

    const intervalId = setInterval(updateDailyData, 24 * 60 * 60 * 1000); // Update daily data every 24 hours

    return () => clearInterval(intervalId);
  }, [totalTimeSpent]);


  useEffect(() => {
    const fetchTotalTimeSpent = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/api/user/totaltime', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedTime = response.data.totalTimeSpent * 60; // Chuyển đổi phút sang giây
        if (totalTimeSpentRef.current === 0) {
          setTotalTimeSpent(fetchedTime);
          totalTimeSpentRef.current = fetchedTime;
          localStorage.setItem('totalTimeSpent', fetchedTime);
        }
        setProgressPercentage(Math.round((fetchedTime / totalEstimatedTime) * 100));
      } catch (error) {
        console.error('Error fetching total time spent:', error);
      }
    };

    fetchTotalTimeSpent();
  }, [totalEstimatedTime]);

  useEffect(() => {
    if (isRunning && !globalIntervalId) {
      globalIntervalId = setInterval(() => {
        const newTime = totalTimeSpentRef.current + 1;
        totalTimeSpentRef.current = newTime;
        localStorage.setItem('totalTimeSpent', newTime);
        setTotalTimeSpent(newTime);
        setProgressPercentage(Math.round((newTime / totalEstimatedTime) * 100));
        if (newTime >= totalEstimatedTime) {
          clearInterval(globalIntervalId);
          globalIntervalId = null;
          setIsRunning(false);
          localStorage.setItem('isRunning', false);
        }
      }, 1000); // Tăng thời gian mỗi giây
    }
    return () => {
      // Không xóa khoảng thời gian ở đây để đảm bảo bộ đếm thời gian tiếp tục chạy
    };
  }, [isRunning, totalEstimatedTime]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const savedTime = localStorage.getItem('totalTimeSpent');
        if (savedTime) {
          const newTime = parseInt(savedTime, 10);
          setTotalTimeSpent(newTime);
          totalTimeSpentRef.current = newTime;
          setProgressPercentage(Math.round((newTime / totalEstimatedTime) * 100));
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [totalEstimatedTime]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };



  // const handleStartProgress = () => {
  //   const interval = setInterval(() => {
  //     setTotalTimeSpent(prevTime => {
  //       const newTime = prevTime + 1;
  //       setProgressPercentage(Math.round((newTime / totalEstimatedTime) * 100));
  //       if (newTime >= totalEstimatedTime) {
  //         clearInterval(interval);
  //       }
  //       return newTime;
  //     });
  //   }, 1000); // Increase time every second
  // };



  // const progressPercentage = Math.round((totalTimeSpent / totalEstimatedTime) * 100);


  const [taskStatusData, setTaskStatusData] = useState({
    labels: ['Todo', 'In Progress', 'Completed', 'Expired', 'Not Started'],
    datasets: [
      {
        data: [], // Initially empty
        backgroundColor: ['#2196f3', '#ffeb3b', '#4caf50', '#f44336', '#9e9e9e'],
      },
    ],
  });

  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    // Fetch daily time spent data
     axios.get('http://localhost:5001/api/daily-time')
       .then(response => {
         console.log('Daily time data:', response.data); // Log data to check if it's correct
         // Adjusted condition based on actual API response structure
         if (response.data && Array.isArray(response.data)) {
           // Assuming the API returns an array of daily time spent in minutes
           setDailyData({
             labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
             datasets: [
               {
                 label: 'Time Spent (minutes)',
                 data: response.data,
                 backgroundColor: 'rgba(75, 192, 192, 0.6)',
               },
             ],
           });
         } else {
           console.error('Invalid daily time data format.');
         }
       })
       .catch(error => {
         console.error('Error fetching daily time spent data:', error);
       });
    axios.get('http://localhost:5001/api/task-status')
      .then(response => {
        const { todo, inProgress, completed, expired, notStarted } = response.data;
        setTaskStatusData({
          labels: ['Todo', 'In Progress', 'Completed', 'Expired', 'Not Started'],
          datasets: [
            {
              data: [todo, inProgress, completed, expired, notStarted],
              backgroundColor: ['#2196f3', '#ffeb3b', '#4caf50', '#f44336', '#9e9e9e'],
            },
          ],
        });
      })
      .catch(error => {
        console.error('Error fetching task status data:', error);
      });
  }, []);

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackResult, setFeedbackResult] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleGetAIFeedback = async () => {
    try {
      setIsAnalyzing(true);
      // Ensure dailyData and taskStatusData are defined and have necessary properties
      if (
        dailyData && 
        dailyData.labels && 
        dailyData.datasets && 
        dailyData.datasets[0] &&
        taskStatusData &&
        taskStatusData.labels &&
        taskStatusData.datasets &&
        taskStatusData.datasets[0]
      ) {
        const result = await analyzeAnalytics(dailyData, taskStatusData, progressPercentage);
        setFeedbackResult(result);
        setShowFeedbackModal(true);
      } else {
        throw new Error('Incomplete analytics data');
      }
    } catch (error) {
      console.error('Error getting AI feedback:', error);
      alert('Failed to get AI feedback. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <Sidebar /> {/* Include Sidebar component */}
      <div className="main-content">
        <Container>
          <h1 className="text-center my-4">Analytics</h1>

          {/* Add AI Feedback Button */}
          <Row className="mb-4">
            <Col className="text-center">
              <Button
                onClick={handleGetAIFeedback}
                disabled={isAnalyzing}
                variant="primary"
              >
                {isAnalyzing ? 'Analyzing...' : 'Get AI Feedback'}
              </Button>
            </Col>
          </Row>

          {/* Total Time Spent vs Estimated Time */}
          <Row className="mb-5">
            <Col md={6} className="mx-auto">
              <h4>Total Time Spent</h4>
              <ProgressBar
                now={progressPercentage}
                label={`${progressPercentage}%`}
                variant={progressPercentage > 60 ? 'success' : 'warning'}
              />
              <p className="mt-3">
                <strong>{formatTime(totalTimeSpent)}</strong> out of <strong>{formatTime(totalEstimatedTime)}</strong> estimated.
              </p>
            </Col>
          </Row>

          {/* Daily Time Spent */}
          <Row className="mb-5">
            <Col md={8} className="mx-auto">
              <h4>Daily Time Spent</h4>
              <Bar
                data={dailyData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'top',
                    },
                    tooltip: {
                      enabled: true,
                    },
                    title: {
                      display: true,
                      text: 'Daily Time Spent on Tasks',
                    },
                  },
                  scales: {
                    x: {
                      title: {
                        display: false, // Hide the title for the x-axis
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: 'Minutes',
                      },
                      beginAtZero: true,
                      ticks: {
                        stepSize: 5, // Adjust step size for better readability
                        max: 20, // Set the maximum value for the y-axis
                      },
                    },
                  },
                }}
              />
            </Col>
          </Row>

          {/* Task Status Summary */}
          <Row className="mb-5">
            <Col md={6} className="mx-auto">
              <h4>Task Status</h4>
              <Pie
                data={taskStatusData}
                options={{
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </Col>
          </Row>

          {/* AI Feedback Modal */}
          <Modal show={showFeedbackModal} onHide={() => setShowFeedbackModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>AI Analysis Feedback</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div style={{ whiteSpace: 'pre-line' }}>
                {feedbackResult}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowFeedbackModal(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    </>
  );
};

export default AnalyticsPage;