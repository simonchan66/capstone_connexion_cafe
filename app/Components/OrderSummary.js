import { useLanguage } from "../_utils/LanguageContext";

const OrderSummary = ({ orderNumber, orderItems, changeAmount, onContinue }) => {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg shadow-2xl p-8 max-w-md w-full text-white">
        <h2 className="text-3xl font-bold text-center text-green-400 mb-6">
          {t("orderPlacedSuccessfully")}
        </h2>
        <div className="text-center mb-8">
          <p className="text-lg text-gray-300 mb-2">{t("yourOrderNumber")}:</p>
          <h3 className="text-5xl font-bold text-blue-400">{orderNumber}</h3>
        </div>
        <div className="mb-8">
          <h4 className="text-xl font-semibold mb-4 text-gray-100">{t("orderSummary")}:</h4>
          <ul className="space-y-3">
            {orderItems.map((item, index) => (
              
              <li key={index} className="flex justify-between items-center border-b border-gray-700 pb-2">
                <span className="text-gray-300">
                  {item.item_name} <span className="text-gray-500">x {item.quantity}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-6 pt-4 border-t border-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold text-gray-100">{t("change")}:</span>
              <span className="text-2xl font-bold text-green-400">${changeAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onContinue}
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {t("ok")}
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;