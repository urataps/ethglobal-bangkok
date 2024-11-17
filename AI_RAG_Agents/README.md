# Yield Vision AI Agents

**Yield Vision AI Agents** is a comprehensive, docker-based DeFi investment advisory system that leverages artificial intelligence to provide personalized protocol recommendations based on risk tolerance, investment size, and strategy preferences. The system uses advanced RAG (Retrieval-Augmented Generation) technology to analyze real-time DeFi protocol data and provide informed investment recommendations.

![n8n.io - Screenshot](https://raw.githubusercontent.com/urataps/ethglobal-bangkok/main/AI_RAG_Agents/assets/agents_schema.png)

### Core Features

✅ **Intelligent Protocol Matching** - Advanced filtering system that matches DeFi protocols to your risk tolerance and investment criteria

✅ **Real-time DeFi Data** - Integration with DeFiLlama for up-to-date protocol metrics and performance data

✅ **Risk Analysis Engine** - Sophisticated risk assessment considering TVL, audit status, chain diversity, and historical performance

✅ **Vector Database Storage** - High-performance Qdrant local vector storage for efficient protocol matching and retrieval

✅ **Conversational Interface** - Natural language interaction for investment advice and protocol recommendations

### Key Components

⚡️ **[n8n](https://n8n.io/)** - Powers the automation and workflow engine

⚡️ **[Ollama](https://ollama.com/)** - Provides local AI capabilities for secure data processing

⚡️ **[Qdrant](https://qdrant.tech/)** - Vector database for efficient protocol matching

⚡️ **[PostgreSQL](https://www.postgresql.org/)** - Robust database for storing protocol data and chat history

⚡️ **[Open WebUI](https://openwebui.com/)** - User-friendly interface for interacting with the AI advisor

## Installation

### For Nvidia GPU users

```bash
git clone https://github.com/urataps/ethglobal-bangkok
cd AI_RAG_Agents
docker compose --profile gpu-nvidia up
```

### For Mac / Apple Silicon users

```bash
git clone https://github.com/urataps/ethglobal-bangkok
cd AI_RAG_Agents
docker compose up
```

### For CPU-only systems

```bash
git clone https://github.com/urataps/ethglobal-bangkok
cd AI_RAG_Agents
docker compose --profile cpu up
```

## Quick Start Guide

1. Open `http://localhost:5678/` to set up your local n8n instance
2. Configure the following credentials:
   - Ollama URL: `http://ollama:11434`
   - PostgreSQL: Use credentials from .env file
   - Qdrant URL: `http://qdrant:6333`
3. Open the Yield Vision workflow and activate it
4. Copy the Production webhook URL for API access
5. Access Open WebUI at `http://localhost:3000/`
6. Set up your investment preferences and start getting personalized recommendations

## System Architecture

Yield Vision AI Agents consists of several integrated components:

1. **Data Ingestion Layer**

   - Real-time protocol data fetching from DeFiLlama
   - Automated data cleaning and normalization
   - Risk scoring and categorization

2. **Vector Database Layer**

   - Protocol metadata indexing
   - Efficient similarity search
   - Real-time data updates

3. **AI Processing Layer**

   - Risk analysis engine
   - Natural language understanding
   - Personalized recommendation generation

4. **User Interface Layer**
   - Conversational AI interface
   - Investment criteria input
   - Protocol recommendation display

## Usage Examples

⭐️ Get protocol recommendations based on risk tolerance and investment size

⭐️ Analyze protocol security features and audit status

⭐️ Compare TVL and performance metrics across different protocols

⭐️ Receive chain diversification suggestions

⭐️ Track protocol performance changes and updates

## Upgrading

### For Nvidia GPU users

```bash
docker compose --profile gpu-nvidia pull
docker compose create && docker compose --profile gpu-nvidia up
```

### For Mac / Apple Silicon users

```bash
docker compose pull
docker compose create && docker compose up
```

### For CPU-only systems

```bash
docker compose --profile cpu pull
docker compose create && docker compose --profile cpu up
```

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Support

For support and discussions:

- Create an issue in the GitHub repository
- Join our community Discord server
