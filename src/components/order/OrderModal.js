import React from 'react';

const OrderModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="order-modal">
      <div className="order-modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Order Details</h2>
        <div className="order-modal-details">
          <p><strong>Order ID:</strong> {order.pkid}</p>
          <p><strong>Ordered Date:</strong> {new Date(order.ordered_date).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {order.ordered ? 'Ordered' : 'Pending'}</p>
          <h3
          style={{
            'marginTop':"15px"
          }}
          >Items</h3>
          {order.items.map(item => (
            <div key={item.id} className="order-modal-item">
              <div className="order-item-image">
                {item.image ? <img src={item.image} alt="Product" /> : <div className="placeholder"></div>}
              </div>
              <div className="order-item-info">
                <p><strong>Product ID:</strong> {item.product}</p>
                <p><strong>Color:</strong> {item.selected_product_color}</p>
                <p><strong>Size:</strong> {item.selected_product_size}</p>
                <p><strong>Quantity:</strong> {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
