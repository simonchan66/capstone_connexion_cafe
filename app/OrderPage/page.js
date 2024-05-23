import Navigation from '../Components/Navigation';
import OrderPage from '../Components/OrderPage';
import { useUserAuth } from '../_utils/auth-context';

const Home = () => {


  
  return (
    <div className="container">
      <div className="navigation">
        <Navigation />
      </div>
      <div className="order-page">
        <OrderPage />
      </div>
    </div>
  );
};

export default Home;