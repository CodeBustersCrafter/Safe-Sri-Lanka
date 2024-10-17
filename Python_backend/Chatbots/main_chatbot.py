import os
import time
from openai import OpenAI
from dotenv import load_dotenv
from tavily import TavilyClient
from langchain.memory import ConversationBufferMemory
import google.generativeai as genai
from sentence_transformers import SentenceTransformer
from huggingface_hub import InferenceClient
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    agent: str

@app.post("/chat")
def chat_endpoint(request: ChatRequest):
    try:
        print(f"Received message: {request.message}")
        response, agent = generate_response(request.message)
        return ChatResponse(response=response, agent=agent)
    except Exception as e:
        print(f"Error in chat_endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

load_dotenv()

similarity_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

def initialize_clients():
    try:
        Nvidia_api_key = os.getenv("NVIDIA_API_KEY")
        if not Nvidia_api_key:
            raise ValueError("NVIDIA_API_KEY is not set in the environment variables.")
        Nvidia_client = OpenAI(
            base_url="https://integrate.api.nvidia.com/v1",
            api_key=Nvidia_api_key
        )
        
        tavily_api_key = os.getenv("TAVILY_API_KEY")
        if not tavily_api_key:
            raise ValueError("TAVILY_API_KEY is not set in the environment variables.")
        tavily_client = TavilyClient(tavily_api_key)
        
        gemini_api_key = os.getenv("GEMINI_API_KEY")
        if not gemini_api_key:
            raise ValueError("GEMINI_API_KEY is not set in the environment variables.")
        genai.configure(api_key=gemini_api_key)
        
        generation_config = {
            "temperature": 0.7,
            "top_p": 0.9,
            "top_k": 40,
            "max_output_tokens": 4096,
            "response_mime_type": "text/plain",
        }
        
        gemini_model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config=generation_config,
        )    

        memory = ConversationBufferMemory(return_messages=True)
        
        return Nvidia_client, tavily_client, memory, gemini_model
    
    except Exception as e:
        print(f"Error in initialize_clients: {str(e)}")
        raise

def get_vector_stores():
    try:
        script_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.realpath(__file__))))
        vector_dbs_dir = os.path.join(script_dir, "Python_backend", "Vector_databases")

        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

        emergency_vector_store = FAISS.load_local(os.path.join(vector_dbs_dir, "emergency_response_agent_vector_db"), embeddings, allow_dangerous_deserialization=True)
        legal_vector_store = FAISS.load_local(os.path.join(vector_dbs_dir, "legal_support_agent_vector_db"), embeddings, allow_dangerous_deserialization=True)
        mental_vector_store = FAISS.load_local(os.path.join(vector_dbs_dir, "mental_health_support_agent_vector_db"), embeddings, allow_dangerous_deserialization=True)
        self_defence_vector_store = FAISS.load_local(os.path.join(vector_dbs_dir, "self_defence_advice_agent_vector_db"), embeddings, allow_dangerous_deserialization=True)

        return emergency_vector_store, legal_vector_store, mental_vector_store, self_defence_vector_store
    except Exception as e:
        print(f"Error in get_vector_stores: {str(e)}")
        raise

def retrieve_context(query, vector_store, top_k=10):
    try:
        results = vector_store.similarity_search_with_score(query, k=top_k)
        weighted_context = ""
        for doc, score in results:
            weighted_context += f"{doc.page_content} (relevance: {score})\n\n"
        return weighted_context
    except Exception as e:
        print(f"Error in retrieve_context: {str(e)}")
        raise

def generate_response(prompt):
    try:
        start = time.time()
        Nvidia_client, tavily_client, memory, gemini_model = initialize_clients()
        emergency_vector_store, legal_vector_store, mental_vector_store, self_defence_vector_store = get_vector_stores()

        def get_gemini_response(last_prompt, system_prompt):
            try:
                chat_session = gemini_model.start_chat()
                final_prompt = f""" 
                role: system, content: {system_prompt}
                role: user, content: {last_prompt}"""
                response = chat_session.send_message(final_prompt)
                return response.text
            except Exception as e:
                print(f"Error in get_gemini_response: {str(e)}")
                raise
        
        Agent = Agent_selector(Nvidia_client, prompt)
        # Agent = Agent_selector(prompt)
        print(f"Agent: {Agent}")
        if Agent == "emergency services":        
            resources = retrieve_context(prompt, emergency_vector_store)  
            system_prompt = "You are a helpful assistant that provides information about emergency services."
        elif Agent == "legal services":
            resources = retrieve_context(prompt, legal_vector_store)  
            system_prompt = "You are a helpful assistant that provides information about legal services."
        elif Agent == "mental health services":
            resources = retrieve_context(prompt, mental_vector_store)  
            system_prompt = "You are a helpful assistant that provides information about mental health services."
        elif Agent == "self-defence services":
            resources = retrieve_context(prompt, self_defence_vector_store)  
            system_prompt = "You are a helpful assistant that provides information about self-defence services."
        else:
            Agent = "general services"
            resources = ""
            system_prompt = "You are a helpful assistant that provides information about general services."

        history = memory.load_memory_variables({})
        history_context = "\n".join([f"{m.type}: {m.content}" for m in history.get("history", [])])
        context = f"Conversation History:\n{history_context}\n\nContext: {resources}\n\n"
        try:
            if Agent != "general services":
                search_prompt = f"Fast-check this about {Agent}: {prompt}"
                tavily_context = tavily_client.search(query=search_prompt, search_depth="advanced", max_results=5)
                tavily_context_results = []
                for result in tavily_context['results']:
                    if 'title' in result and 'content' in result:
                        tavily_context_results.append({
                        'title': result['title'],
                        'content': result['content']
                        })
                context += f"Additional Context: {tavily_context_results}\n\n"
            else:
                search_prompt = f"Fast-check this about: {prompt}"
                tavily_context = tavily_client.search(query=search_prompt)
                tavily_context_results = []
                for result in tavily_context['results']:
                    if 'title' in result and 'content' in result:
                        tavily_context_results.append({
                        'title': result['title'],
                        'content': result['content']
                        })
                context += f"Additional Context: {tavily_context_results}\n\n"
        except Exception as e:
            print(f"Error fetching Tavily context: {e}")
            context += "Additional Context: No additional context available.\n\n"

        full_prompt = f"""
        Question: {prompt}

        Instructions:
            Use the provided Context and Additional Context to inform your response.

        {context}

        Answer:
        """
        respond = get_gemini_response(full_prompt, system_prompt)
        print(f"Final Response:")
        print(respond)
        end = time.time()
        process_time = end - start
        print(f"Process time: {process_time:.2f} seconds")
        return respond, Agent
    except Exception as e:
        print(f"Error in generate_response: {str(e)}")
        raise

