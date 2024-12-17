import React, { useEffect, useState, useRef } from "react";
const API_URL = process.env.REACT_APP_API_URL;

const dummyData = [
  { roadNumber: "כביש 4", description: "ממחלף מסובים ועד מחלף גבעת שמואל 11:30 עומס" },
  { roadNumber: "כביש 1", description: "מצומת חוות שער הגיא ועד מחלף שער הגיא 11:30 עומס" },
  { roadNumber: "כביש 1", description: "ממחלף גנות ועד מחלף קיבוץ גלויות 11:30 עומס" },
  { roadNumber: "כביש 2", description: "ממחלף נתניה ועד מחלף פולג 12:00 תאונה" },
  { roadNumber: "כביש 5", description: "ממחלף קסם ועד מחלף ראש העין 12:15 עומס" },
  { roadNumber: "כביש 6", description: "ממחלף עירון ועד מחלף באקה 12:30 עבודות בכביש" },
  { roadNumber: "כביש 20", description: "ממחלף גלילות ועד מחלף קק\"ל 12:45 עומס" },
  { roadNumber: "כביש 40", description: "ממחלף לוד ועד מחלף רמלה 13:00 תאונה" },
  { roadNumber: "כביש 431", description: "ממחלף רמלה דרום ועד מחלף נשרים 13:15 עומס" },
  { roadNumber: "כביש 90", description: "ממחלף עין גדי ועד מחלף מצדה 13:30 עומס" },
];

export function TrafficReports() {
  const [trafficReports, setTrafficReports] = useState(dummyData);
  const containerRef = useRef(null);

  // const fetchReports = async () => {
  //   try {
  //     const response = await fetch(
  //       `${API_URL}/api/orders/traffic-reports`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );
  //     if (!response.ok) {
  //       throw new Error("שגיאה בבקשת הנתונים");
  //     }
  //     const data = await response.json();
  //     setTrafficReports(dummyData);
  //   } catch (error) {
  //     console.error("שגיאה בקריאת הדיווחים:", error);
  //     setTrafficReports(dummyData);
  //   }
  // };

  // useEffect(() => {
  //   fetchReports();
  // }, []);

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
        height: "150px",
        overflow: "auto",
        position: "relative",
        border: "1px solid #ccc",
        borderRadius: "4px",
      }}
    >
      <div
        className="traffic-content"
        style={{
          position: "relative",
          transform: "translateY(0)",
        }}
      >
        {trafficReports.map((report, index) => (
          <div
            key={index}
            style={{
              padding: "10px",
              borderBottom: "1px solid #eee",
            }}
          >
            <h3>{report.roadNumber}</h3>
            <p>{report.description}</p>
          </div>
        ))}
      </div>
      <style>
        {`
          .traffic-content {
            animation: moveUp 10s linear infinite;
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
