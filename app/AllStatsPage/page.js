import Navigation from "../Components/Navigation";
import AllStats from "../Components/Allstats";

const AllStatsPage = () => {
  return (
    <div className="container">
      <div className="navigation">
        <Navigation />
      </div>
      <div className="content">
        <AllStats />
      </div>
    </div>
  );
};

export default AllStatsPage;
