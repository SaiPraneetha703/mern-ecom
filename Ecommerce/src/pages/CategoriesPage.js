import { useNavigate } from "react-router-dom";  
import getCategoryData from "../data/categoriesData";
import { useEffect, useState } from "react";

function CategoriesPage({ setSelectedCategory, selectedCategory }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);  

  useEffect(() => {
    const data = getCategoryData();
    setCategories(data);
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    navigate(`/products/${category}`);
  };

  return (
    <div className="categories-container">
      <h1>Categories Page: {selectedCategory}</h1>
      <p>Select a category to view products.</p>
      
      <div className="tiles-grid">
        {categories.map((obj, index) => (
          <div key={index} className="category-tile"
           
           >
            <div className="category-image-placeholder">
              {obj.image ? (
                <img
                  src={obj.image}
                  alt={obj.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span>📦</span>
              )}
            </div>
            <h2 className="category-title">{obj.title}</h2>
            <button className="select-button" onClick={() => handleCategoryClick(obj.title)}>
              Click to select
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoriesPage;
