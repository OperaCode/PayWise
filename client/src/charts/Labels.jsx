import React from "react";

const Label = ({ labels = [], values = [] }) => {
  const total = values.reduce((sum, val) => sum + val, 0);

  const colors = [
    "#ffcd56", // yellow
    "#36a2eb", // blue
    "#ff6384", // red
    "#9966ff", // purple
    "#4bc0c0", // teal
    "#ff9f40", // orange
  ];

  return (
    <div className="ml-6 mt-4 space-y-2">
      {labels.map((label, index) => {
        const percent = total ? ((values[index] / total) * 100).toFixed(0) : 0;
        return (
          <div key={index} className="flex justify-between gap-4 items-center">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ background: colors[index % colors.length] }}
              ></div>
              <h3 className="text-md">{label}</h3>
            </div>
            <h3 className="font-bold">{percent}%</h3>
          </div>
        );
      })}
    </div>
  );
};

export default Label;
