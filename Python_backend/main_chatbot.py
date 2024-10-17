import os
import time
import asyncio
from openai import AsyncOpenAI
from dotenv import load_dotenv
from tavily import Client as TavilyClient
from langchain.memory import ConversationBufferMemory
import google.generativeai as genai
from sentence_transformers import SentenceTransformer
from huggingface_hub import InferenceClient
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    agent: str

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        response, agent = await generate_response(request.message)
        return ChatResponse(response=response, agent=agent)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

load_dotenv()

similarity_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

def initialize_clients():
    LLAMA_api_key = os.getenv("LLAMA_API_KEY")
    if not LLAMA_api_key:
        raise ValueError("LLAMA is not set in the environment variables.")
    LLAMA_client = AsyncOpenAI(
        base_url="https://integrate.api.nvidia.com/v1",
        api_key=LLAMA_api_key
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
    
    return LLAMA_client, tavily_client, memory, gemini_model

async def get_vector_stores():
    script_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.realpath(__file__))))
    vector_dbs_dir = os.path.join(script_dir, "Safe-Sri-Lanka", "Python_backend", "Vector_databases")

    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

    emergency_vector_store = FAISS.load_local(os.path.join(vector_dbs_dir, "emergency_response_agent_vector_db"), embeddings, allow_dangerous_deserialization=True)
    legal_vector_store = FAISS.load_local(os.path.join(vector_dbs_dir, "legal_support_agent_vector_db"), embeddings, allow_dangerous_deserialization=True)
    mental_vector_store = FAISS.load_local(os.path.join(vector_dbs_dir, "mental_health_support_agent_vector_db"), embeddings, allow_dangerous_deserialization=True)
    self_defence_vector_store = FAISS.load_local(os.path.join(vector_dbs_dir, "self_defence_advice_agent_vector_db"), embeddings, allow_dangerous_deserialization=True)

    return emergency_vector_store, legal_vector_store, mental_vector_store, self_defence_vector_store


async def retrieve_context(query, vector_store, top_k=10):
    results = vector_store.similarity_search_with_score(query, k=top_k)
    weighted_context = ""
    for doc, score in results:
        weighted_context += f"{doc.page_content} (relevance: {score})\n\n"
    return weighted_context

async def generate_response(prompt):

    LLAMA_client, tavily_client, memory, gemini_model = initialize_clients()
    emergency_vector_store, legal_vector_store, mental_vector_store, self_defence_vector_store = await get_vector_stores()

    async def get_gemini_response(last_prompt, system_prompt):
        chat_session = gemini_model.start_chat()
        final_prompt = f""" 
        role: system, content: {system_prompt}
        role: user, content: {last_prompt}"""
        response = chat_session.send_message(final_prompt)
        return response.text

    Agent = await Agent_selector(prompt)
    print(f"Agent: {Agent}")
    if Agent == "emergency services":        
        resources = await retrieve_context(prompt, emergency_vector_store)  
        system_prompt = "You are a helpful assistant that provides information about emergency services."
    elif Agent == "legal services":
        resources = await retrieve_context(prompt, legal_vector_store)  
        system_prompt = "You are a helpful assistant that provides information about legal services."
    elif Agent == "mental health services":
        resources = await retrieve_context(prompt, mental_vector_store)  
        system_prompt = "You are a helpful assistant that provides information about mental health services."
    elif Agent == "self-defence services":
        resources = await retrieve_context(prompt, self_defence_vector_store)  
        system_prompt = "You are a helpful assistant that provides information about self-defence services."
    else:
        Agent = "general services"
        resources = ""
        system_prompt = "You are a helpful assistant that provides information about general services."

    print(f"resources: {resources}")

    history = memory.load_memory_variables({})
    history_context = "\n".join([f"{m.type}: {m.content}" for m in history.get("history", [])])
    context = f"Conversation History:\n{history_context}\n\nContext: {resources}\n\n"
    try:
        search_prompt = f"Fast-check this about {Agent}: {prompt}"
        tavily_context = tavily_client.search(query=search_prompt, search_depth="advanced", max_results=5)
        tavily_context_results = []
        for result in tavily_context['results']:
            if 'title' in result and 'content' in result:
                tavily_context_results.append({
                'title': result['title'],
                'content': result['content']
                })
        print(tavily_context_results)
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
    respond = await get_gemini_response(full_prompt, system_prompt)
    return respond, Agent


# async def is_women_safety_related(prompt):
#     # Creating SLM client
#     SLM = InferenceClient(
#         "mistralai/Mistral-7B-Instruct-v0.1",
#         token=os.getenv("HuggingFace_API_KEY"),
#     )

#     SLM_prompt = f"""
#     Determine if the following prompt is related to women safety and womens.
#     Respond with 'Yes' if it is, and 'No' if it is not.
    
#     Prompt: {prompt}
#     """
        
#     start_time = time.time()
        
#     SLM_response = ""
#     for message in SLM.chat_completion(
#             messages=[{"role": "user", "content": SLM_prompt}],
#             max_tokens=10,
#             stream=True,
#         ):
#             content = message.choices[0].delta.content
#             if content:
#                 print(content, end="")
#                 SLM_response += content 

#     end_time = time.time()
#     process_time = end_time - start_time
        
#     print(f"\nSLM_response: {SLM_response.strip()}")
#     print(f"Process time: {process_time:.2f} seconds")

#     if "yes" in SLM_response.strip().lower():
#         return True
#     elif "no" in SLM_response.strip().lower():
#         return False
#     else:
#         print(f"Unexpected SLM response: {SLM_response}")
#         return False

async def Agent_selector(prompt):
    # Creating SLM client
    SLM = InferenceClient(
        "mistralai/Mistral-7B-Instruct-v0.1",
        token=os.getenv("HuggingFace_API_KEY"),
    )

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
        
    SLM_response = ""
    for message in SLM.chat_completion(
            messages=[{"role": "user", "content": SLM_prompt}],
            max_tokens=50,
            stream=True,
        ):
            content = message.choices[0].delta.content
            if content:
                print(content, end="")
                SLM_response += content 

    end_time = time.time()
    process_time = end_time - start_time
        
    print(f"\nSLM_response: {SLM_response.strip()}")
    print(f"Process time: {process_time:.2f} seconds")

    response = SLM_response.strip().lower()

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
        print(f"Unexpected SLM response: {SLM_response}")
        return "general services"
    

# async def main():
#     response, agent = await generate_response("I need help with a legal issue.")
#     print(response, agent)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)