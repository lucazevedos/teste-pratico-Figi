export async function addToCart(product) {
  try {
      const cartItem = {
          id: product.id,
          title: product.title,
          price: product.price,
          description: product.description,
          image: product.image,
          category: product.category,
          quantity: 1,
      };

      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const existingProduct = cart.find(item => item.id === product.id);
      if (existingProduct) {
          existingProduct.quantity += 1; 
      } else {
          cart.push(cartItem);
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      console.log("Produto adicionado ao carrinho:", cart);
  } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
  }
}
