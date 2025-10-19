const cron = require('node-cron');
const Product = require('../models/Product');

function scheduleProductsUpdate() {
  // Schedule a task to run every minute
  cron.schedule('* * * * *', async () => {
    try {
      // Fetch all products whose end time has passed
      const expiredProducts = await Product.find({ endDate: { $lte: new Date() } });

      // Update the status of each expired product
      for (const product of expiredProducts) {
        if(product.status!=='completed')
        product.status = 'expired';
        await product.save();
      }
    } catch (error) {
      console.error('Error updating expired products:', error.message);
    }
  });
}

module.exports = { scheduleProductsUpdate };
