import React, { useState, useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './SpinWheel.css'; // Ensure you import the CSS file
import Chat from './Chat';

export default function SpinWheel({ onClick }) {
  const spinValues = [
    { minDegree: 0, maxDegree: 59, value: 100 },
    { minDegree: 60, maxDegree: 119, value: 200 },
    { minDegree: 120, maxDegree: 179, value: 300 },
    { minDegree: 180, maxDegree: 239, value: 400 },
    { minDegree: 240, maxDegree: 299, value: 500 },
    { minDegree: 300, maxDegree: 359, value: 600 },
  ];

  const spinColors = [
    "#E74C3C", "#7D3C98", "#2E86C1",
    "#138D75", "#F1C40F", "#D35400",
  ];

  const [text, setText] = useState("Click to Spin!");
  const [isSpinning, setIsSpinning] = useState(false);
  const [showWaitingMessage, setShowWaitingMessage] = useState(true);
  const [showAgentReadyMessage, setShowAgentReadyMessage] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chartRef = useRef(null);
  const spinWheelRef = useRef(null);

  const generateValue = (angleValue) => {
    const normalizedDegree = (angleValue + 90) % 360; // Normalizing the degree within 0-359

    // Check if the spinner stops within the range of the 100 value
    if (normalizedDegree >= 330 || normalizedDegree <= 30) {
      setText(`Congratulations, You Have Won $${spinValues[0].value} !`);
      setIsSpinning(false);
      return;
    }

    // Otherwise, find the corresponding value based on the degree
    for (let i of spinValues) {
      if (normalizedDegree >= i.minDegree && normalizedDegree <= i.maxDegree) {
        setText(`Congratulations, You Have Won $${i.value} !`);
        setIsSpinning(false);
        return;
      }
    }
  };

  const handleSpinClick = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setText("Best Of Luck!");

    const randomDegree = Math.floor(Math.random() * 360) + (360 * 5); // Spin at least 5 times
    let currentDegree = 0;
    const spinChart = chartRef.current;

    const rotationInterval = setInterval(() => {
      currentDegree += 5;
      spinChart.options.rotation = currentDegree % 360;
      spinChart.update();

      if (currentDegree >= randomDegree) {
        clearInterval(rotationInterval);
        const finalAngle = randomDegree % 360; // Final angle where spinner stops
        generateValue(finalAngle);
      }
    }, 10);
  };

  useEffect(() => {
    const ctx = spinWheelRef.current.getContext("2d");

    // Check if there is an existing chart instance
    if (chartRef.current) {
      chartRef.current.destroy(); // Destroy the existing chart
    }

    chartRef.current = new Chart(ctx, {
      plugins: [ChartDataLabels],
      type: "pie", // or "doughnut"
      data: {
        labels: [100, 200, 300, 400, 500, 600],
        datasets: [
          {
            backgroundColor: spinColors,
            data: Array(6).fill(10),
          },
        ],
      },
      options: {
        responsive: true,
        animation: { duration: 0 },
        rotation: 0,
        plugins: {
          tooltip: false,
          legend: { display: false },
          datalabels: {
            rotation: 15,
            color: "#ffffff",
            formatter: (_, context) => context.chart.data.labels[context.dataIndex],
            font: { size: 18 }, // Adjust font size
          },
        },
      },
    });
  }, []); // empty dependency array to ensure this effect runs only once

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWaitingMessage(false);
      setShowAgentReadyMessage(true); // Set agent ready message
    }, 1000); // Hide message after 10 seconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  const handleStartChatClick = () => {
    setIsChatOpen(true);
  };

  return (
    <div className="spinner-chat">
      {showWaitingMessage && (
        <div className="waiting-message">Waiting for agent...</div>
      )}
      <div className="spin-container">
        <canvas id="spinWheel" ref={spinWheelRef} ></canvas>
        <div className="arrow"></div>
        <button className='spin' id="spin_btn" onClick={handleSpinClick} disabled={isSpinning}>
          Spin
        </button>
        <div className='text' id="text">{text}</div>
      </div>
      <div className='chat'>
        {showAgentReadyMessage && !showWaitingMessage && (
          <>
            <div className="agent-ready-message">Agent is ready for conversation</div>
            <Chat/>
          </>
        )}
      </div>
      {/* <button className='start-chat' onClick={handleStartChatClick}>Start Chat</button>
      {isChatOpen && <Chat />}  */}
    </div >
  );
}
