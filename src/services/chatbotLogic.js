import { db } from '../firebaseConfig';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

// --- THE ADVANCED CONVERSATION TREE ---
const conversationTree = {
  'initial': {
    response: "Hello! I'm the Hostel Helper. What can I guide you through today?",
    pills: ['Content & Posting', 'Community Features', 'My Profile & Account']
  },
  
  // --- LEVEL 1: Main Categories ---
  'Content & Posting': {
    response: "Great! Content is the heart of our community. What do you need help with?",
    pills: ['How do I create a post?', 'What are the post categories?', 'Why was my post not approved?', 'Back to main menu', 'Contact Admin']
  },
  'Community Features': {
    response: "Connecting with others is key. Which feature would you like to know more about?",
    pills: ["What is the 'Batchmates' page?", "What is the 'Find Seniors' page?", "How does the 'Help' section work?", 'Back to main menu', 'Contact Admin']
  },
  'My Profile & Account': {
    response: "Your profile is your identity here. What would you like to do?",
    pills: ['How do I edit my profile?', 'How do I upload a profile picture?', 'How do I reset my password?', 'Back to main menu', 'Contact Admin']
  },

  // --- LEVEL 2: Detailed Questions & Answers ---
  'How do I create a post?': {
    response: 'Simple! Click the green "+ Create a Post" button on your dashboard. This will take you to a page where you can choose the category of content you want to create.',
    pills: ['What are the post categories?', 'Back to main menu', 'Contact Admin']
  },
  'What are the post categories?': {
    response: "You can post Study Materials, Events, Success Stories, Opportunities, and more. Admins can also post special Notices. Most posts require admin approval before they are visible.",
    pills: ['How do I create a post?', 'Back to main menu', 'Contact Admin']
  },
  'Why was my post not approved?': {
    response: "Posts may be rejected if they violate community guidelines or are not relevant. If your post was rejected, it is removed. Feel free to try submitting it again after making changes.",
    pills: ['Back to main menu', 'Contact Admin']
  },
  "What is the 'Batchmates' page?": {
    response: "The 'Batchmates' page shows you a list of all other students who joined the hostel in the same year as you.",
    pills: ["What is the 'Find Seniors' page?", 'Back to main menu', 'Contact Admin']
  },
  "What is the 'Find Seniors' page?": {
    response: "The 'Find Seniors' page is a full hostel directory, showing you all approved students from all batches.",
    pills: ["What is the 'Batchmates' page?", 'Back to main menu', 'Contact Admin']
  },
  "How does the 'Help' section work?": {
    response: "The Help section is a Q&A forum. Anyone can ask a question, and anyone can answer. Questions appear instantly without admin approval.",
    pills: ['Back to main menu', 'Contact Admin']
  },
  'How do I edit my profile?': {
    response: 'Go to your <a href="/profile">Profile Page</a> by clicking your profile icon in the header. Then, click the "Edit Profile" button to change your text information.',
    pills: ['How do I upload a profile picture?', 'Back to main menu', 'Contact Admin']
  },
  'How do I upload a profile picture?': {
    response: 'On your <a href="/profile">Profile Page</a>, click "Edit Profile." Then, click on the profile picture circle itself to open the file selector and choose an image.',
    pills: ['How do I edit my profile?', 'Back to main menu', 'Contact Admin']
  },
  'How do I reset my password?': {
    response: 'If you are logged out, you can click the "Forgot Password?" link on the <a href="/login">Login Page</a>.',
    pills: ['Back to main menu', 'Contact Admin']
  },

  // --- Utility Responses ---
  'Back to main menu': {
    response: "Is there anything else I can help you with?",
    pills: ['Content & Posting', 'Community Features', 'My Profile & Account']
  },
  'Contact Admin': {
    response: "If you need further assistance, please contact the hostel warden directly.",
    pills: ['Back to main menu']
  }
};

// This function now navigates the conversation tree
export async function getResponse(message) {
  const lowerCaseMessage = message.toLowerCase();

  // Check if the message is a direct key in our tree
  const directMatch = Object.keys(conversationTree).find(key => key.toLowerCase() === lowerCaseMessage);
  if (directMatch) {
    return conversationTree[directMatch];
  }

  // Fallback to simple keyword search for books
  if (lowerCaseMessage.includes('book') || lowerCaseMessage.includes('notes')) {
    const searchTerms = lowerCaseMessage.replace('find a book about', '').replace('book', '').replace('notes', '').trim();
    const searchResult = await searchForPost(searchTerms);
    return { response: searchResult, pills: conversationTree['Back to main menu'].pills };
  }
  
  // If no match, return to the initial state
  return { 
    response: "I'm sorry, I didn't understand that. Please choose from the options below.",
    pills: conversationTree['initial'].pills 
  };
}

// Helper function to search Firestore
async function searchForPost(title) {
  try {
    const q = query(
      collection(db, "posts"), 
      where("title", ">=", title),
      where("title", "<=", title + '\uf8ff'),
      where("status", "==", "approved"),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return `Yes, I found something that might match: <a href="/post/${doc.id}">${doc.data().title}</a>.`;
    } else {
      return `Sorry, I couldn't find any approved materials with the title "${title}".`;
    }
  } catch (error) {
    console.error("Error searching posts:", error);
    return "I had trouble searching the database. Please try again later.";
  }
}