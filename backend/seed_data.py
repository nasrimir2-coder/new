# Default data to seed the database
default_profile = {
    "id": "profile-1",
    "name": "Fahmy",
    "tagline": "Web3 Researcher & Node Validator",
    "bio": "Passionate blockchain enthusiast with extensive experience in running node validators across multiple networks. Dedicated to decentralization and contributing to the Web3 ecosystem through research and infrastructure support.",
    "avatar": "https://api.dicebear.com/7.x/identicon/svg?seed=Fahmy&backgroundColor=111113",
    "location": "Indonesia",
    "email": "fahmy@example.com",
    "socialLinks": {
        "twitter": "https://twitter.com/fahmy",
        "github": "https://github.com/fahmy",
        "linkedin": "https://linkedin.com/in/fahmy",
        "discord": "fahmy#0001",
        "telegram": "https://t.me/fahmy"
    }
}

default_experiences = [
    {
        "id": "exp-1",
        "title": "Senior Node Operator",
        "company": "Independent",
        "period": "2022 - Present",
        "description": "Operating and maintaining validator nodes across multiple blockchain networks including Ethereum, Cosmos ecosystem, and various testnets. Ensuring 99.9% uptime and contributing to network security.",
        "tags": ["Ethereum", "Cosmos", "Validator", "Infrastructure"]
    },
    {
        "id": "exp-2",
        "title": "Blockchain Researcher",
        "company": "Web3 Research Lab",
        "period": "2021 - 2022",
        "description": "Conducted research on consensus mechanisms, layer 2 scaling solutions, and cross-chain interoperability. Published findings on tokenomics and validator economics.",
        "tags": ["Research", "DeFi", "Layer 2", "Consensus"]
    },
    {
        "id": "exp-3",
        "title": "Smart Contract Developer",
        "company": "DeFi Protocol",
        "period": "2020 - 2021",
        "description": "Developed and audited smart contracts for decentralized finance applications. Implemented security best practices and gas optimization techniques.",
        "tags": ["Solidity", "Smart Contracts", "DeFi", "Security"]
    }
]

default_research = [
    {
        "id": "res-1",
        "title": "Comparative Analysis of Proof-of-Stake Consensus Mechanisms",
        "abstract": "A comprehensive study comparing various PoS implementations across major blockchain networks, analyzing their security guarantees, economic incentives, and performance characteristics.",
        "date": "2024-01-15",
        "tags": ["Consensus", "PoS", "Security"],
        "link": "#"
    },
    {
        "id": "res-2",
        "title": "Validator Economics: Incentive Structures in Decentralized Networks",
        "abstract": "Exploring the economic models behind validator rewards, slashing conditions, and their impact on network security and decentralization.",
        "date": "2023-08-20",
        "tags": ["Economics", "Validators", "Tokenomics"],
        "link": "#"
    },
    {
        "id": "res-3",
        "title": "Cross-Chain Bridge Security: Vulnerabilities and Best Practices",
        "abstract": "Analysis of security incidents in cross-chain bridges and recommendations for building more secure interoperability solutions.",
        "date": "2023-05-10",
        "tags": ["Security", "Bridges", "Interoperability"],
        "link": "#"
    }
]

default_validators = [
    {
        "id": "val-1",
        "network": "Ethereum",
        "status": "active",
        "type": "Mainnet Validator",
        "stake": "32 ETH",
        "uptime": "99.98%",
        "since": "2023-01",
        "icon": "⟠",
        "color": "#627EEA"
    },
    {
        "id": "val-2",
        "network": "Cosmos Hub",
        "status": "active",
        "type": "Mainnet Validator",
        "stake": "50,000 ATOM",
        "uptime": "99.95%",
        "since": "2022-06",
        "icon": "⚛",
        "color": "#2E3148"
    },
    {
        "id": "val-3",
        "network": "Celestia",
        "status": "active",
        "type": "Mainnet Validator",
        "stake": "100,000 TIA",
        "uptime": "99.99%",
        "since": "2023-10",
        "icon": "◈",
        "color": "#7B2BF9"
    },
    {
        "id": "val-4",
        "network": "Sui",
        "status": "active",
        "type": "Testnet Validator",
        "stake": "1,000,000 SUI",
        "uptime": "99.90%",
        "since": "2023-03",
        "icon": "◆",
        "color": "#4DA2FF"
    },
    {
        "id": "val-5",
        "network": "Aptos",
        "status": "inactive",
        "type": "Testnet Validator",
        "stake": "-",
        "uptime": "-",
        "since": "2022-10",
        "icon": "△",
        "color": "#2DD8A7"
    },
    {
        "id": "val-6",
        "network": "Sei",
        "status": "active",
        "type": "Mainnet Validator",
        "stake": "500,000 SEI",
        "uptime": "99.97%",
        "since": "2023-08",
        "icon": "◎",
        "color": "#9B1C1C"
    }
]

default_posts = [
    {
        "id": "post-1",
        "title": "Getting Started with Ethereum Validator Setup",
        "excerpt": "A comprehensive guide on how to set up your own Ethereum validator node from scratch, including hardware requirements and best practices.",
        "content": "Full article content here...",
        "date": "2024-06-15",
        "tags": ["Ethereum", "Tutorial", "Validator"],
        "published": True
    },
    {
        "id": "post-2",
        "title": "Understanding Cosmos SDK: Building Custom Blockchains",
        "excerpt": "Deep dive into the Cosmos SDK architecture and how it enables developers to build application-specific blockchains.",
        "content": "Full article content here...",
        "date": "2024-05-20",
        "tags": ["Cosmos", "SDK", "Development"],
        "published": True
    },
    {
        "id": "post-3",
        "title": "The Future of Modular Blockchains",
        "excerpt": "Exploring the modular blockchain thesis and how projects like Celestia are reshaping the blockchain landscape.",
        "content": "Full article content here...",
        "date": "2024-04-10",
        "tags": ["Celestia", "Modular", "Research"],
        "published": True
    }
]

# Default admin user (password: admin123)
default_admin = {
    "id": "admin-1",
    "email": "fahmy@admin.com",
    "password_hash": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G3vGzK8YHG8xXe",  # admin123
    "name": "Fahmy",
    "role": "admin"
}
