const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function insertTopic() {
  try {
    console.log('🚀 Starting topic insert...');
    
    const { data, error } = await supabase
      .from('topics')
      .upsert([
        {
          slug: 'ai-fundamentals',
          title: 'AI Fundamentals',
          subject: 'Artificial Intelligence',
          summary: 'Learn the basics of Artificial Intelligence including key concepts like machine learning, neural networks, and ethical AI. Explore foundational resources and communities to grow your knowledge.',
          lessons: [
            {
              title: 'What is AI?',
              content: 'AI refers to the simulation of human intelligence in machines that are programmed to think and learn like humans. It encompasses various technologies including machine learning, natural language processing, and computer vision.',
              duration: '10 min'
            },
            {
              title: 'Types of AI',
              content: 'Learn about Narrow AI (designed for specific tasks), General AI (human-level intelligence), and Superintelligent AI (beyond human capabilities).',
              duration: '15 min'
            },
            {
              title: 'Machine Learning Basics',
              content: 'Understand supervised learning, unsupervised learning, and reinforcement learning - the three main types of machine learning.',
              duration: '20 min'
            }
          ],
          games: [
            {
              type: 'flashcard',
              title: 'AI Key Concepts',
              description: 'Test your knowledge of fundamental AI terms and concepts'
            },
            {
              type: 'quiz', 
              title: 'Test Your AI Basics',
              description: 'Multiple choice quiz covering AI fundamentals'
            }
          ],
          flashcards: [
            {
              question: 'What does AI stand for?',
              answer: 'Artificial Intelligence - the simulation of human intelligence in machines'
            },
            {
              question: 'What is Machine Learning?',
              answer: 'A subset of AI that enables machines to learn and improve from experience without being explicitly programmed'
            },
            {
              question: 'What is a Neural Network?',
              answer: 'A computing system inspired by biological neural networks, used in deep learning'
            }
          ],
          quizzes: [
            {
              question: 'Which type of AI is designed for specific tasks?',
              options: ['Narrow AI', 'General AI', 'Super AI', 'Quantum AI'],
              correct: 'Narrow AI'
            },
            {
              question: 'What is the main goal of supervised learning?',
              options: ['Find patterns in data', 'Learn from labeled examples', 'Maximize rewards', 'Cluster similar data'],
              correct: 'Learn from labeled examples'
            }
          ],
          learningResources: {
            youtube: [
              {
                name: 'CrashCourse AI Series',
                url: 'https://www.youtube.com/playlist?list=PL8dPuuaLjXtOfse2ncvffeelTrqvhrz8H'
              },
              {
                name: 'Andrew Ng - Machine Learning Course',
                url: 'https://www.youtube.com/watch?v=PPLop4L2eGk'
              }
            ],
            websites: [
              {
                name: 'DeepLearning.AI',
                url: 'https://www.deeplearning.ai/'
              },
              {
                name: 'MIT OpenCourseWare - AI',
                url: 'https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-034-artificial-intelligence-fall-2010/'
              }
            ],
            communities: [
              {
                name: 'r/MachineLearning',
                url: 'https://www.reddit.com/r/MachineLearning/'
              },
              {
                name: 'AI/ML Facebook Group',
                url: 'https://www.facebook.com/groups/ArtificialIntelligenceGroup'
              }
            ],
            influencers: [
              {
                name: 'Andrew Ng',
                url: 'https://www.linkedin.com/in/andrewyng/'
              },
              {
                name: 'Yann LeCun',
                url: 'https://www.linkedin.com/in/yann-lecun/'
              }
            ]
          }
        }
      ])
      .select();

    if (error) {
      console.error('❌ Insert error:', error);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      console.error('Error code:', error.code);
    } else {
      console.log('✅ Insert successful!');
      console.log('📊 Inserted data:', JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

insertTopic(); 