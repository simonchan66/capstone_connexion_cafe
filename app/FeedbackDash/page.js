import Navigation from '../Components/Navigation';
import FeedbackDashboard from '../Components/FeedbackDashboard';
import { useUserAuth } from '../_utils/auth-context';

const FeedbackDash = () => {


  
  return (
    <div className="container">
      <div className="navigation">
        <Navigation />
      </div>
      <div className="order-page">
        <FeedbackDashboard />
      </div>
    </div>
  );
};

export default FeedbackDash;