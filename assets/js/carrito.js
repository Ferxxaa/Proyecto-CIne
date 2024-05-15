// Función para agregar elementos al carrito
function addToCart(title, price) {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems.push({ title, price });
    localStorage.setItem('cart', JSON.stringify(cartItems));
    displayCart();
}

// Función para limpiar el carrito
function clearCart() {
    localStorage.removeItem('cart');
    displayCart();
}

// Función para obtener la tasa de cambio de CLP a USD
async function dolar() {
    try {
        const response = await fetch('https://mindicador.cl/api/dolar');
        const data = await response.json();
        return data.serie[0].valor; // Obtener el valor del dólar
    } catch (error) {
        console.error('Error al obtener la tasa de cambio:', error); //DESBUG EN CASO DE QUE LA API NO FUNCIONE 
        throw error;
    }
}

// Función para mostrar los elementos del carrito en la página
async function displayCart() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-items');
    const totalPriceUSDContainer = document.getElementById('total-price-usd');
    let totalPriceCLP = 0;

    cartContainer.innerHTML = '';

    cartItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <p><strong>Película:</strong> ${item.title}</p>
            <p><strong>Precio:</strong> $${item.price} CLP</p>
        `;
        cartContainer.appendChild(itemElement);
        totalPriceCLP += item.price;
    });

    try {
        const exchangeRate = await dolar();
        const totalPriceUSD = totalPriceCLP / exchangeRate;
        totalPriceUSDContainer.textContent = `Total en USD: $${totalPriceUSD.toFixed(2)}`;
    } catch (error) {
        totalPriceUSDContainer.textContent = 'No disponible'; // Mostrar mensaje de error en caso de fallo
    }
}

// Mostrar los elementos del carrito cuando la página se carga
document.addEventListener('DOMContentLoaded', displayCart);

// Evento para limpiar el carrito al hacer clic en el botón "Limpiar Carrito"
document.getElementById('clear-cart').addEventListener('click', clearCart);
