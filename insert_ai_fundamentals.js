import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://zdrpedswwvzopetjerli.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-here';

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertAIFundamentals() {
  try {
    console.log('🛠️ Inserting AI Fundamentals topic into Supabase...');
    
    const { data, error } = await supabase
      .from('topics')
      .upsert([
        {
          slug: 'ai-fundamentals',
          title: 'AI Fundamentals',
          subject: 'Artificial Intelligence Basics',
          summary: 'Learn the basics of Artificial Intelligence including key concepts like machine learning, neural networks, and ethical AI. Explore foundational resources and communities to grow your knowledge.',
          lessons: [
            {
              title: 'What is AI?',
              content: 'AI refers to the simulation of human intelligence in machines that are programmed to think and learn.',
              duration: '5 min'
            },
            {
              title: 'Types of AI',
              content: 'Learn about Narrow AI, General AI, and Superintelligent AI.',
              duration: '8 min'
            },
            {
              title: 'Machine Learning Basics',
              content: 'Understanding supervised, unsupervised, and reinforcement learning.',
              duration: '10 min'
            }
          ],
          games: [
            {
              type: 'flashcard',
              title: 'AI Key Concepts',
              description: 'Test your knowledge of AI fundamentals'
            },
            {
              type: 'quiz',
              title: 'Test Your AI Basics',
              description: 'Multiple choice questions about AI concepts'
            }
          ],
          flashcards: [
            {
              question: 'What does AI stand for?',
              answer: 'Artificial Intelligence'
            },
            {
              question: 'What is Machine Learning?',
              answer: 'A subset of AI that enables computers to learn without being explicitly programmed'
            },
            {
              question: 'What is a Neural Network?',
              answer: 'A computing system inspired by biological neural networks in human brains'
            }
          ],
          quizzes: [
            {
              question: 'Which type of AI is designed to perform a specific task?',
              options: ['General AI', 'Narrow AI', 'Superintelligent AI', 'Weak AI'],
              correct: 1
            },
            {
              question: 'What is the main difference between AI and traditional programming?',
              options: ['AI is faster', 'AI can learn from data', 'AI is cheaper', 'AI uses more memory'],
              correct: 1
            }
          ],
          learningResources: {
            youtube: [
              {
                name: 'CrashCourse AI Series',
                url: 'https://www.youtube.com/playlist?list=PL8dPuuaLjXtOfse2ncvffeelTrqvhrz8H'
              },
              {
                name: '3Blue1Brown Neural Networks',
                url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi'
              }
            ],
            websites: [
              {
                name: 'DeepLearning.AI',
                url: 'https://www.deeplearning.ai/'
              },
              {
                name: 'Coursera Machine Learning',
                url: 'https://www.coursera.org/learn/machine-learning'
              }
            ],
            communities: [
              {
                name: 'Artificial Intelligence Community',
                url: 'https://www.facebook.com/groups/ArtificialIntelligenceGroup'
              },
              {
                name: 'r/MachineLearning',
                url: 'https://www.reddit.com/r/MachineLearning/'
              }
            ],
            influencers: [
              {
                name: 'Andrew Ng on LinkedIn',
                url: 'https://www.linkedin.com/in/andrewyng/'
              },
              {
                name: 'Yann LeCun',
                url: 'https://www.linkedin.com/in/yann-lecun-0a7034a/'
              }
            ]
          }
        }
      ])
      .select();

    if (error) {
      console.error('❌ Error inserting AI Fundamentals:', error);
      return;
    }

    console.log('✅ Successfully inserted AI Fundamentals topic:', data);
    console.log('📝 Topic data structure:', JSON.stringify(data[0], null, 2));
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

// Run the insertion
insertAIFundamentals(); 