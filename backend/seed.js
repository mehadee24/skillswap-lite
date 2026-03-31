//temporary seed
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const ServiceProvider = require('./models/ServiceProvider');
const Client = require('./models/Client');

dotenv.config();

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillswap';

// All 28 Service Providers Data
const providersData = [
    // Existing 3 Providers
    {
        name: "Mehadee",
        email: "mehadee@skillswap.com",
        password: "password123",
        userType: "provider",
        skills: ["Backend Development", "Frontend Development", "Machine Learning", "Artificial Intelligence", "React Cross-Platform Applications"],
        description: "A versatile developer capable of building full-stack systems, AI solutions, and modern web applications.",
        projectsCompleted: 45,
        currentlyWorkingOn: "AI-powered analytics platform",
        rating: 4.9,
        totalReviews: 28
    },
    {
        name: "Rakib",
        email: "rakib@skillswap.com",
        password: "password123",
        userType: "provider",
        skills: ["Game Development", "Unreal Engine 3, 4, 5", "GTA V Roleplay Systems", "3D Modeling", "Game Physics and Collision Systems"],
        description: "Experienced game developer specializing in immersive gameplay systems and advanced game engines.",
        projectsCompleted: 32,
        currentlyWorkingOn: "Open world RPG game",
        rating: 4.8,
        totalReviews: 19
    },
    {
        name: "Alamin",
        email: "alamin@skillswap.com",
        password: "password123",
        userType: "provider",
        skills: ["UI Design", "Frontend Development", "Android App Development", "iOS App Development", "Web Application Design"],
        description: "Creative UI designer and frontend developer focused on modern interfaces and smooth user experience.",
        projectsCompleted: 51,
        currentlyWorkingOn: "Mobile app redesign for startup",
        rating: 5.0,
        totalReviews: 42
    },

    // Cloud & DevOps (3)
    {
        name: "Tanvir Ahmed",
        email: "tanvir@skillswap.com",
        password: "password123",
        userType: "provider",
        skills: ["AWS", "Azure", "Docker", "Kubernetes", "CI/CD", "Terraform"],
        description: "Certified AWS Solutions Architect helping businesses scale their infrastructure.",
        projectsCompleted: 45,
        currentlyWorkingOn: "Enterprise cloud migration for a bank",
        rating: 4.9,
        totalReviews: 31
    },
    {
        name: "Farhana Akter",
        email: "farhana@skillswap.com",
        password: "password123",
        userType: "provider",
        skills: ["Google Cloud", "Terraform", "Jenkins", "Linux", "Ansible"],
        description: "Cloud engineer specializing in infrastructure automation and optimization.",
        projectsCompleted: 26,
        currentlyWorkingOn: "Cloud infrastructure optimization",
        rating: 4.7,
        totalReviews: 18
    },
    {
        name: "Shakib Al Hasan",
        email: "shakib@skillswap.com",
        password: "password123",
        userType: "provider",
        skills: ["DevOps", "Ansible", "Prometheus", "Grafana", "Linux", "Jenkins"],
        description: "DevOps engineer automating deployments and monitoring infrastructure.",
        projectsCompleted: 30,
        currentlyWorkingOn: "Monitoring infrastructure for startup",
        rating: 4.8,
        totalReviews: 22
    },

    // Cybersecurity (3)
    {
        name: "Sarah Khan",
        email: "sarah@skillswap.com",
        password: "password123",
        userType: "provider",
        skills: ["Ethical Hacking", "Penetration Testing", "Network Security", "CEH Certified"],
        description: "CEH certified ethical hacker protecting digital assets from cyber threats.",
        projectsCompleted: 32,
        currentlyWorkingOn: "Security audit for fintech startup",
        rating: 4.9,
        totalReviews: 27
    },
    {
        name: "Mahmud Hasan",
        email: "mahmud@skillswap.com",
        password: "password123",
        userType: "provider",
        skills: ["Cryptography", "Security Auditing", "ISO 27001", "Risk Assessment"],
        description: "Security analyst protecting organizations from cyber threats.",
        projectsCompleted: 25,
        currentlyWorkingOn: "Compliance framework implementation",
        rating: 4.6,
        totalReviews: 15
    },
    {
        name: "Nadia Sultana",
        email: "nadia@skillswap.com",
        password: "password123",
        userType: "provider",
        skills: ["Incident Response", "Malware Analysis", "SIEM", "Forensics"],
        description: "Incident response specialist with rapid response to security incidents.",
        projectsCompleted: 28,
        currentlyWorkingOn: "SOC implementation for enterprise",
        rating: 4.8,
        totalReviews: 20
    },

    // Data Science & AI (3)
    {
        name: "Nusrat Jahan",
        email: "nusrat@skillswap.com",
        password: "password123",
        userType: "provider",
        skills: ["Python", "TensorFlow", "Data Visualization", "SQL", "Pandas"],
        description: "Data scientist turning data into actionable business insights.",
        projectsCompleted: 28,
        currentlyWorkingOn: "Predictive analytics for e-commerce platform",
        rating: 4.9,
        totalReviews: 24
    },
    {
        name: "Rafiqul Islam",
        email: "rafiqul@skillswap.com",
        password: "password123",
        userType: "provider",
        skills: ["NLP", "Computer Vision", "PyTorch", "Hugging Face", "LLMs"],
        description: "AI/ML engineer building intelligent systems that learn and adapt.",
        projectsCompleted: 22,
        currentlyWorkingOn: "Chatbot development for customer service",
        rating: 4.7,
        totalReviews: 16
    },
    {
        name: "Sumaiya Kabir",
        email: "sumaiya@skillswap.com",
        password: "password123",
        userType: "provider",
        skills: ["Big Data", "Hadoop", "Spark", "Tableau", "Kafka"],
        description: "Big data engineer processing large-scale data efficiently.",
        projectsCompleted: 31,
        currentlyWorkingOn: "Data pipeline for e-commerce",
        rating: 4.8,
        totalReviews: 19
    },

    // Mobile Development (3)
    {
        name: "Kamal Hossain",
        email: "kamal@skillswap.com",
        password: "password123",
        userType: "provider",
        skills: ["Flutter", "React Native", "iOS", "Android", "Firebase"],
        description: "Cross-platform mobile developer building beautiful and performant apps.",
        projectsCompleted: 52,
        currentlyWorkingOn: "Cross-platform banking app",
        rating: 4.9,
        totalReviews: 38
    },
    {
        name: "Rima Chowdhury",
        email: "rima@skillswap.com",
        password: "password123",
        userType: "provider",
        skills: ["Kotlin", "Swift", "Firebase", "REST APIs", "SwiftUI"],
        description: "iOS developer creating delightful mobile experiences.",
        projectsCompleted: 35,
        currentlyWorkingOn: "Health tracking iOS application",
        rating: 4.7,
        totalReviews: 21
    },
    {
        name: "Sohel Rana",
        email: "sohel@skillswap.com",
        password: "password123",
        userType: "provider",
        skills: ["Xamarin", ".NET MAUI", "C#", "REST APIs"],
        description: "Mobile developer building cross-platform enterprise business apps.",
        projectsCompleted: 24,
        currentlyWorkingOn: "Enterprise mobile solution",
        rating: 4.6,
        totalReviews: 14
    },

    // Frontend & UI/UX (2)
    {
        name: "Farzana Yesmin",
        email: "farzana@skillswap.com",
        password: "password123",
        userType: "provider",
        skills: ["React", "Vue.js", "Angular", "Tailwind CSS", "TypeScript"],
        description: "Frontend specialist creating responsive and accessible web interfaces.",
        projectsCompleted: 38,
        currentlyWorkingOn: "Design system for SaaS company",
        rating: 4.9,
        totalReviews: 29
    },
    {
        name: "Imran Hossain",
        email: "imran@skillswap.com",
        password: "password123",
        userType: "provider",
        skills: ["Figma", "Adobe XD", "User Research", "Prototyping", "UI/UX"],
        description: "UI/UX designer creating user-centered designs that convert.",
        projectsCompleted: 40,
        currentlyWorkingOn: "Redesign for ed-tech platform",
        rating: 4.8,
        totalReviews: 26
    },

    // Backend & Database (1)
    {
        name: "Mushfiqur Rahman",
        email: "mushfiqur@skillswap.com",
        password: "password123",
        userType: "provider",
        skills: ["Node.js", "Python Django", "PostgreSQL", "MongoDB", "Redis"],
        description: "Backend engineer building robust and scalable backend systems.",
        projectsCompleted: 48,
        currentlyWorkingOn: "API development for social platform",
        rating: 4.8,
        totalReviews: 33
    },

    // Blockchain & Web3 (2)
    {
        name: "Adnan Kabir",
        email: "adnan@skillswap.com",
        password: "password123",
        userType: "provider",
        skills: ["Solidity", "Smart Contracts", "Web3.js", "Ethereum", "NFT Development"],
        description: "Blockchain developer building decentralized applications on Ethereum.",
        projectsCompleted: 18,
        currentlyWorkingOn: "DeFi platform development",
        rating: 4.8,
        totalReviews: 12
    },
    {
        name: "Tanisha Rahman",
        email: "tanisha@skillswap.com",
        password: "password123",
        userType: "provider",
        skills: ["Blockchain", "Hyperledger", "Cryptocurrency", "DeFi", "Rust"],
        description: "Web3 engineer creating secure and transparent blockchain solutions.",
        projectsCompleted: 22,
        currentlyWorkingOn: "Supply chain tracking on blockchain",
        rating: 4.7,
        totalReviews: 15
    },

    // Database Administrator (1)
    {
        name: "Hasan Mahmud",
        email: "hasan@skillswap.com",
        password: "password123",
        userType: "provider",
        skills: ["PostgreSQL", "Oracle", "MySQL", "Database Optimization", "Data Migration"],
        description: "Database administrator ensuring high availability of critical databases.",
        projectsCompleted: 55,
        currentlyWorkingOn: "Database migration to cloud",
        rating: 4.8,
        totalReviews: 34
    },

    // IT Support & Networking (2)
    {
        name: "Rabiul Islam",
        email: "rabiul@skillswap.com",
        password: "password123",
        userType: "provider",
        skills: ["Network Configuration", "Cisco", "Firewall", "VPN", "IT Infrastructure"],
        description: "Network engineer designing and maintaining secure network infrastructures.",
        projectsCompleted: 42,
        currentlyWorkingOn: "Enterprise network security upgrade",
        rating: 4.6,
        totalReviews: 23
    },
    {
        name: "Sumon Chakraborty",
        email: "sumon@skillswap.com",
        password: "password123",
        userType: "provider",
        skills: ["System Administration", "Windows Server", "Linux", "Active Directory"],
        description: "System administrator managing and optimizing IT infrastructure.",
        projectsCompleted: 38,
        currentlyWorkingOn: "Cloud server management",
        rating: 4.7,
        totalReviews: 20
    },

    // QA & Testing (2)
    {
        name: "Sharmin Akter",
        email: "sharmin@skillswap.com",
        password: "password123",
        userType: "provider",
        skills: ["Selenium", "Manual Testing", "Automation", "JIRA", "Performance Testing"],
        description: "QA engineer ensuring software quality through rigorous testing.",
        projectsCompleted: 35,
        currentlyWorkingOn: "Test automation for e-commerce platform",
        rating: 4.8,
        totalReviews: 22
    },
    {
        name: "Rajib Hossain",
        email: "rajib@skillswap.com",
        password: "password123",
        userType: "provider",
        skills: ["Cypress", "Jest", "Unit Testing", "Integration Testing", "Bug Tracking"],
        description: "Test automation engineer automating test processes for faster deployments.",
        projectsCompleted: 30,
        currentlyWorkingOn: "CI/CD test integration",
        rating: 4.7,
        totalReviews: 18
    },

    // ERP & CRM (1)
    {
        name: "Nazmul Haque",
        email: "nazmul@skillswap.com",
        password: "password123",
        userType: "provider",
        skills: ["SAP", "Oracle ERP", "Odoo", "Business Process", "System Integration"],
        description: "ERP consultant streamlining business processes through ERP solutions.",
        projectsCompleted: 28,
        currentlyWorkingOn: "ERP implementation for manufacturing company",
        rating: 4.8,
        totalReviews: 19
    },

    // IoT & Embedded Systems (1)
    {
        name: "Fatema Tuz Zohra",
        email: "fatema@skillswap.com",
        password: "password123",
        userType: "provider",
        skills: ["Arduino", "Raspberry Pi", "C++", "Embedded C", "Sensor Integration"],
        description: "IoT engineer connecting physical devices to the digital world.",
        projectsCompleted: 25,
        currentlyWorkingOn: "Smart home automation system",
        rating: 4.7,
        totalReviews: 16
    },

    // Technical Writing (1)
    {
        name: "Rasheda Begum",
        email: "rasheda@skillswap.com",
        password: "password123",
        userType: "provider",
        skills: ["API Documentation", "User Manuals", "Technical Writing", "MadCap Flare"],
        description: "Technical writer making complex concepts easy to understand.",
        projectsCompleted: 60,
        currentlyWorkingOn: "API documentation for fintech API",
        rating: 4.6,
        totalReviews: 25
    }
];

