const CategoryList = ({ data }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h3 className="font-semibold mb-4">Category-wise Expenses</h3>

      {data.map((item, index) => (
        <div
          key={index}
          className="flex justify-between mb-2"
        >
          <span>{item.category}</span>
          <span className="font-medium">₹{item.amount}</span>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;