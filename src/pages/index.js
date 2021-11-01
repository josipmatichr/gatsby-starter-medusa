import React from "react";
import { graphql } from "gatsby";
import ProductGrid from "../components/product/product-grid";

// markup
const IndexPage = ({ data }) => {
  const {
    allMedusaProducts: { edges },
  } = data;
  const products = edges.map((e) => e.node);
  return <ProductGrid products={products} />;
};

export const query = graphql`
  {
    allMedusaProducts(limit: 3) {
      pageInfo {
        hasNextPage
      }
      edges {
        node {
          handle
          title
          thumbnail {
            childImageSharp {
              gatsbyImageData
            }
          }
          images {
            image {
              childImageSharp {
                gatsbyImageData
              }
            }
          }
        }
      }
    }
  }
`;

export default IndexPage;