async function seedDatabase() {
    try {
        console.log('🌐 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({ userType: 'provider' });
        await ServiceProvider.deleteMany({});
        console.log('✅ Existing provider data cleared');

        console.log('📝 Creating users and service providers...');
        
        let createdCount = 0;
        
        for (const provider of providersData) {
            // Create User
            const hashedPassword = await bcrypt.hash(provider.password, 10);
            const user = await User.create({
                name: provider.name,
                email: provider.email,
                password: hashedPassword,
                userType: 'provider'
            });
            
            // Create Service Provider
            await ServiceProvider.create({
                userId: user._id,
                name: provider.name,
                email: provider.email,
                skills: provider.skills,
                description: provider.description,
                projectsCompleted: provider.projectsCompleted,
                currentlyWorkingOn: provider.currentlyWorkingOn,
                rating: provider.rating,
                totalReviews: provider.totalReviews
            });
            
            createdCount++;
            console.log(`   ✓ Created: ${provider.name}`);
        }

        console.log('\n🎉 SEED COMPLETE!');
        console.log(`✅ Created ${createdCount} service providers`);
        console.log('\n📊 Summary:');
        console.log(`   - Users created: ${createdCount}`);
        console.log(`   - Service Providers created: ${createdCount}`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

// Run the seed function
seedDatabase();