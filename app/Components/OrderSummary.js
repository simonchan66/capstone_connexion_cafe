import { useLanguage } from "../_utils/LanguageContext";

const OrderSummary = ({ orderNumber, orderItems, onContinue }) => {
  const { t } = useLanguage();
  return (
    <div className="order-summary-overlay">
      <div className="order-summary-content">
        <h1>{t("orderPlacedSuccessfully")}</h1>
        <p>{t("yourOrderNumber")}: </p>
        <h1 className="text-red-300">{orderNumber}</h1>
        <h3>{t("orderSummary")}:</h3>
        <ul className="text-red-300">
          {orderItems.map((item, index) => (
            <li key={index}>
              {item.item_name} x {item.quantity}
            </li>
          ))}
        </ul>
        <button onClick={onContinue}>{t("ok")}</button>
      </div>
    </div>
  );
};
export default OrderSummary;
