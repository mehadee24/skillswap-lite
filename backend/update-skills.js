const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const ServiceProvider = require('./models/ServiceProvider');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillswap';

async function updateSkills() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Update Mehadee
        await ServiceProvider.updateOne(
            { name: "Mehadee" },
            { 
                $set: { 
                    skills: ["Full Stack Development", "Web Development", "Machine Learning", "Artificial Intelligence", "React", "Node.js", "Python"],
                    description: "Full Stack Developer and AI specialist with 5+ years of experience building scalable web applications and AI solutions."
                }
            }
        );
        console.log('✅ Updated Mehadee');

        // Update Rakib
        await ServiceProvider.updateOne(
            { name: "Rakib" },
            { 
                $set: { 
                    skills: ["Game Development", "Unreal Engine", "Unity", "3D Modeling", "C++", "Game Physics", "Virtual Reality"],
                    description: "Expert Game Developer with 4+ years of experience in Unreal Engine and Unity. Specialized in immersive gameplay and VR experiences."
                }
            }
        );
        console.log('✅ Updated Rakib');

        // Update Alamin
        await ServiceProvider.updateOne(
            { name: "Alamin" },
            { 
                $set: { 
                    skills: ["UI/UX Design", "Web Design", "Mobile Design", "Figma", "Adobe XD", "User Research", "Prototyping"],
                    description: "Creative UI/UX Designer focused on creating beautiful, user-friendly interfaces for web and mobile applications."
                }
            }
        );
        console.log('✅ Updated Alamin');

        console.log('\n🎉 All skills updated successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

updateSkills();