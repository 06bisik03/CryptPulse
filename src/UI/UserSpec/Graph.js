import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const Graph = (props) => {

  const investments = props.investments.investments.toFixed(2);
  const deposits = props.investments.deposits.toFixed(2);
  const data = {
    labels: ["Deposits", "Investment"],
    datasets: [
      {
        label: ["Total Cash Flow"],
        data: [deposits, investments],
        backgroundColor: ["rgb(102, 255, 245)", "rgb(255, 0, 187)"],
        borderColor: ["rgb(102, 255, 245)", "rgb(255, 0, 187)"],
      },
    ],
  };
  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return "$" + value; // Add the "$" symbol to the value
          },
        },
      },
    },
  };
  return (
    <div>
      <Doughnut data={data} options={options}></Doughnut>
    </div>
  );
};
export default Graph;
/*This component is a graph. It makes use of the data in firebase, which get passed down through props to showcase the amount of money the user has spent
invest and how much money he has deposited in his CryptPulse account until now */