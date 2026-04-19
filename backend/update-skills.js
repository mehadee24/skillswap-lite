const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const ServiceProvider = require('./models/ServiceProvider');

const MONGODB_URI = process.env.MONGODB_URI;

const skillUpdates = [
    { name: "Mehadee", skills: ["Web Development", "Full Stack Developer", "React Developer", "Node.js Developer", "Machine Learning Engineer", "AI Expert", "Python Developer"] },
    { name: "Rakib", skills: ["Game Developer", "Unity Developer", "Unreal Engine Developer", "C++ Developer", "3D Modeling", "Game Designer"] },
    { name: "Alamin", skills: ["UI Designer", "UX Designer", "Web Designer", "Figma Expert", "Frontend Developer", "Mobile App Designer"] },
    { name: "Tanvir Ahmed", skills: ["Cloud Architect", "AWS Specialist", "DevOps Engineer", "Kubernetes Specialist", "Azure Expert"] },
    { name: "Sarah Khan", skills: ["Cyber Security Expert", "Ethical Hacker", "Penetration Tester", "Security Analyst", "Network Security Engineer"] },
    { name: "Kamal Hossain", skills: ["App Developer", "Mobile Developer", "Flutter Developer", "React Native Developer", "iOS Developer", "Android Developer"] },
    { name: "Farzana Yesmin", skills: ["Frontend Developer", "React Developer", "Vue.js Developer", "UI Developer", "Web Developer"] }
];

async function updateSkills() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log(':white_check_mark: Connected to MongoDB');

        for (const update of skillUpdates) {
            const result = await ServiceProvider.updateOne(
                { name: update.name },
                { $set: { skills: update.skills } }
            );
            console.log(`✅ Updated ${update.name}: ${result.modifiedCount > 0 ? 'success' : 'no change'}`);
        }

        console.log('\n:tada: All skills updated!');
        process.exit(0);
    } catch (error) {
        console.error(':x: Error:', error);
        process.exit(1);
    }
}

updateSkills();
