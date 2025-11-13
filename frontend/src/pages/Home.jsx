import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";

function Home() {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Get logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    setLoggedInUser(storedUser);
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    handleSuccess("User logged out successfully!");
    setTimeout(() => navigate("/login"), 1000);
  };

 // Fetch products from backend
const fetchProducts = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      handleError("Please login first");
      return;
    }

    const url = `${import.meta.env.VITE_API_URL}/products`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const result = await response.json();
    console.log("Products received:", result);
    setProducts(result);
  } catch (err) {
    handleError(err.message || "Failed to fetch products");
  }
};

  

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex flex-col overflow-x-hidden">
      {/* Navbar */}
      {/* <nav className="flex items-center justify-between px-8 py-5 bg-gray-950 shadow-md w-full z-50 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-purple-400 tracking-wide">
          Auth-System
        </h1>
        <div className="flex items-center gap-6">
          <p className="text-sm text-gray-300">
            {loggedInUser ? `Hello, ${loggedInUser}` : "Guest"}
          </p>
          <button
            onClick={handleLogout}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Login
          </button>
        ) : (
  <button
    onClick={() => navigate("/login")}
    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
  >
    Login
  </button>
)}
        </div>
      </nav> */}
      <nav className="flex items-center justify-between px-8 py-5 bg-gray-950 shadow-md w-full z-50 border-b border-gray-800">
  <h1 className="text-2xl font-bold text-purple-400 tracking-wide">
    Auth-System
  </h1>
  <div className="flex items-center gap-6">
    <p className="text-sm text-gray-300">
      {loggedInUser ? `Hello, ${loggedInUser}` : "Guest"}
    </p>
    {loggedInUser ? (
      <button
        onClick={handleLogout}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
      >
        Logout
      </button>
    ) : (
      <button
        onClick={() => navigate("/login")}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
      >
        Login
      </button>
    )}
  </div>
</nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 sm:px-10 pt-20 pb-16 bg-gray-900">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Aakash Saini <span className="text-purple-500">'s Project</span>
        </h2>
        <p className="text-gray-300 max-w-2xl mb-6 text-base md:text-lg">
          Securely manage user access and authentication with our system — a
          complete solution for modern web applications.
        </p>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition">
          Thank you
        </button>
      </section>

      {/* Product Section */}
      <section className="px-8 py-12 bg-gray-950 rounded-t-3xl">
        <h3 className="text-2xl font-semibold text-purple-400 mb-6">
          Our Products
        </h3>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((item, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl p-4 hover:scale-105 transition-transform shadow-lg"
              >
                <div className="w-full h-70 overflow-hidden rounded-lg mb-4">
                  <img
                    src={item.image || ""}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-semibold text-lg mb-1">{item.name}</h4>
                <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                  {item.description || "No description available"}
                </p>
                <p className="text-purple-400 font-bold text-lg">
                  ₹
                  {Number(item.price).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center mt-10">No products found</p>
        )}
      </section>

      <ToastContainer />
    </div>
  );
}

export default Home;
