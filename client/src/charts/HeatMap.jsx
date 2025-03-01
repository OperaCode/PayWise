import React from "react";
import HeatMap from "react-heatmap-grid";

const SpendingHeatmap = () => {
  // Days and Weeks
  const xLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const yLabels = ["W-1", "W-2", "W-3", "W-4"];

  // Spending Data (amount spent per day)
  const spendingData = [
    [10, 20, 15, 30, 50, 25, 40], 
    [5, 10, 20, 25, 35, 40, 45],  
    [15, 25, 30, 35, 50, 60, 70], 
    [10, 15, 20, 25, 35, 40, 45], 
  ];

  return (
    <div className="w-full m-auto">
      <h3 className="font-bold text-center text-xl py-2">Spending Heatmap</h3>
      <p className="text-center p-1">We track your spendings like a <span className="text-red-900 font-bold">HEATWAVE !!!</span> </p>
      <HeatMap
        xLabels={xLabels}
        yLabels={yLabels}
        data={spendingData}
        // background={(value) => `rgba(0, 128, 255, ${value / 100})`}
        cellRender={(value) => <span className="font-bold text-sm">${value}</span>}
        xLabelsStyle={{
          fontSize: "16px",
          fontWeight: "bold",
           // color: "#333",
        }}
        yLabelsStyle={{
          fontSize: "16px",
          fontWeight: "bold",
          // color: "#333",
          
        }}
      />
    </div>
  );
};

export default SpendingHeatmap;
