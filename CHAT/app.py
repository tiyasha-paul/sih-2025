import streamlit as st
from main import rag_with_fallback, plot_extraction_trend, plot_category_bar, translate_to_en, extract_location_and_year
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
import re
import os

# Constants
EMBEDDING_MODEL = "paraphrase-multilingual-MiniLM-L12-v2"

# Initialize session state for persistent chat history
if 'chat_history' not in st.session_state:
    st.session_state.chat_history = []
if 'last_query' not in st.session_state:
    st.session_state.last_query = ""

# Load FAISS index
@st.cache_resource
def load_vectorstore():
    embeddings_model = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)
    if os.path.exists("faiss_index"):
        try:
            vectorstore = FAISS.load_local("faiss_index", embeddings_model, allow_dangerous_deserialization=True)
            return vectorstore
        except Exception as e:
            st.error(f"Error loading FAISS index: {e}")
            return None
    return None

vectorstore = load_vectorstore()

# Streamlit UI
st.title("🌊 HydroLens - Groundwater Monitoring System")
st.markdown("Ask about groundwater data, rainfall, or request visualizations for any location.")

lang = st.selectbox("Select Language", ['English', 'Hindi', 'Bengali', 'Tamil', 'Telugu'])
visualize = st.checkbox("Auto-generate Visualization", value=True)
show_sources = st.checkbox("Show Sources")

query = st.text_input("Ask about groundwater (e.g., 'Show trend for Delhi 2024' or 'Category bar for Rohini 2024'):", key="query_input")

# Display chat history
for entry in st.session_state.chat_history:
    with st.container():
        st.write(f"**You:** {entry['query']}")
        st.write(f"**Bot:** {entry['answer']}")
        if 'visualization' in entry and entry['visualization']:
            st.pyplot(entry['visualization'])
        if entry.get('sources') and show_sources:
            with st.expander("Show sources"):
                for s in entry['sources'][:3]:
                    if isinstance(s, dict):
                        st.write(f"- {s.get('location', 'Unknown')}, {s.get('year', 'Unknown')} (SGWD: {s.get('sgwd', 0):.1f}%)")
                    else:
                        st.write(f"- {s.metadata.get('location', 'Unknown')}, {s.metadata.get('year', 'Unknown')} (SGWD: {s.metadata.get('sgwd', 0):.1f}%)")

if query and query != st.session_state.last_query:
    st.session_state.last_query = query
    lang_code = {'English': 'en', 'Hindi': 'hi', 'Bengali': 'bn', 'Tamil': 'ta', 'Telugu': 'te'}[lang]
    en_query = translate_to_en(query)

    # Parse location, state, year from query
    location, state, year, query_type = extract_location_and_year(en_query)

    answer, sources = rag_with_fallback(en_query, vectorstore=vectorstore, lang=lang_code)

    # Store in chat history
    chat_entry = {'query': query, 'answer': answer, 'sources': sources, 'visualization': None}

    # Auto-generate visualization if requested - enhanced detection
    viz_keywords = ['trend', 'plot', 'graph', 'chart', 'visuali', 'category', 'bar', 'show', 'generate', 'display']
    if visualize and any(w in en_query.lower() for w in viz_keywords):
        try:
            # Determine target state: use extracted state or infer from location or default
            from main import infer_state
            target_state = state if state else (infer_state(location) if location else "Delhi")

            # Determine which visualization to show
            if any(w in en_query.lower() for w in ['category', 'bar', 'distribution']):
                year_str = year if year else "2024"
                fig = plot_category_bar(target_state, year_str)
                chat_entry['visualization'] = fig
            elif any(w in en_query.lower() for w in ['trend', 'plot', 'graph', 'extraction']):
                fig = plot_extraction_trend(target_state, location)
                chat_entry['visualization'] = fig
        except Exception as e:
            st.error(f"Visualization error: {e}")
            import traceback
            st.code(traceback.format_exc())

    st.session_state.chat_history.append(chat_entry)
    st.rerun()

if st.button("Clear Chat"):
    st.session_state.chat_history = []
    st.session_state.last_query = ""
    st.rerun()