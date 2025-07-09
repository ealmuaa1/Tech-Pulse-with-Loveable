export interface ProductHuntTool {
  id: string;
  name: string;
  tagline: string;
  url: string;
  image: string;
  makers: string[];
  votes: number;
  createdAt: string;
  tags: string[];
}

interface ProductHuntResponse {
  data?: {
    posts: {
      edges: Array<{
        node: {
          id: string;
          name: string;
          tagline: string;
          url: string;
          thumbnail: {
            url: string;
          };
          createdAt: string;
          makers: Array<{
            name: string;
            username: string;
          }>;
          topics: Array<{
            name: string;
          }>;
          votesCount: number;
        };
      }>;
    };
  };
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: string[];
  }>;
}

const PRODUCT_HUNT_API_URL = "https://api.producthunt.com/v2/api/graphql";

export async function fetchProductHuntTools(): Promise<ProductHuntTool[]> {
  const query = `
    query {
      posts(order: VOTES, first: 10, topic: "tech") {
        edges {
          node {
            id
            name
            tagline
            url
            thumbnail { url }
            createdAt
            makers { name username }
            topics {
              edges {
                node {
                  name
                }
              }
            }
            votesCount
          }
        }
      }
    }
  `;

  const response = await fetch(PRODUCT_HUNT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer Mh7KWhy3xYhb-LFh_AvHCDjoq1VeZd3KEuOMzU_p2Ko",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      console.error(
        "Error: Unauthorized access to Product Hunt API. Check your developer token."
      );
      throw new Error(
        "Unauthorized: Please check your Product Hunt API token."
      );
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json = await response.json();

  if (json.errors) {
    console.error("GraphQL errors:", json.errors);
    throw new Error(`GraphQL error: ${JSON.stringify(json.errors)}`);
  }

  return json.data.posts.edges.map(({ node }: any) => ({
    id: node.id,
    name: node.name,
    tagline: node.tagline,
    url: node.url,
    image: node.thumbnail.url,
    makers: node.makers.map((m: { name: any }) => m.name),
    votes: node.votesCount,
    createdAt: node.createdAt,
    tags: node.topics.edges.map(
      (edge: { node: { name: any } }) => edge.node.name
    ),
  }));
}

// Example usage:
// const tools = await fetchProductHuntTools();
// console.log(tools);
