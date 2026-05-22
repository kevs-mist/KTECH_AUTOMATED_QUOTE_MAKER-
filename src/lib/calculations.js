// Calculate final price for a line item
export const calculateFinalPrice = (quantity, unitPrice) => {
  return (quantity * unitPrice).toFixed(2);
};

// Calculate subtotal from all items
export const calculateSubtotal = (items) => {
  return items.reduce((sum, item) => sum + parseFloat(item.finalPrice || 0), 0).toFixed(2);
};

// Calculate grand total with charges
export const calculateGrandTotal = (subtotal, charges) => {
  let total = parseFloat(subtotal);
  
  charges.forEach(charge => {
    if (charge.type === 'fixed') {
      total += parseFloat(charge.amount || 0);
    } else if (charge.type === 'percentage') {
      total += (subtotal * parseFloat(charge.amount || 0) / 100);
    }
  });
  
  return total.toFixed(2);
};

// Format currency in Indian Rupees (INR)
export const formatCurrency = (value) => {
  const num = parseFloat(value);
  if (isNaN(num)) return '₹0.00';
  return num.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR'
  });
};
