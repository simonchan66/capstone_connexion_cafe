import Navigation from "../Components/Navigation";
import FeedbackPage from "../Components/FeedbackPage";

const Feedback = () => {
  return (
    <div className="container">
      <div className="navigation">
        <Navigation />
      </div>
      <div className="edit-product-page">
        <FeedbackPage />
      </div>
    </div>
  );
};

export default Feedback;
