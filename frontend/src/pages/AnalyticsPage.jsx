import { useState, useEffect } from 'react';
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

const AnalyticsPage = () => {
  // Mock data for total time
  // const totalEstimatedTime = 1000; // in minutes
  // const totalTimeSpent = 750; // in minutes
  // const progressPercentage = Math.round((totalTimeSpent / totalEstimatedTime) * 100);

  const [totalEstimatedTime, setTotalEstimatedTime] = useState(180 * 60); // in seconds
  const [totalTimeSpent, setTotalTimeSpent] = useState(0 * 60); // in seconds
  const [progressPercentage, setProgressPercentage] = useState(Math.round((totalTimeSpent / totalEstimatedTime) * 100));
  const [isRunning, setIsRunning] = useState(true);
  const [intervalId, setIntervalId] = useState(null);

  // Mock data for daily time spent
  const dailyData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Time Spent (minutes)',
        data: [10, 15, 8, 12, 14, 3, 5], // Replace with actual daily data
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  // const [totalEstimatedTime, setTotalEstimatedTime] = useState(180); // in minutes
  // const [totalTimeSpent, setTotalTimeSpent] = useState(20); // in minutes
  // const [progressPercentage, setProgressPercentage] = useState(Math.round((totalTimeSpent / totalEstimatedTime) * 100));
  useEffect(() => {
    const fetchTotalTimeSpent = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/api/user/totaltime', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalTimeSpent(response.data.totalTimeSpent * 60); // Convert minutes to seconds
        setProgressPercentage(Math.round((response.data.totalTimeSpent * 60 / totalEstimatedTime) * 100));
      } catch (error) {
        console.error('Error fetching total time spent:', error);
      }
    };

    fetchTotalTimeSpent();
  }, [totalEstimatedTime]);

  useEffect(() => {
    if (isRunning) {
      const newIntervalId = setInterval(() => {
        setTotalTimeSpent(prevTime => {
          const newTime = prevTime + 1;
          setProgressPercentage(Math.round((newTime / totalEstimatedTime) * 100));
          if (newTime >= totalEstimatedTime) {
            clearInterval(newIntervalId);
            setIsRunning(false);
          }
          return newTime;
        });
      }, 1000); // Increase time every second
      setIntervalId(newIntervalId);
      return () => clearInterval(newIntervalId);
    }
  }, [isRunning, totalEstimatedTime]);

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

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

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
        setDailyData({
          labels: response.data.labels,
          datasets: [
            {
              label: 'Time Spent (minutes)',
              data: response.data.data,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
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

  // const handleDateChange = (date) => {
  //   setSelectedDate(date);
  //   // Fetch daily time spent data for the selected date
  //   axios.get(`http://localhost:5001/api/daily-time?date=${date.toISOString()}`)
  //     .then(response => {
  //       console.log('Daily time data for selected date:', response.data); // Log data to check if it's correct
  //       setDailyData(response.data);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching daily time data for selected date:', error);
  //     });
  // };

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackResult, setFeedbackResult] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleGetAIFeedback = async () => {
    try {
      setIsAnalyzing(true);
      const result = await analyzeAnalytics(dailyData, taskStatusData, progressPercentage);
      setFeedbackResult(result);
      setShowFeedbackModal(true);
    } catch (error) {
      console.error('Error getting AI feedback:', error);
      // Handle error appropriately
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