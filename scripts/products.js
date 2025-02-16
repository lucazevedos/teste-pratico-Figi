export let products = [];

export async function loadProducts() {
  try {
    const res = await fetch('https://fakestoreapi.com/products');

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json(); 
    products = json; 
  } catch (error) {
    console.error('Unexpected error. Please try again later', error);
  }

  return products;
}
