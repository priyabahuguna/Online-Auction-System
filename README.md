# Online-Auction-System
Project on online auction system
The Online Auction System is a full-stack web application that allows users to participate in auctions, bid on items, and buy or sell products in real-time. It provides a platform for both buyers and sellers to engage in a dynamic marketplace, with functionalities to manage user authentication, product listings, bidding processes, and final sales. The system operates on the MERN stack (MongoDB, Express.js, React.js, and Node.js), utilizing MongoDB for storing data and providing a RESTful API for interaction between the client and server.

Key Features
<br>
1.User Authentication:
Login/Signup: Users must register and authenticate themselves to access the auction platform. User authentication is managed using JWT tokens and session cookies for secure login.
Role-Based Access: The system distinguishes between buyers and sellers, with different privileges based on roles.
Middleware: A custom middleware (fetchUser.js) is implemented to authenticate users across different routes.
2.Product Listings:
Create Product: Sellers can list products for auction, including descriptions, images, starting prices, and auction deadlines.
Browse Products: Buyers can browse through available products, filter them by category, price, and auction time remaining.
Product Model: The Product.js model defines the product schema, including fields like product name, description, images, initial bid price, and auction end time.
Auction and Bidding Process:

3.Real-Time Bidding: Users can place bids on listed items, and the highest bidder wins the auction when the auction ends.
Bid Updates: The highest bid is continuously updated in real-time using WebSockets or API polling to ensure every user sees the latest bids.
Bid Notifications: Users are notified when they are outbid or when they win an auction.
Buy and Sell Mechanisms:

4.Buy Now Option: Some products might offer a "Buy Now" option for immediate purchase, bypassing the auction.
Seller Controls: Sellers can manage their product listings, update or remove them, and see the current bid status.
Cron Jobs:

5.Automatic Auction Closure: A cron job is used to close auctions automatically when the specified auction end time is reached. This is handled by cron.js route logic.
Winner Announcement: When an auction ends, the highest bidder is automatically declared the winner, and both buyer and seller are notified.
Security:

6.Data Encryption: Passwords are hashed and stored securely using libraries like bcrypt.js.
Authentication Middleware: The fetchUser.js middleware ensures that only authenticated users can access bidding or auction-related functionalities.
Frontend (React):

7.React Components: The frontend is built using React.js with components to display products, handle user input for bidding, and manage authentication (login, registration).
Responsive Design: The system is designed to be responsive across various devices, ensuring a seamless user experience on mobile, tablet, and desktop.
User Dashboard: Each user has a personalized dashboard to manage their auctions (both as a buyer and seller) and track bids and wins.
Database (MongoDB):

8.User and Product Data: The MongoDB database stores information on users, product listings, bids, and transactions.
Bid Tracking: A separate collection or embedding strategy is used to track bids made on each product.
Project Directory S
