import Navigation from "../Components/Navigation";
import EditProductPage from "../Components/EditProductPage";

const EditProduct = () => {
  return (
    <div className="container">
      <div className="navigation">
        <Navigation />
      </div>
      <div className="edit-product-page">
        <EditProductPage />
      </div>
    </div>
  );
};

export default EditProduct;
