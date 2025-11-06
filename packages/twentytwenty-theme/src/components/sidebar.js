import React, { useState, useEffect } from "react";
import { connect, styled } from "frontity";
import Link from "./link";
import { getWpBaseUrl } from "../utils";

const Sidebar = ({ state, actions, isOpen, closeSidebar }) => {
  const [categories, setCategories] = useState([]);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${getWpBaseUrl(state)}/wp-json/wc/v3/products/categories?per_page=100&consumer_key=ck_2732dde9479fa4adf07d8c7269ae22f39f2c74a5&consumer_secret=cs_14996e7e8eed396bced4ac30a0acfd9fea836214`
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleLinkClick = () => {
    closeSidebar();
  };

  return (
    <SidebarContainer className={isOpen ? "isOpen" : ""}>
      <CloseButton onClick={closeSidebar}>&times;</CloseButton>
      <Menu>
        <MenuItem onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}>
          CATEGORIES
        </MenuItem>
        {isCategoriesOpen && (
          <SubMenu>
            {categories.map((category) => (
              <SubMenuItem key={category.id}>
                <Link
                  link={`/product-category/${category.slug}/`}
                  onClick={handleLinkClick}
                >
                  {category.name}
                </Link>
              </SubMenuItem>
            ))}
          </SubMenu>
        )}
        <MenuItem>
          <Link link="/my-account" onClick={handleLinkClick}>
            Profile
          </Link>
        </MenuItem>
        <ContrastMenuItem>
          <Link link="/friends/" onClick={handleLinkClick}>
            Friends
          </Link>
        </ContrastMenuItem>
        <SupportInfo>
          <p>TRACK, RETURN AND SUPPORT RELATED QUERIES</p>
          <p>
            <a href="tel:+918209544626">&#128222; +91 8209544626</a>
          </p>
          <p>
            <a href="mailto:croscrowteam@gmail.com">&#128231; croscrowteam@gmail.com</a>
          </p>
        </SupportInfo>
      </Menu>
    </SidebarContainer>
  );
};

export default connect(Sidebar);

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100%;
  background: #000;
  z-index: 1000;
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
  box-shadow: -2px 0 5px rgba(0,0,0,0.1);
  overflow-y: auto;

  &.isOpen {
    transform: translateX(0);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #fff;
`;

const Menu = styled.ul`
  list-style: none;
  padding: 1rem 0;
  margin: 0;
  margin-top: 3rem;
`;

const MenuItem = styled.li`
  margin: 0.5rem;
  background: #000;
  border: 1px solid #fff;
  color: #fff;
  padding: 1rem;
  cursor: pointer;
  text-transform: uppercase;
  font-size: 1.2rem;
  font-weight: 500;
  text-align: center;

  a {
    color: #fff;
    text-decoration: none;
  }
`;

const SubMenu = styled.ul`
  list-style: none;
  padding-left: 0;
  margin: 0.5rem;
`;

const SubMenuItem = styled.li`
  margin: 0.2rem 0;
  background: #000;
  border: 1px solid #fff;
  color: #fff;
  padding: 0.8rem;
  cursor: pointer;
  font-size: 1rem;
  text-align: center;

  a {
    color: #fff;
    text-decoration: none;
  }
`;

const ContrastMenuItem = styled(MenuItem)`
  background: #fff;
  color: #000;
  border: 1px solid #000;

  a {
    color: #000;
  }
`;

const SupportInfo = styled.div`
  color: #fff;
  text-align: center;
  padding: 1rem;
  font-size: 0.9rem;

  p {
    margin: 0.5rem 0;
  }

  a {
    color: #fff;
    text-decoration: none;
  }
`;
