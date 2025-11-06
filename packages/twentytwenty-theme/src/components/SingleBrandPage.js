import React, { useEffect, useState } from "react";
import { connect, styled } from "frontity";
import Link from "@frontity/components/link";
import Loading from "./loading";
import {
  getWpBaseUrl,
  consumer_key,
  consumer_secret
} from "../utils";

const SingleBrandPage = ({ state, actions }) => {
  const [brandData, setBrandData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Get brand slug from URL
  const brandSlug = state.router.link.split('/brand/')[1]?.replace('/', '');

  useEffect(() => {
    const fetchBrandData = async () => {
      if (!brandSlug) return;

      try {
        setLoading(true);

        // Fetch brand details
        const brandResponse = await fetch(
          `${getWpBaseUrl(state)}/wp-json/wp/v2/product_brand?slug=${brandSlug}`
        );
        const brandData = await brandResponse.json();

        if (brandData.length > 0) {
          setBrandData(brandData[0]);

          // Fetch products for this brand
          const productsResponse = await fetch(
            `${getWpBaseUrl(state)}/wp-json/wp/v2/product?product_brand=${brandData[0].id}&per_page=50&_embed`
          );

          console.log("Response OK?", productsResponse.ok);
          console.log("Status Code:", productsResponse.status);
          console.log("Response Headers:", [...productsResponse.headers]);

          const productsData = await productsResponse.json();
          console.log("Products JSON:", productsData);
          setProducts(productsData);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching brand data:", error);
        setLoading(false);
      }
    };

    fetchBrandData();
  }, [brandSlug]);

  const parsePriceHTML = (priceHtml) => {
    if (!priceHtml) return { regularPrice: '', salePrice: '' };

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = priceHtml;

    const regularPrice = tempDiv.querySelector('del .woocommerce-Price-amount')?.textContent || '';
    const salePrice = tempDiv.querySelector('ins .woocommerce-Price-amount')?.textContent ||
      tempDiv.querySelector('.woocommerce-Price-amount')?.textContent || '';

    return { regularPrice, salePrice };
  };

  const filteredProducts = products.filter(product =>
    product?.title?.rendered?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;

  if (!brandData) return <ErrorContainer>Brand not found</ErrorContainer>;

  return (
    <Container>
      {/* Header Section */}
      <HeaderSection>
        <BackButton onClick={() => actions.router.set("/brands/")}>
          ← Back to All Brands
        </BackButton>
        <BrandTitle>{brandData.name}</BrandTitle>
        <BrandSubtitle>DISCOVER PRODUCTS FROM {brandData.name.toUpperCase()}</BrandSubtitle>

        {brandData.description && (
          <BrandDescription
            dangerouslySetInnerHTML={{ __html: brandData.description }}
          />
        )}
      </HeaderSection>

      {/* Search Section */}
      <SearchSection>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchButton>🔍</SearchButton>
        </SearchContainer>
        <ProductCount>
          {filteredProducts.length} PRODUCT{filteredProducts.length !== 1 ? 'S' : ''} FOUND
        </ProductCount>
      </SearchSection>

      {/* Products Section */}
      <ProductsSection>
        {filteredProducts.length > 0 ? (
          <ProductGrid>
            {filteredProducts.map((product) => {
              const { regularPrice, salePrice } = parsePriceHTML(product?.price_html);

              return (
                <Link style={{ textDecoration: "none" }} key={product.id} link={`/product/${product.slug}/`}>
                  <ProductCard>
                    <ProductImageContainer>
                      {product._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
                        <ProductImage
                          src={product._embedded['wp:featuredmedia'][0].source_url}
                          alt={product.title?.rendered || 'Product'}
                        />
                      ) : (
                        <ProductImagePlaceholder>No Image</ProductImagePlaceholder>
                      )}
                    </ProductImageContainer>
                    <ProductInfo>
                      <ProductName>{product.title?.rendered}</ProductName>

                      {/* ✅ Cleaned price display */}
                      <ProductPrice>
                        {regularPrice && (
                          <span style={{ textDecoration: 'line-through', marginRight: '8px' }}>
                            {regularPrice}
                          </span>
                        )}
                        <span>{salePrice}</span>
                      </ProductPrice>
                    </ProductInfo>
                  </ProductCard>
                </Link>
              );
            })}

          </ProductGrid>
        ) : (
          <NoProducts>
            <NoProductsIcon>📦</NoProductsIcon>
            <NoProductsText>
              {searchTerm ?
                `No products found matching "${searchTerm}"` :
                `No products found for ${brandData.name}`
              }
            </NoProductsText>
            {searchTerm && (
              <ClearSearchButton onClick={() => setSearchTerm("")}>
                CLEAR SEARCH
              </ClearSearchButton>
            )}
          </NoProducts>
        )}
      </ProductsSection>
    </Container>
  );
};

export default connect(SingleBrandPage);

// Styling
const Container = styled.div`
  min-height: 100vh;
  background: #f8f8f8;
  padding: 0;
`;

const LoadingContainer = styled.div`
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #666;
`;

const ErrorContainer = styled.div`
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #e74c3c;
`;

const HeaderSection = styled.div`
  background: white;
  padding: 2rem;
  text-align: center;
  border-bottom: 1px solid #eee;
  
  @media (max-width: 768px) {
    padding: 0;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 0.9rem;
  cursor: pointer;
  margin-bottom: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: #000;
  }
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const BrandTitle = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin: 0 0 0.5rem 0;
  color: #000;
  letter-spacing: -1px;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const BrandSubtitle = styled.p`
  color: #666;
  font-size: 0.9rem;
  letter-spacing: 1px;
  margin: 0 0 1.5rem 0;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const BrandDescription = styled.div`
  max-width: 600px;
  margin: 0 auto;
  color: #555;
  line-height: 1.6;
  font-size: 1rem;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const SearchSection = styled.div`
  background: white;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #eee;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const SearchContainer = styled.div`
  max-width: 500px;
  margin: 0 auto 1rem auto;
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 3rem 0.75rem 1rem;
  border: 2px solid #eee;
  border-radius: 0;
  font-size: 1rem;
  outline: none;
  
  &:focus {
    border-color: #000;
  }
  
  &::placeholder {
    color: #999;
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  background: #000;
  color: white;
  border: none;
  padding: 0 1rem;
  cursor: pointer;
  
  &:hover {
    background: #333;
  }
`;

const ProductCount = styled.div`
  text-align: center;
  color: #666;
  font-size: 0.8rem;
  letter-spacing: 1px;
  font-weight: 500;
`;

const ProductsSection = styled.div`
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  
  @media screen and (min-width: 768px) and (max-width: 1024px) {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem;
  }
`;

const ProductCard = styled.div`
  // background: white;
  border-radius: 0;
  overflow: hidden;
  // box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
`;

const ProductImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  
  @media (max-width: 480px) {
    height: 200px;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
`;

const ProductImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  color: #999;
  font-size: 0.9rem;
`;

const ProductInfo = styled.div`
  padding: 10px 0 0 0;
  
  @media (max-width: 480px) {
    padding: 12px 0 0 0;
  }
`;

const ProductName = styled.h3`
  font-size: 13px;
  margin: 0 0 0.5rem 0;
  color: #000;
  font-weight: 300;
  line-height: 1.3;
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const ProductPrice = styled.div`
  font-weight: 300;
  color: #000;
  font-size: 13px;
  margin-bottom: 1rem;
  
  .woocommerce-Price-amount {
    color: #000;
  }
`;

const NoProducts = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  max-width: 500px;
  margin: 0 auto;
  
  @media (max-width: 480px) {
    padding: 3rem 1rem;
  }
`;

const NoProductsIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  
  @media (max-width: 480px) {
    font-size: 3rem;
  }
`;

const NoProductsText = styled.p`
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const ClearSearchButton = styled.button`
  background: #000;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  font-size: 0.8rem;
  font-weight: bold;
  letter-spacing: 1px;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: #333;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.75rem;
  }
`;