import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";

import { action } from "./_generated/server.js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { query } from "./_generated/server.js";


export const ingest = action({
  args: {
    splitText:v.any(),
    fileId:v.string()
  },
  handler: async (ctx,args) => {
    const metadata={fileId:args.fileId};
    await ConvexVectorStore.fromTexts(
      args.splitText,
      metadata,
      new GoogleGenerativeAIEmbeddings({
        apiKey:'AIzaSyACPvWQ_hUgFVG8r4-3S0m03nU42tZKUQY',
        model: "text-embedding-004", // 768 dimensions
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx }
    );
    return "Completed..."
  },
});

export const search = action({
  args: {
    query: v.string(),
    fileId: v.string()
  },
  handler: async (ctx, args) => {
  
      // Log received arguments
      

      // Initialize the ConvexVectorStore
      const vectorStore = new ConvexVectorStore(
        new GoogleGenerativeAIEmbeddings({
          apiKey: 'AIzaSyACPvWQ_hUgFVG8r4-3S0m03nU42tZKUQY',
          model: "text-embedding-004", // 768 dimensions
          taskType: TaskType.RETRIEVAL_DOCUMENT,
          title: "Document title",
        }), 
        { ctx }
      );

      // Perform the similarity search
      const resultOne =await(await vectorStore.similaritySearch(args.query, 1)).filter(q=>q.metadata.fileId==args.fileId);
      console.log('Raw search results:', resultOne);

      return JSON.stringify(resultOne)

      // Filter by fileId
     

      // Check if results are empty
      
      // Return the filtered results
  
    
  },
});
