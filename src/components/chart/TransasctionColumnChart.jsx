import React from "react";
import { Bar } from "@ant-design/plots";

const TransactionColumnChart = () => {
  const data = [
    { label: "Jan", type: "series1", value: 2800 },
    { label: "Jan", type: "series2", value: 2260 },
    { label: "Feb", type: "series1", value: 1800 },
    { label: "Feb", type: "series2", value: 1300 },
    { label: "Mar", type: "series1", value: 1950 },
    { label: "Mar", type: "series2", value: 1600 },
    { label: "Apr", type: "series1", value: 2400 },
    { label: "Apr", type: "series2", value: 1900 },
    { label: "May", type: "series1", value: 2100 },
    { label: "May", type: "series2", value: 1700 },
    { label: "Jun", type: "series1", value: 2500 },
    { label: "Jun", type: "series2", value: 2000 },
    { label: "Jul", type: "series1", value: 3000 },
    { label: "Jul", type: "series2", value: 2700 },
    { label: "Aug", type: "series1", value: 2800 },
    { label: "Aug", type: "series2", value: 2600 },
    { label: "Sep", type: "series1", value: 2200 },
    { label: "Sep", type: "series2", value: 2100 },
    { label: "Oct", type: "series1", value: 2400 },
    { label: "Oct", type: "series2", value: 2000 },
    { label: "Nov", type: "series1", value: 2700 },
    { label: "Nov", type: "series2", value: 2300 },
    { label: "Dec", type: "series1", value: 2900 },
    { label: "Dec", type: "series2", value: 2500 },
  ];

  const config = {
    data,
    xField: "label",
    yField: "value",
    colorField: "type",
    scale: {
      x: {
        padding: 0.5,
      },
    },
    group: true,
    style: {
      height: 10,
    },
  };

  return (
    <div
      style={{
        border: "2px solid #2593fc",
        borderRadius: "8px",
        padding: "16px",
      }}
    >
      <Bar {...config} />
    </div>
  );
};

export default TransactionColumnChart;
