import React from "react";

function HowItWorks() {
  return (
    <div className="container mx-auto mt-24 px-4 sm:px-6 lg:px-8 max-w-screen-xl">
      {[
        {
          title: "Registration",
          content: "Our online auction system begins with a simple registration process. Users interested in participating in auctions must create an account on our platform. Registration involves providing basic personal information, selecting a username and password, and agreeing to our terms and conditions. This step ensures a secure and personalized experience for all users."
        },
        {
          title: "Browsing Listings",
          content: "Once registered, users gain access to a vast array of listings featuring items up for auction. From electronics and collectibles to art and antiques, our platform offers a diverse selection to suit every taste and interest. Each listing includes detailed descriptions, high-quality images, starting bid prices, and auction end times, enabling users to make informed decisions about their bidding."
        },
        {
          title: "Placing Bids",
          content: "Placing bids on items is straightforward and intuitive. Users simply enter the amount they wish to bid, and our system handles the rest. Bidding typically starts at a minimum price set by the seller, and users can enter bids higher than the current highest bid. As bids are placed, users can monitor the progress of each auction and track the status of their bids in real-time."
        },
        {
          title: "Auction Progress",
          content: "Our platform provides users with up-to-date information on the progress of each auction. Users can see the current highest bid, the time remaining until the auction ends, and any new bids that have been placed. This transparency ensures a fair and competitive bidding environment for all participants."
        },
        {
          title: "Automatic Bidding",
          content: "For added convenience, our platform offers an automatic bidding feature. Users can set a maximum bid amount, and our system will automatically place bids on their behalf, incrementally increasing their bid as necessary until the maximum amount is reached. This feature allows users to stay engaged in multiple auctions without constantly monitoring their bids."
        },
        {
          title: "Auction End",
          content: "When the auction reaches its scheduled end time, the highest bidder wins the item. Our platform notifies the winning bidder and provides instructions for payment and item pickup or delivery. Some auctions may include a 'soft close' feature, extending the auction by a few minutes if new bids are placed near the end to prevent 'sniping' and ensure a fair outcome."
        },
        {
          title: "Payment and Delivery",
          content: "We offer secure payment methods to facilitate smooth transactions between buyers and sellers. Accepted payment methods typically include credit/debit cards, PayPal, or other online payment services. Once payment is received, arrangements for item pickup or delivery can be made according to the preferences of the buyer and seller, ensuring a seamless and convenient experience for all parties involved."
        },
        {
          title: "Feedback and Ratings",
          content: "After the transaction is complete, both buyers and sellers have the opportunity to leave feedback and ratings for each other. This feedback system helps build trust and credibility within our community, providing valuable information for future transactions. Users can share their experiences and contribute to the overall transparency and integrity of our platform."
        }
      ].map((section, index) => (
        <div
          key={index}
          className="my-6 p-6 rounded-lg shadow-md bg-white transition-transform duration-300 hover:shadow-lg hover:scale-105 hover:bg-blue-50"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{section.title}</h1>
          <p className="text-lg text-gray-700 leading-relaxed">{section.content}</p>
        </div>
      ))}
    </div>
  );
}

export default HowItWorks;
