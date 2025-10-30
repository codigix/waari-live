import React, { Component } from "react";
import { Line } from "react-chartjs-2";

const data = {

  labels: ["","Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug","Sept","Oct","Nov","Dec"],
  datasets: [
    {
      label: "Achieved",
      data:[0, 7,18 ,20 ,25,27,25,18,16],
      borderColor: "#076fb0",
      borderWidth: "1",
      backgroundColor: "#076fb0",
      pointBackgroundColor: "#076fb0",
	 
    },
    {
      label: "Target",
      data: [ 0,5,15 ,18 ,20,24,22,15,14],
      borderColor: "#00c2cb",
      borderWidth: "1",
     
      borderDash: [5, 5],
      backgroundColor: "transparent",
      pointBackgroundColor: "#00c2cb",
	 
    },
  ],
};

const options = {
  plugins:{
	
	  tooltips: {
		intersect: false,
	  },
    legend: {
      display: true, // Display the legend
      position: 'top', 
      align:"end" // You can change the legend position if needed
    },
	  hover: {
		// mode: "nearest",
		intersect: true,
	  }
  },
  scales: {
    y: 
      {
        ticks: {
          beginAtZero: true,
          max: 100,
          min: 0,
          stepSize: 5,
          padding:20,
        },
      },
    
    x: 
      {
        ticks: {
          padding: 5,
        },
      },
    
  },
};
class DualLine3 extends Component {
  render() {
    return <Line data={data} options={options} height={195}  />;
  }
}

export default DualLine3;
