import React, { useState } from "react";

function About() {
  const [sections] = useState([
    {
      title: "Introduction",
      content: "Welcome to our online auction platform, where the thrill of bidding meets the convenience of digital commerce. Our platform provides a dynamic marketplace for buyers and sellers to engage in transparent and competitive auctions, offering a diverse array of items ranging from collectibles to electronics, art, and beyond. With our commitment to integrity, security, and user satisfaction, we strive to create an immersive and rewarding auction experience for all participants. Whether you're a seasoned collector or a first-time bidder, we invite you to explore our platform and discover the excitement of online auctions."
    },
    {
      title: "Mission",
      content: "Our mission is to revolutionize the way people buy and sell through online auctions. We are dedicated to creating a transparent and equitable marketplace where buyers can discover unique treasures and sellers can connect with enthusiastic audiences worldwide. By fostering a community-driven environment built on trust, integrity, and innovation, we aim to empower individuals to unlock the true value of their assets while providing an exhilarating and rewarding auction experience for all participants. Through continuous improvement and a commitment to excellence, we strive to redefine the auction industry, making it more accessible, inclusive, and exciting than ever before."
    },
    {
      title: "Vision",
      content: "Our vision is to become the premier destination for online auctions, offering a diverse and dynamic marketplace that caters to the needs and interests of a global audience. We aspire to be the go-to platform for buyers and sellers seeking a seamless and secure auction experience, characterized by transparency, efficiency, and authenticity. By leveraging cutting-edge technology and industry expertise, we aim to set new standards for innovation and excellence in the auction industry, driving growth, value, and opportunity for all participants. With a focus on customer satisfaction, community engagement, and social responsibility, we seek to build a vibrant and sustainable ecosystem that enriches the lives of our users and enhances the world of online commerce."
    },
    {
      title: "Platform Features",
      content: "Our platform offers a comprehensive suite of features designed to enhance the online auction experience for both buyers and sellers. With user-friendly listing tools, sellers can easily showcase their items with detailed descriptions and vibrant images, reaching a global audience of eager bidders. Buyers, in turn, benefit from a diverse selection of items spanning various categories, coupled with advanced search and filtering options to streamline their browsing experience. Our intuitive bidding system ensures fair competition, with real-time updates and automatic bid increments keeping participants informed and engaged throughout the auction process. Additionally, our secure payment gateway facilitates seamless transactions, providing peace of mind to both buyers and sellers. With robust seller verification measures and transparent feedback mechanisms, our platform fosters trust and confidence within our vibrant auction community, making it the premier destination for enthusiasts and collectors alike."
    },
    {
      title: "Benefits",
      content: "Our online auction platform offers numerous benefits to both buyers and sellers. For buyers, the platform provides access to a wide range of unique and sought-after items, allowing them to discover treasures that may not be available elsewhere. With competitive bidding opportunities and real-time updates on auction progress, buyers can enjoy an exhilarating and immersive experience. Additionally, our platform offers convenience and flexibility, enabling users to participate in auctions from the comfort of their own homes and across various devices. For sellers, the platform provides a global marketplace to showcase their items to a diverse audience of potential buyers, maximizing exposure and potential profits. Our streamlined listing and selling process, coupled with robust seller support tools, make it easy for sellers to manage their auctions and transactions efficiently. Furthermore, our platform fosters a sense of community and engagement, connecting buyers and sellers with shared interests and passions. Whether you're a buyer seeking unique treasures or a seller looking to reach a global audience, our online auction platform offers unparalleled opportunities and benefits for all participants."
    }
  ]);

  return (
    <div className="container mx-auto mt-24 px-4 max-w-screen-xl">
      {sections.map((section, index) => (
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

export default About;
