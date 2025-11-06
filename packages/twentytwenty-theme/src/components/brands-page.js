import React, { useEffect, useState } from "react";
import { connect, styled } from "frontity";
import Link from "@frontity/components/link";
import Loading from "./loading";
import {
  getWpBaseUrl,
} from "../utils";

const BrandsPage = ({ state, actions }) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        let page = 1;
        let allBrands = [];
        let hasMore = true;
    
        while (hasMore) {
          const response = await fetch(
            `${getWpBaseUrl(state)}/wp-json/wp/v2/product_brand?per_page=100&page=${page}`
          );
    
          if (!response.ok) break;
    
          const data = await response.json();
          allBrands = [...allBrands, ...data];
    
          // If fewer than 100 returned, no more pages
          hasMore = data.length === 100;
          page++;
        }
    
        setBrands(allBrands);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching brands:", error);
        setLoading(false);
      }
    };    

    fetchBrands();
  }, []);

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;

  return (
    <Container>
      {/* Header Section */}
      <HeaderSection>
        <Title>ALL BRANDS</Title>
        <Subtitle>DISCOVER YOUR FAVORITE BRANDS</Subtitle>
      </HeaderSection>

      {/* Search Section */}
      <SearchSection>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchButton>🔍</SearchButton>
        </SearchContainer>
        <BrandCount>
          {filteredBrands.length} BRAND{filteredBrands.length !== 1 ? 'S' : ''} FOUND
        </BrandCount>
      </SearchSection>

      {/* Brand Logos Section */}
      {filteredBrands.length > 0 && (
        <BrandLogosSection>
          <LogosTitle>BRAND LOGOS</LogosTitle>
          <BrandLogosGrid>
            {filteredBrands.map((brand) => (
              <BrandLogoItem key={`logo-${brand.id}`}>
                <StyledLink link={`/brand/${brand.slug}/`}>
                  <BrandLogoContainer>
                    {brand?.brand_logo ? (
                      <BrandLogo 
                        src={brand.brand_logo} 
                        alt={brand.name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <BrandLogoFallback style={{ display: brand?.brand_logo ? 'none' : 'flex' }}>
                      <BrandInitial>{brand.name.charAt(0).toUpperCase()}</BrandInitial>
                    </BrandLogoFallback>
                  </BrandLogoContainer>
                  <BrandLogoName>{brand.name}</BrandLogoName>
                </StyledLink>
              </BrandLogoItem>
            ))}
          </BrandLogosGrid>
        </BrandLogosSection>
      )}

      {/* Brands Grid */}
      <BrandsSection>
        {filteredBrands.length > 0 ? (
          <BrandGrid>
            {filteredBrands.map((brand) => (
              <BrandCard key={brand.id}>
                <StyledLink link={`/brand/${brand.slug}/`}>
                  <BrandContent>
                    <BrandName>{brand.name}</BrandName>
                    <BrandMeta>
                      <ProductCount>
                        PRODUCTS: {brand.count || 0}
                      </ProductCount>
                    </BrandMeta>
                    <BrandDescription
                      dangerouslySetInnerHTML={{
                        __html: brand.description ?
                          (brand.description.length > 100 ?
                            brand.description.substring(0, 100) + '...' :
                            brand.description) :
                          'Explore products from this brand'
                      }}
                    />
                  </BrandContent>
                  <ViewBrandButton>VIEW BRAND</ViewBrandButton>
                </StyledLink>
              </BrandCard>
            ))}
          </BrandGrid>
        ) : (
          <NoBrands>
            <NoBrandsIcon>🏷️</NoBrandsIcon>
            <NoBrandsText>
              {searchTerm ?
                `No brands found matching "${searchTerm}"` :
                'No brands found'
              }
            </NoBrandsText>
            {searchTerm && (
              <ClearSearchButton onClick={() => setSearchTerm("")}>
                CLEAR SEARCH
              </ClearSearchButton>
            )}
          </NoBrands>
        )}
      </BrandsSection>
    </Container>
  );
};

export default connect(BrandsPage);

// Styling
const Container = styled.div`
  min-height: 100vh;
  background: #f8f8f8;
`;

const HeaderSection = styled.div`
  background: white;
  padding: 3rem 2rem;
  text-align: center;
  border-bottom: 1px solid #eee;
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin: 0 0 0.5rem 0;
  color: #000;
  letter-spacing: -1px;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 0.9rem;
  letter-spacing: 1px;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
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
  font-size: 12px;
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

const BrandCount = styled.div`
  text-align: center;
  color: #666;
  font-size: 12px;
  letter-spacing: 1px;
  font-weight: 500;
`;

const BrandsSection = styled.div`
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const BrandGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }

  @media screen and (min-width: 768px) and (max-width: 1024px) {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem;
  }
`;

const BrandCard = styled.div`
  background: white;
  border-radius: 0;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }
`;

const StyledLink = styled(Link)`
  display: block;
  text-decoration: none;
  color: inherit;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const BrandLogoContainer = styled.div`
  height: 120px;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
  margin-bottom: 2px;
`;

const BrandLogo = styled.img`
  max-height: 80px;
  max-width: 200px;
  width: auto;
  height: auto;
  object-fit: contain;
  filter: grayscale(20%);
  transition: filter 0.3s ease, transform 0.3s ease;
  
  ${BrandCard}:hover & {
    filter: grayscale(0%);
    transform: scale(1.05);
  }
`;

const BrandLogoFallback = styled.div`
  width: 80px;
  height: 80px;
  background: #000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  
  ${BrandCard}:hover & {
    transform: scale(1.1);
  }
`;

const BrandInitial = styled.span`
  color: white;
  font-size: 2rem;
  font-weight: bold;
  letter-spacing: 0;
`;

const BrandContent = styled.div`
  padding: 2rem;
  flex: 1;
  
  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

const BrandName = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 0 0.5rem 0;
  color: #000;
  letter-spacing: -0.5px;
  
  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

const BrandMeta = styled.div`
  margin-bottom: 1rem;
`;

const ProductCount = styled.span`
  color: #666;
  font-size: 12px;
  letter-spacing: 1px;
  font-weight: 500;
`;

const BrandDescription = styled.div`
  color: #555;
  line-height: 1.5;
  font-size: 14px;
`;

const ViewBrandButton = styled.div`
  background: #000;
  color: white;
  padding: 1rem 2rem;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 1px;
  transition: background 0.3s ease;
  
  ${BrandCard}:hover & {
    background: #333;
  }
`;

const NoBrands = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  max-width: 500px;
  margin: 0 auto;
  
  @media (max-width: 480px) {
    padding: 3rem 1rem;
  }
`;

const NoBrandsIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  
  @media (max-width: 480px) {
    font-size: 3rem;
  }
`;

const NoBrandsText = styled.p`
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

const BrandLogosSection = styled.div`
  background: white;
  padding: 2rem;
  border-bottom: 1px solid #eee;
  margin-bottom: 0;
  
  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

const LogosTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 0 1.5rem 0;
  color: #000;
  text-align: center;
  letter-spacing: 1px;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }
`;

const BrandLogosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.8rem;
  }
`;

const BrandLogoItem = styled.div`
  text-align: center;
`;

const BrandLogoName = styled.div`
  margin-top: 0.5rem;
  font-size: 11px;
  color: #666;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  
  @media (max-width: 768px) {
    font-size: 10px;
    margin-top: 0.3rem;
  }
`;