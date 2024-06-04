const OrderSummary = ({ orderNumber, orderItems, onContinue }) => {
  
    return (
      <div className="order-summary-overlay">
        <div className="order-summary-content">
          <h2>{'Order Confirmation'}</h2>
          <p>{'Your Order Number'}: </p>
          <h1>{orderNumber}</h1>
          <h3>{'Order Summary'}:</h3>
          <ul>
            {orderItems.map((item, index) => (
              <li key={index}>
                {item.item_name} x {item.quantity}
              </li>
            ))}
          </ul>
          <button onClick={onContinue}>{'Continue'}</button>
        </div>
      </div>
    );
  };
export default OrderSummary;