import os
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings

def create_vector_store(agent_name):
    script_dir = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
    vector_db_path = os.path.join(script_dir, "Vector_databases", f"{agent_name.lower().replace(' ', '_')}_vector_db")
    
    if os.path.exists(vector_db_path):
        print(f"{agent_name} vector store already exists. Loading from disk.")
        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        return FAISS.load_local(vector_db_path, embeddings, allow_dangerous_deserialization=True)
    
    try:
        file_path = os.path.join(script_dir, "Resources", f"{agent_name}.txt")
        with open(file_path, "r", encoding="utf-8") as file:
            text = file.read()
        print(f"{agent_name} file read successfully")
    except UnicodeDecodeError as e:
        print(f"UnicodeDecodeError: {e}")
        return None
    except Exception as e:
        print(f"Error reading file: {e}")
        return None
    
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    chunks = text_splitter.split_text(text)
    
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    vector_store = FAISS.from_texts(chunks, embeddings)
    
    os.makedirs(os.path.dirname(vector_db_path), exist_ok=True)
    vector_store.save_local(vector_db_path)
    print(f"{agent_name} vector store saved to {vector_db_path}")
    
    return vector_store

mental_health_support_agent_vector_store = create_vector_store("Mental Health Support Agent")
emergency_response_agent_vector_store = create_vector_store("Emergency Response Agent")
legal_support_agent_vector_store = create_vector_store("Legal Support Agent")
self_defence_advice_agent_vector_store = create_vector_store("Self Defence Advice Agent")