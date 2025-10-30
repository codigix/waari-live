import SalesDashboard from "../Dashboard/AllDashboards/SalesDashboard";
import AdminDashboard from "../Dashboard/AllDashboards/AdminDashboard";
import OperatorDashboard from "../Dashboard/AllDashboards/OperatorDashboard";
import AccountantDashboard from "../Dashboard/AllDashboards/AccountantDashboard";

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