def Agent_selector(Nvidia_client, prompt):
    try:
        SLM_prompt = f"""
        Analyze the following prompt and categorize it based on these criteria:
        1. If it's about emergency services like ambulance, fire service, police, respond with 'emergency'.
        2. If it's about legal services like lawyer, court, law, respond with 'legal'.
        3. If it's about mental health services like psychologist, psychiatrist, counselling, respond with 'mental'.
        4. If it's about self-defence services like martial arts, self-defence training, respond with 'self-defence'.
        5. If it's related to women safety but doesn't fit the above categories, respond with 'general'.
        
        Prompt: {prompt}
        """
            
        start_time = time.time()

        completion = Nvidia_client.completions.create(
        model="nvidia/mistral-nemo-minitron-8b-base",
        prompt=SLM_prompt,
        temperature=0.7,
        top_p=0.95,
        max_tokens=200,
        stream=False
        )

        response = completion.choices[0].text
        response = response.strip().lower()
        print(f"Response: {response}]")
        end_time = time.time()
        process_time = end_time - start_time
            
        print(f"Process time to select the agent: {process_time:.2f} seconds")

        if "emergency" in response:
            return "emergency services"
        elif "legal" in response:
            return "legal services"
        elif "mental" in response:
            return "mental health services"
        elif "self-defence" in response:
            return "self-defence services"
        elif "general" in response:
            return "general services"
        else:
            return "general services"
    except Exception as e:
        print(f"Error in Agent_selector: {str(e)}")
        raise

# def Agent_selector(prompt):
#     try:
#         SLM = InferenceClient(
#             "mistralai/Mistral-7B-Instruct-v0.1",
#             token=os.getenv("HuggingFace_API_KEY"),
#         )

#         SLM_prompt = f"""
#         Analyze the following prompt and categorize it based on these criteria:
#         1. If it's about emergency services like ambulance, fire service, police, respond with 'emergency'.
#         2. If it's about legal services like lawyer, court, law, respond with 'legal'.
#         3. If it's about mental health services like psychologist, psychiatrist, counselling, respond with 'mental'.
#         4. If it's about self-defence services like martial arts, self-defence training, respond with 'self-defence'.
#         5. If it's related to women safety but doesn't fit the above categories, respond with 'general'.
        
#         Prompt: {prompt}
#         """
            
#         start_time = time.time()
            
#         SLM_response = ""
#         for message in SLM.chat_completion(
#                 messages=[{"role": "user", "content": SLM_prompt}],
#                 max_tokens=50,
#                 stream=True,
#             ):
#                 content = message.choices[0].delta.content
#                 if content:
#                     SLM_response += content 

#         end_time = time.time()
#         process_time = end_time - start_time
            
#         print(f"Process time to select the agent: {process_time:.2f} seconds")

#         response = SLM_response.strip().lower()

#         if "emergency" in response:
#             return "emergency services"
#         elif "legal" in response:
#             return "legal services"
#         elif "mental" in response:
#             return "mental health services"
#         elif "self-defence" in response:
#             return "self-defence services"
#         elif "general" in response:
#             return "general services"
#         else:
#             return "general services"
#     except Exception as e:
#         print(f"Error in Agent_selector: {str(e)}")
#         raise

# def test_agent_selector():
#     test_cases = [
#         ("I need an ambulance immediately!"),
#         ("Can you recommend a good lawyer?"),
#         ("I'm feeling depressed and need to talk to someone."),
#         ("Where can I learn self-defense techniques?"),
#         ("How can I stay safe while walking alone at night?")
#     ]

#     for prompt in test_cases:
#         result, agent = generate_response(prompt)
#         print(f"Prompt: {prompt}")
#         print(f"Result: {result}")
#         print(f"Agent: {agent}")
#         print("---")

# if __name__ == "__main__":
#     print("Testing Agent_selector function:")
#     # test_agent_selector()
#     result, agent = generate_response("I need an ambulance immediately!")
#     print("Test complete. Starting server:")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)