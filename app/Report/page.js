import Navigation from "../Components/Navigation";
import ReportPage from "../Components/ReportPage";

const Report = () => {
  return (
    <div className="container">
      <div className="navigation">
        <Navigation />
      </div>
      <div className="content">
        <ReportPage />
      </div>
    </div>
  );
};

export default Report;
