import React, { useEffect, useState } from "react";
import "../styles/RecipeStyle.css";
import { Link } from "react-router-dom";
import "../styles/Searchbar.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for styling
import footer from "./footer";

const Recipes = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [commentValue, setCommentValue] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [comments, setComments] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [isRecipeFetching, setIsRecipeFetching] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setLoggedInUser(user);

    if (user) {

      getRecipes();
      getComments();
    }
  }, []);

  const getComments = () => {
    fetch("http://localhost:9000/auth/comments", {
      method: "GET",
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch recipe data");
        }
        return response.json();
      })
      .then((data) => {
        setComments(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getRecipes = () => {
    setIsRecipeFetching(true);
    fetch("http://localhost:9000/auth/recipe", {
      method: "GET",
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch recipe data");
        }
        return response.json();
      })
      .then((data) => {
        setRecipes(data);
        setIsRecipeFetching(false);
      })
      .catch((error) => {
        console.error(error);
      })
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      // Confirm the deletion with the user
      if (window.confirm("Are you sure you want to delete the recipe?")) {
        // Send a DELETE request to the server
        const response = await fetch(
          `http://localhost:9000/auth/recipe/${recipeId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          toast.success("Recipe deleted successfully");

          setTimeout(() => {
            window.location = "/recipes";
          }, 1000);
        } else {
          getRecipes();
          window.location = "/recipes";
        }
      }
    } catch (error) {
      toast.error("An error occurred while deleting the recipe:", error);

      setTimeout(() => {
        window.location.href = "/recipes";
      }, 3000);
    }
  };

  const handleAddToFavorites = async (recipeId) => {
    try {
      // Send a POST request to the LikedList controller
      const response = await fetch(
        `http://localhost:9000/auth/likedRecipes/${recipeId}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        toast.success("Recipe added to favorites successfully");

        setTimeout(() => {
          window.location.href = "/favouriteRecipes";
        }, 1000);
      } else {
        const data = await response.json();
        if (data.error === "Recipe already exists in your favorites") {
          toast.warn("Recipe already exists in your favorites");
        } else {
          toast.error(data.error);
        }
      }
    } catch (error) {
      console.error("An error occurred while adding to favorites:", error);
    }
  };

  const SearchRecipes = async (e) => {
    try {
      if (e.target.value) {
        let Searchedrecipes = await fetch(
          `http://localhost:9000/auth/searchRecipes/${e.target.value}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        Searchedrecipes = await Searchedrecipes.json();

        if (!Searchedrecipes.message) {
          setRecipes(Searchedrecipes);
        } else {
          setRecipes([]);
        }
      } else {
        getRecipes();
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleSendComment = async (recipeId) => {
    try {
      setLoadingId(recipeId);
      const payload = {
        recipeId,
        comment: commentValue,
        userId: loggedInUser?._id,
        username: loggedInUser?.name,
      }
      await fetch(
        `http://localhost:9000/auth/comment`,
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      ).then((response) => {

        if (!response.ok) {
          throw new Error("Failed to fetch comments data");
        } else {
          document.getElementById(recipeId).value = '';
          toast.success("Comment Added successfully!");
          setCommentValue('');
        }
        return response.json();
      }).then((data) => {
        setComments((prev) => [...prev, data])
      })
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoadingId(null);
    }
  }

  const handleDeleteComment = async (commentId, userId) => {
    try {
      const response = await fetch(
        `http://localhost:9000/auth/comment?commentId=${commentId}&userId=${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      ).then((response) => {

        if (!response.ok) {
          throw new Error("Failed to delete comments");
        } else {
          toast.success("Comment deleted successfully!");
        }
        return response.json();
      }).then(() => {
        setComments((prev) => prev.filter(d => d?._id !== commentId))
      })
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="Recipes">
      <div style={{
        height: '60vh',
        position: 'relative',
        textAlign: 'center',
        color: '#fff',
        marginBottom: '20px',
        borderRadius: '15px',
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      }}>
        {/* Background Image */}
        <img
          src="/banner.jpg"
          alt="Delicious Food Banner"
          style={{
            width: '100%',
            height: '100%',
            filter: 'brightness(60%)'
          }}
        />

        <div className="banner">
          <h1 style={{
            fontSize: '36px',
            margin: '0 0 10px',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
          }}>
            Welcome to Lost Chef!
          </h1>
          <p style={{
            fontSize: '18px',
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
          }}>
            Discover the best recipes, create your own, and share them with food enthusiasts around the world!
          </p>
          <Link to="/addRecipe" id="panIconCont">
            Add your own recipe ‍
            <span id="panicon" style={{ fontSize: 30, marginLeft: 10, position: 'absolute', top: 0 }}>🍳</span>
          </Link>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search recipes"
          onChange={(e) => SearchRecipes(e)}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', flexFlow: 'wrap', rowGap: 5 }}>
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div key={recipe._id} className="Recipe">
              <h2>{recipe.title}</h2>
              <img src={recipe.imageUrl} alt={recipe.title} />
              <h3>Ingredients:</h3>
              <ul>
                {recipe.ingredients.length > 0 && (
                  <ul>
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                )}
              </ul>
              <div className="instructions-container">
                <h3>Instructions:</h3>
                <div style={{ padding: 15, paddingTop: 5 }}>
                  {recipe.instructions.match(/^\d+\./) ? (
                    <div className="instructions-text">
                      {recipe.instructions.split("\n").map((step, index) => (
                        <p key={index}>{step}</p>
                      ))}
                    </div>
                  ) : (
                    <ol className="instructions-list">
                      {recipe.instructions.split("\n").map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  )}
                </div>
              </div>

              {
                loggedInUser?.role == 'admin' && (
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteRecipe(recipe._id)}
                  >
                    Delete
                  </button>
                )
              }
              <button
                className="add-to-favorites-button"
                onClick={() => handleAddToFavorites(recipe._id)}
              >
                Add to Favorites
              </button>

              <div style={{ marginTop: 20, paddingTop: 5, borderTop: '0.1px solid gray' }}>
                <h3>Review comments</h3>
                <input type="text" id={recipe?._id} placeholder="Write a comment" onChange={(e) => setCommentValue(e.target.value)} style={{ padding: 5, width: '70%' }} />
                <button
                  className="add-to-favorites-button"
                  onClick={() => handleSendComment(recipe._id)}
                  style={{
                    opacity: loadingId == recipe?._id ? 0.5 : 1,
                    pointerEvents: loadingId == recipe?._id ? 'none' : 'all'
                  }}
                >
                  {loadingId == recipe?._id ? 'Submitting..' : 'Submit'}
                </button>
                <div style={{ marginTop: 15, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {
                    comments?.filter(d => d?.recipeId === recipe._id)?.map((d, i) => (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, }}>
                          <div style={{ paddingLeft: 5, paddingRight: 5, width: 'fit-content', fontSize: 12, borderRadius: 5, border: '1px solid gray', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#473e66', color: 'white' }}>{d?.username}</div>
                          <span style={{ fontSize: 14, color: '#505050' }}>{d?.comment}</span>
                        </div>
                        {
                          (loggedInUser?._id === d?.userId || loggedInUser?.role == 'admin') && (
                            <div style={{ cursor: 'pointer' }} onClick={() => handleDeleteComment(d?._id, d?.userId)}>⛔</div>
                          )
                        }
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          ))
        ) : (
          <h2 className="no-recipes">{isRecipeFetching ? 'Fetching Recipes...' : 'No Recipes Found'}</h2>
        )}
      </div>
      <ToastContainer />
      <footer />
    </div>
  );
};

export default Recipes;
