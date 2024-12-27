import { useState } from 'react';
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
  const totalEstimatedTime = 1000; // in minutes
  const totalTimeSpent = 750; // in minutes
  const progressPercentage = Math.round((totalTimeSpent / totalEstimatedTime) * 100);

  // Mock data for daily time spent
  const dailyData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Time Spent (minutes)',
        data: [60, 120, 90, 180, 140, 200, 100], // Replace with actual daily data
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  // Mock data for task statuses
  const taskStatusData = {
    labels: ['Completed', 'In Progress', 'Overdue'],
    datasets: [
      {
        data: [15, 8, 3], // Replace with actual task data
        backgroundColor: ['#4caf50', '#ffeb3b', '#f44336'],
      },
    ],
  };

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
                variant={progressPercentage > 70 ? 'success' : 'warning'}
              />
              <p className="mt-3">
                <strong>{totalTimeSpent} minutes</strong> out of <strong>{totalEstimatedTime} minutes</strong> estimated.
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
                      display: false,
                    },
                    tooltip: {
                      enabled: true,
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