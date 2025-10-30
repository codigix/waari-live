import React from "react";
import { Line } from "react-chartjs-2";


function DualLine({achivedTarget,actualTarget}) {
  const data = {

    labels: ["","Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug","Sept","Oct","Nov","Dec"],
    datasets: [
      {
        label: "Achieved",
        data:achivedTarget,
        borderColor: "#076fb0",
        borderWidth: "1",
        backgroundColor: "#076fb0",
        pointBackgroundColor: "#076fb0",
     
      },
      {
        label: "Target",
        data: actualTarget,
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
            max: 35,
            min: 0,
            suggestedMin: 0,   // Ensure the minimum y-scale value is 0
            suggestedMax: 30,  // Set the maximum y-scale value to 30
            stepSize: 5,
            padding:20,
          },
        },
      
      x: 
        {
          ticks: {
            beginAtZero: false, 
            padding: 5,
            min:1,
        
          },
        },
      
    },
   
  };
    return (<Line data={data} options={options} height={198}  />)
}

export default DualLine;
