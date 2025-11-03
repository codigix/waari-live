import SalesDashboard from "./AllDashboards/SalesDashboard";
import AdminDashboard from "./AllDashboards/AdminDashboard";
import OperatorDashboard from "./AllDashboards/OperatorDashboard";
import AccountantDashboard from "./AllDashboards/AccountantDashboard";

const Home = () => {
  return (
    <div>
      <SalesDashboard />
      <AdminDashboard />
      <OperatorDashboard />
      <AccountantDashboard />
    </div>
  );
};
export default Home;
