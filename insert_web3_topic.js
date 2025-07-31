const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function insertWeb3Topic() {
  try {
    console.log("🚀 Starting Web3 topic insert...");

    const { data, error } = await supabase
      .from("topics")
      .upsert([
        {
          slug: "web3-dapps-ethereum",
          title: "Web3 & DApps on Ethereum",
          subject: "Blockchain Development",
          summary:
            "Learn to build decentralized applications (DApps) on Ethereum blockchain. Master smart contracts, Web3.js, and DeFi protocols.",
          lessons: [
            {
              title: "Introduction to Web3",
              content:
                "Web3 represents the next evolution of the internet, built on blockchain technology and decentralized protocols.",
              duration: "15 min",
            },
            {
              title: "Ethereum Fundamentals",
              content:
                "Understand Ethereum blockchain, smart contracts, and the EVM (Ethereum Virtual Machine).",
              duration: "20 min",
            },
            {
              title: "Building DApps",
              content:
                "Learn to create decentralized applications using Solidity, Web3.js, and MetaMask.",
              duration: "25 min",
            },
          ],
          games: [
            {
              type: "flashcard",
              title: "Web3 Key Concepts",
              description:
                "Test your knowledge of blockchain and Web3 fundamentals",
            },
            {
              type: "quiz",
              title: "Ethereum & DApps Quiz",
              description: "Multiple choice quiz covering Ethereum development",
            },
          ],
          flashcards: [
            {
              question: "What is Web3?",
              answer:
                "The next generation of the internet built on blockchain technology and decentralized protocols",
            },
            {
              question: "What is a DApp?",
              answer:
                "Decentralized Application - runs on blockchain instead of centralized servers",
            },
            {
              question: "What is Solidity?",
              answer:
                "Programming language for writing smart contracts on Ethereum",
            },
          ],
          quizzes: [
            {
              question: "What does EVM stand for?",
              options: [
                "Ethereum Virtual Machine",
                "Ethereum Value Market",
                "Ethereum Version Manager",
              ],
              correct: "Ethereum Virtual Machine",
            },
            {
              question: "What is a smart contract?",
              options: [
                "A legal document",
                "Self-executing code on blockchain",
                "A cryptocurrency wallet",
              ],
              correct: "Self-executing code on blockchain",
            },
          ],
          learningResources: {
            youtube: [
              {
                name: "Ethereum Development Course",
                url: "https://www.youtube.com/watch?v=8RoR0AePVqs",
              },
              {
                name: "Web3.js Tutorial",
                url: "https://www.youtube.com/watch?v=7O1sKJwUFEI",
              },
            ],
            websites: [
              {
                name: "Ethereum.org",
                url: "https://ethereum.org/developers/",
              },
              {
                name: "OpenZeppelin",
                url: "https://openzeppelin.com/",
              },
            ],
            communities: [
              {
                name: "r/ethereum",
                url: "https://www.reddit.com/r/ethereum/",
              },
              {
                name: "Ethereum Stack Exchange",
                url: "https://ethereum.stackexchange.com/",
              },
            ],
            influencers: [
              {
                name: "Vitalik Buterin",
                url: "https://twitter.com/VitalikButerin",
              },
              {
                name: "Andreas Antonopoulos",
                url: "https://twitter.com/aantonop",
              },
            ],
          },
        },
      ])
      .select();

    if (error) {
      console.error("❌ Insert error:", error);
      console.error("Error code:", error.code);
    } else {
      console.log("✅ Web3 topic insert successful!");
      console.log("📊 Inserted data:", data);
    }
  } catch (err) {
    console.error("❌ Unexpected error:", err);
  }
}

insertWeb3Topic();
