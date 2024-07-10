import React from 'react';

const OrderItem = ({ order, onClick }) => {
  return (
    <div className="order-item" onClick={() => onClick(order)}>
      <div className="order-id">ID: {order.pkid}</div>
      <div className="order-date">Date: {new Date(order.ordered_date).toLocaleDateString()}</div>
      <div className="order-status">Status: {order.ordered ? 'Ordered' : 'Pending'}</div>
      <div className="order-items">
        {order.items.map(item => (
          <div key={item.id} className="order-item-detail">
            <div className="order-item-image">
              {item.image ? <img src={item.image} alt="Product" /> : <div className="placeholder"></div>}
            </div>
            <div className="order-item-info">
              <span>Product ID: {item.product}</span>
              <span>Color: {item.selected_product_color}</span>
              <span>Size: {item.selected_product_size}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderItem;
