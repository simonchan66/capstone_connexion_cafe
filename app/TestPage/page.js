import Navigation from "../Components/Navigation";
import Test from "../Components/Test";
import { useUserAuth } from "../_utils/auth-context";

const Home = () => {
  return (
    <div className="container">
      <div className="navigation">
        <Navigation />
      </div>
      <div className="order-page">
        <Test />
      </div>
    </div>
  );
};

export default Home;
