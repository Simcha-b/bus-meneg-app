import React, { useEffect, useState, useRef } from "react";

export function TrafficReports() {
  const [trafficReports, setTrafficReports] = useState([]);
  const containerRef = useRef(null);

  const fetchReports = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/orders/traffic-reports",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("שגיאה בבקשת הנתונים");
      }
      const data = await response.json();
      setTrafficReports(data);
    } catch (error) {
      console.error("שגיאה בקריאת הדיווחים:", error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleMouseLeave = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  };

  return (
    <div 
      ref={containerRef}
      className="traffic-container" 
      onMouseLeave={handleMouseLeave}
      style={{
        height: '150px',
        overflow: 'auto',
        position: 'relative',
        border: '1px solid #ccc',
        borderRadius: '4px',
      }}
    >
      <div className="traffic-content" style={{
        position: 'relative',
        transform: 'translateY(0)'
      }}>
        {trafficReports.map((report, index) => (
          <div key={index} style={{
            padding: '10px',
            borderBottom: '1px solid #eee'
          }}>
            <h3>{report.roadNumber}</h3>
            <p>{report.description}</p>
          </div>
        ))}
      </div>
      <style>
        {`
          .traffic-content {
            animation: moveUp 50s linear infinite;
          }

          .traffic-container:hover .traffic-content {
            animation-play-state: paused;
          }

          @keyframes moveUp {
            0% { transform: translateY(0); }
            100% { transform: translateY(-50%); }
          }
        `}
      </style>
    </div>
  );
}

