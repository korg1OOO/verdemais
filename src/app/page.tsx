"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Star, X } from "lucide-react";
import Image from "next/image";

interface Product {
  id: number;
  title: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice: number;
  installments: string;
  hasFreteGratis: boolean;
  inStock: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

interface Address {
  cep: string;
  state: string;
  city: string;
  bairro: string;
  rua: string;
  number: string;
}


export default function Home() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [inStock, setInStock] = useState(true);
  const [outOfStock, setOutOfStock] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOption, setSortOption] = useState<"featured" | "best-selling" | "alphabetical" | "price-low" | "price-high">("featured");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);
  const [isPaymentSubmitted, setIsPaymentSubmitted] = useState(false);
  const [address, setAddress] = useState<Address>({
  cep: '',
  state: '',
  city: '',
  bairro: '',
  rua: '',
  number: ''
});

  const pixNumber = "09543603979";

  const products: Product[] = [
    {
      id: 1,
      title: "Buquê de 6 Rosas Persyas",
      image: "https://res.cloudinary.com/dqknds48u/image/upload/v1749004949/WhatsApp_Image_2025-06-03_at_12.06.41_uwtbw8.jpg",
      rating: 5,
      reviews: 640,
      price: 89.90,
      originalPrice: 159.90,
      installments: "Até 12x de R$ 3,32",
      hasFreteGratis: true,
      inStock: true,
    },
    {
      id: 2,
      title: "Buquê de 6 Girassóis",
      image: "https://res.cloudinary.com/dqknds48u/image/upload/v1749004949/WhatsApp_Image_2025-06-03_at_12.06.41_1_bv24tl.jpg",
      rating: 4.9,
      reviews: 270,
      price: 69.90,
      originalPrice: 137.90,
      installments: "Até 12x de R$ 5,82",
      hasFreteGratis: false,
      inStock: true,
    },
    {
      id: 3,
      title: "Caixa Elegance",
      image: "https://res.cloudinary.com/dqknds48u/image/upload/v1749004948/WhatsApp_Image_2025-06-03_at_12.09.08_2_k1a2y2.jpg",
      rating: 4.7,
      reviews: 15,
      price: 49.90,
      originalPrice: 127.90,
      installments: "Até 12x de R$ 4,15",
      hasFreteGratis: false,
      inStock: true,
    },
    {
      id: 4,
      title: "Caixa Champanhe + Ursinho e Chocolates",
      image: "https://res.cloudinary.com/dqknds48u/image/upload/v1749004948/WhatsApp_Image_2025-06-03_at_12.09.08_1_itfcvn.jpg",
      rating: 5,
      reviews: 28,
      price: 34.90,
      originalPrice: 65.90,
      installments: "Até 7x de R$ 9,99",
      hasFreteGratis: false,
      inStock: true,
    },
    {
      id: 5,
      title: "Caneca Personalizada com Chocolates",
      image: "https://res.cloudinary.com/dqknds48u/image/upload/v1749004951/WhatsApp_Image_2025-06-03_at_12.09.08_r71pc9.jpg",
      rating: 5,
      reviews: 277,
      price: 14.90,
      originalPrice: 35.00,
      installments: "Até 2x de R$ 7,65",
      hasFreteGratis: false,
      inStock: true,
    },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesAvailability =
      (inStock && product.inStock) || (outOfStock && !product.inStock) || (!inStock && !outOfStock);
    const min = minPrice ? parseFloat(minPrice) : -Infinity;
    const max = maxPrice ? parseFloat(maxPrice) : Infinity;
    const matchesPrice = product.price >= min && product.price <= max;
    return matchesAvailability && matchesPrice;
  });

  const sortProducts = (
    products: Product[],
    sortOption: "featured" | "best-selling" | "alphabetical" | "price-low" | "price-high"
  ) => {
    const sortedProducts = [...products];
    switch (sortOption) {
      case "featured":
        return sortedProducts;
      case "best-selling":
        return sortedProducts.sort((a, b) => b.reviews - a.reviews);
      case "alphabetical":
        return sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
      case "price-low":
        return sortedProducts.sort((a, b) => a.price - b.price);
      case "price-high":
        return sortedProducts.sort((a, b) => b.price - a.price);
      default:
        return sortedProducts;
    }
  };

  const sortedProducts = sortProducts(filteredProducts, sortOption);

  const addToCart = (product: Product) => {
  setCart((prevCart: CartItem[]) => {
    const existingItem = prevCart.find((item: CartItem) => item.id === product.id);
    if (existingItem) {
      return prevCart.map((item: CartItem) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    }
    return [...prevCart, { ...product, quantity: 1 } as CartItem];
  });
};

  const removeFromCart = (productId: number) => {
  setCart((prevCart: CartItem[]) => prevCart.filter((item: CartItem) => item.id !== productId));
};

const updateQuantity = (productId: number, change: number) => {
  setCart((prevCart: CartItem[]) => {
    const updatedCart = prevCart.map((item: CartItem) =>
      item.id === productId
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    );
    return updatedCart.filter((item: CartItem) => item.quantity > 0);
  });
};

  const handleCepChange = async (cep: string) => {
  const cleanedCep = cep.replace(/\D/g, '');
  const formattedCep = cleanedCep.replace(/(\d{5})(\d{3})/, '$1-$2');
  setAddress({ ...address, cep: formattedCep });

  if (cleanedCep.length === 8) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setAddress((prev) => ({
          ...prev,
          state: data.uf,
          city: data.localidade,
          bairro: data.bairro || '',
          rua: data.logradouro || ''
        }));
      } else {
        alert('CEP não encontrado. Por favor, verifique o CEP digitado.');
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      alert('Erro ao consultar o CEP. Tente novamente.');
    }
  }
};

  const handleCheckoutSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (address.cep && address.bairro && address.rua && address.number) {
    setIsPaymentSubmitted(true);
  } else {
    alert('Por favor, preencha todos os campos obrigatórios.');
  }
};

  const handleFinishPurchase = () => {
    setCart([]);
    setIsCheckout(false);
    setIsPaymentSubmitted(false);
    setAddress({
      cep: '',
      state: '',
      city: '',
      bairro: '',
      rua: '',
      number: ''
    });
    setIsCartOpen(false);
  };

  const StarRating = ({ rating, reviews }: { rating: number; reviews: number }) => (
    <div className="flex items-center gap-1 mb-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          fill={star <= rating ? "#facc15" : "none"}
          stroke={star <= rating ? "#facc15" : "#d1d5db"}
          className="transition-colors"
        />
      ))}
      <span className="text-xs text-gray-600 ml-1">({reviews})</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-purple-600 rounded mr-2" />
              <span className="text-xl sm:text-2xl font-bold text-gray-900">Verde Mais</span>
              <span className="text-xs sm:text-sm text-gray-600 ml-1">Floricultura</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart size={20} />
                <Badge className="absolute -top-2 -right-2 bg-purple-600 text-white min-w-[20px] h-5 flex items-center justify-center text-xs">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </Badge>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {isCheckout ? (isPaymentSubmitted ? "Pagamento" : "Endereço de Entrega") : "Seu Carrinho"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckout(false);
                  setIsPaymentSubmitted(false);
                  setAddress({
                    cep: '',
                    state: '',
                    city: '',
                    bairro: '',
                    rua: '',
                    number: ''
                  });
                }}
              >
                <X size={20} />
              </Button>
            </div>

            {/* Cart View */}
            {!isCheckout && (
  <>
    {cart.length === 0 ? (
      <p className="text-gray-600 text-center">Seu carrinho está vazio.</p>
    ) : (
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Image
                src={item.image}
                alt={item.title}
                width={50}
                height={50}
                className="w-12 h-12 object-cover rounded"
              />
              <div>
                <h3 className="text-sm font-medium">{item.title}</h3>
                <p className="text-xs text-gray-600">
                  R$ {item.price.toFixed(2).replace('.', ',')} x {item.quantity}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, -1)}
                    className="h-6 w-6 p-0"
                  >
                    -
                  </Button>
                  <span className="text-sm">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, 1)}
                    className="h-6 w-6 p-0"
                  >
                    +
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-sm font-bold">
              R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
            </p>
          </div>
        ))}
        <Separator className="my-4" />
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold">Total:</p>
          <p className="text-lg font-bold">
            R${' '}
            {cart
              .reduce((total, item) => total + item.price * item.quantity, 0)
              .toFixed(2)
              .replace('.', ',')}
          </p>
        </div>
      </div>
    )}
    <Button
      className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white"
      onClick={() => setIsCheckout(true)}
      disabled={cart.length === 0}
    >
      Finalizar Compra
    </Button>
    <Button
      variant="outline"
      className="w-full mt-2"
      onClick={() => setIsCartOpen(false)}
    >
      Continuar Comprando
    </Button>
  </>
)}

            {/* Checkout Address Form */}
            {isCheckout && !isPaymentSubmitted && (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div>
                  <label htmlFor="cep" className="block text-sm font-medium text-gray-700">
                    CEP
                  </label>
                  <Input
                    id="cep"
                    placeholder="Digite seu CEP (ex: 12345-678)"
                    value={address.cep}
                    onChange={(e) => handleCepChange(e.target.value)}
                    className="mt-1"
                    required
                    maxLength={9}
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                    Estado
                  </label>
                  <Input
                    id="state"
                    placeholder="Estado"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="mt-1"
                    readOnly
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    Cidade
                  </label>
                  <Input
                    id="city"
                    placeholder="Cidade"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="mt-1"
                    readOnly
                  />
                </div>
                <div>
                  <label htmlFor="bairro" className="block text-sm font-medium text-gray-700">
                    Bairro
                  </label>
                  <Input
                    id="bairro"
                    placeholder="Digite seu bairro"
                    value={address.bairro}
                    onChange={(e) => setAddress({ ...address, bairro: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="rua" className="block text-sm font-medium text-gray-700">
                    Rua
                  </label>
                  <Input
                    id="rua"
                    placeholder="Digite sua rua"
                    value={address.rua}
                    onChange={(e) => setAddress({ ...address, rua: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="number" className="block text-sm font-medium text-gray-700">
                    Número
                  </label>
                  <Input
                    id="number"
                    placeholder="Digite o número"
                    value={address.number}
                    onChange={(e) => setAddress({ ...address, number: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={!address.cep || !address.bairro || !address.rua || !address.number}
                >
                  Confirmar Endereço
                </Button>
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => setIsCheckout(false)}
                >
                  Voltar ao Carrinho
                </Button>
              </form>
            )}

            {/* Payment Confirmation with Pix Number */}
            {isCheckout && isPaymentSubmitted && (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Pedido confirmado! Por favor, realize o pagamento usando o seguinte número Pix:
                </p>
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <p className="text-lg font-bold">{pixNumber}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Total a pagar: R${' '}
                    {cart
                      .reduce((total, item) => total + item.price * item.quantity, 0)
                      .toFixed(2)
                      .replace('.', ',')}
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  Após o pagamento, seu pedido será enviado para: <br />
                  <span className="font-medium">
                    {address.rua}, {address.number}, {address.bairro}, {address.city} - {address.state}, CEP: {address.cep}
                  </span>
                </p>
                <Button
                  className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={handleFinishPurchase}
                >
                  Concluir
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-xs sm:text-sm text-gray-600">
          <a href="#" className="hover:text-purple-600">Página Inicial</a>
          <span className="mx-2">/</span>
          <span>Dia dos Namorados</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg p-4 lg:p-6 shadow-sm">
              <div className="flex justify-between items-center lg:hidden">
                <h2 className="text-lg font-semibold">Filtros</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  aria-label={isFilterOpen ? "Fechar filtros" : "Abrir filtros"}
                >
                  {isFilterOpen ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                  )}
                </Button>
              </div>
              <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block`}>
                <div className="mb-4">
                  <h3 className="font-medium mb-2 text-sm">Disponibilidade</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={inStock}
                        onChange={(e) => setInStock(e.target.checked)}
                      />
                      <span className="text-xs">Em estoque ({products.filter(p => p.inStock !== false).length})</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={outOfStock}
                        onChange={(e) => setOutOfStock(e.target.checked)}
                      />
                      <span className="text-xs">Fora de estoque ({products.filter(p => p.inStock === false).length})</span>
                    </label>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2 text-sm">Preço</h3>
                  <div className="flex gap-2">
                    <Input
                      placeholder="R$"
                      className="text-xs"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <span className="text-gray-500 self-center text-xs">até</span>
                    <Input
                      placeholder="R$"
                      className="text-xs"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center sm:text-left">
                Dia dos Namorados
              </h1>
              <div className="flex items-center gap-2 sm:gap-4">
                <span className="text-xs sm:text-sm text-gray-600">{sortedProducts.length} produtos</span>
                <Select
  value={sortOption}
  onValueChange={(value: "featured" | "best-selling" | "alphabetical" | "price-low" | "price-high") => setSortOption(value)}
>
  <SelectTrigger className="w-40 sm:w-48 text-xs sm:text-sm">
    <SelectValue placeholder="Ordenar por" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="featured">Em destaque</SelectItem>
    <SelectItem value="best-selling">Mais vendidos</SelectItem>
    <SelectItem value="alphabetical">Ordem alfabética, A-Z</SelectItem>
    <SelectItem value="price-low">Preço, ordem crescente</SelectItem>
    <SelectItem value="price-high">Preço, ordem decrescente</SelectItem>
  </SelectContent>
</Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
              {sortedProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={400}
                      height={400}
                      className="w-full h-60 sm:h-80 object-cover"
                    />
                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex flex-col gap-2">
                      {product.hasFreteGratis && (
                        <Badge className="bg-purple-600 text-white px-2 sm:px-3 py-1 text-xs">
                          🚚 FRETE GRÁTIS
                        </Badge>
                      )}
                      {product.originalPrice > product.price && (
                        <Badge className="bg-gradient-to-r from-purple-400 to-purple-600 text-white px-2 sm:px-3 py-1 text-xs">
                          Aproveite enquanto durar o estoque, 50% off só hoje.
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-3 sm:p-4">
                    <h3 className="font-medium text-sm sm:text-base text-gray-900 mb-2 line-clamp-2">
                      {product.title}
                    </h3>
                    <StarRating rating={product.rating} reviews={product.reviews} />
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg sm:text-xl font-bold text-green-600">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs sm:text-sm text-gray-500 line-through">
                          R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-2 sm:mb-3">{product.installments}</p>
                    
                    <Button
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                    >
                      {product.inStock ? 'Adicionar ao Carrinho' : 'Fora de Estoque'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white text-black mt-12 sm:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">CENTRAL DE ATENDIMENTO</h3>
              <div className="space-y-2 text-xs sm:text-sm">
                <p>⏰ Atendimento: 24h todos os dias!</p>
                <p>📱 Contato: (33) 94042-3391</p>
                <p>📧 Email: verdeemaisfloricultura@gmail.com</p>
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">FORMAS DE PAGAMENTO</h3>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { name: "Pix", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbnhg5GcQ21eix780t2zVkFTIPmvfEPa1Sx2EwM6oxgg&s" }
                ].map((method) => (
                  <div key={method.name} className="bg-gray-200 rounded p-2">
                    <Image
                      src={method.icon}
                      alt={method.name}
                      width={48}
                      height={36}
                      className="w-12 h-9 object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">LOJA VERIFICADA</h3>
              <div className="flex gap-3 sm:gap-4">
                <div className="bg-gray-200 rounded p-1 sm:p-2">
                  <div className="w-10 sm:w-12 h-6 sm:h-8 bg-gray-300 rounded"></div>
                </div>
                <div className="bg-gray-200 rounded p-1 sm:p-2">
                  <div className="w-10 sm:w-12 h-6 sm:h-8 bg-gray-300 rounded"></div>
                </div>
                <div className="bg-gray-200 rounded p-1 sm:p-2">
                  <div className="w-10 sm:w-12 h-6 sm:h-8 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          </div>
          <Separator className="my-6 sm:my-8 bg-gray-300" />
          <div className="text-center text-xs sm:text-sm text-black">
            <p>© 2025 Verde Mais | Todos os direitos reservados.</p>
            <p>R. Cap. José Verdi, 1421 | São José do Rio Preto, SP </p>
          </div>
        </div>
      </footer>
    </div>
  );
}