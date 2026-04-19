const ServiceProvider = require('../models/ServiceProvider');

// Comprehensive skill database for autocomplete
const skillDatabase = [
    // Web Development
    'Web Developer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'React Developer', 'Angular Developer', 'Vue.js Developer', 'Node.js Developer',
    'PHP Developer', 'Laravel Developer', 'Django Developer', 'Flask Developer',
    
    // App Development
    'App Developer', 'Mobile Developer', 'iOS Developer', 'Android Developer',
    'Flutter Developer', 'React Native Developer', 'Swift Developer', 'Kotlin Developer',
    
    // AI & Machine Learning
    'AI Expert', 'Machine Learning Engineer', 'Data Scientist', 'Deep Learning Engineer',
    'NLP Specialist', 'Computer Vision Engineer', 'LLM Expert', 'Prompt Engineer',
    
    // Cybersecurity
    'Cyber Security Expert', 'Ethical Hacker', 'Penetration Tester', 'Security Analyst',
    'Network Security Engineer', 'Cloud Security Specialist', 'SOC Analyst',
    
    // Cloud & DevOps
    'Cloud Architect', 'DevOps Engineer', 'AWS Specialist', 'Azure Expert',
    'Google Cloud Engineer', 'Kubernetes Specialist', 'Docker Expert',
    
    // Game Development
    'Game Developer', 'Unity Developer', 'Unreal Engine Developer', '3D Modeler',
    'Game Designer', 'Game Physics Engineer',
    
    // UI/UX Design
    'UI Designer', 'UX Designer', 'Product Designer', 'Figma Expert',
    'Adobe XD Specialist', 'User Researcher',
    
    // Database
    'Database Administrator', 'Database Engineer', 'SQL Expert', 'MongoDB Specialist',
    'PostgreSQL Expert', 'Oracle DBA',
    
    // Other IT
    'IT Support Specialist', 'Network Administrator', 'System Administrator',
    'Technical Writer', 'QA Tester', 'Automation Engineer', 'Blockchain Developer',
    'IoT Engineer', 'Embedded Systems Engineer'
];

/**
 * @desc    Search service providers with intelligent matching
 * @route   GET /api/search?q=keyword
 * @access  Public
 */
exports.search = async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q || q.trim().length === 0) {
            return res.json({ 
                success: true, 
                suggestions: [],
                providers: []
            });
        }

        const searchTerm = q.trim().toLowerCase();
        
        // Get intelligent suggestions from skill database
        const suggestions = skillDatabase
            .filter(skill => skill.toLowerCase().includes(searchTerm))
            .slice(0, 8);

        // Build search query for database
        const searchRegex = new RegExp(searchTerm.split('').join('.*'), 'i');
        
        const providers = await ServiceProvider.find({
            $or: [
                { name: { $regex: searchRegex } },
                { skills: { $in: [new RegExp(searchTerm, 'i')] } },
                { description: { $regex: searchTerm, $options: 'i' } },
                { currentlyWorkingOn: { $regex: searchTerm, $options: 'i' } }
            ]
        })
        .select('name skills rating projectsCompleted description currentlyWorkingOn profileImage')
        .sort({ rating: -1 })
        .limit(20);

        // Calculate relevance score and sort
        const scoredProviders = providers.map(provider => {
            let score = 0;
            const nameMatch = provider.name.toLowerCase().includes(searchTerm);
            const skillMatch = provider.skills.some(s => s.toLowerCase().includes(searchTerm));
            const exactSkillMatch = provider.skills.some(s => s.toLowerCase() === searchTerm);
            
            if (exactSkillMatch) score += 100;
            if (nameMatch) score += 50;
            if (skillMatch) score += 30;
            score += provider.rating || 0;
            
            return { ...provider.toObject(), score };
        }).sort((a, b) => b.score - a.score);

        res.json({
            success: true,
            suggestions,
            providers: scoredProviders.map(provider => ({
                id: provider._id,
                name: provider.name,
                skills: provider.skills,
                rating: provider.rating,
                projectsCompleted: provider.projectsCompleted,
                description: provider.description,
                currentlyWorkingOn: provider.currentlyWorkingOn,
                avatar: provider.name.charAt(0).toUpperCase(),
                relevanceScore: provider.score
            }))
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during search' 
        });
    }
};

/**
 * @desc    Get all service providers with filtering
 * @route   GET /api/providers
 * @access  Public
 */
exports.getProviders = async (req, res) => {
    try {
        const { skill, minRating, search } = req.query;
        let query = {};

        if (skill) {
            query.skills = { $regex: skill, $options: 'i' };
        }
        if (minRating) {
            query.rating = { $gte: parseFloat(minRating) };
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { skills: { $in: [new RegExp(search, 'i')] } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const providers = await ServiceProvider.find(query)
            .select('name skills rating projectsCompleted description currentlyWorkingOn profileImage')
            .sort({ rating: -1 })
            .limit(50);

        res.json({
            success: true,
            count: providers.length,
            providers: providers.map(provider => ({
                id: provider._id,
                name: provider.name,
                skills: provider.skills,
                rating: provider.rating,
                projectsCompleted: provider.projectsCompleted,
                description: provider.description,
                currentlyWorkingOn: provider.currentlyWorkingOn,
                avatar: provider.name.charAt(0).toUpperCase()
            }))
        });
    } catch (error) {
        console.error('Get providers error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

/**
 * @desc    Get single service provider by ID
 * @route   GET /api/providers/:id
 * @access  Public
 */
exports.getProviderById = async (req, res) => {
    try {
        const provider = await ServiceProvider.findById(req.params.id)
            .populate('reviews.clientId', 'name');

        if (!provider) {
            return res.status(404).json({ 
                success: false, 
                message: 'Provider not found' 
            });
        }

        res.json({
            success: true,
            provider: {
                id: provider._id,
                name: provider.name,
                email: provider.email,
                skills: provider.skills,
                description: provider.description,
                projectsCompleted: provider.projectsCompleted,
                currentlyWorkingOn: provider.currentlyWorkingOn,
                rating: provider.rating,
                totalReviews: provider.totalReviews,
                reviews: provider.reviews,
                avatar: provider.name.charAt(0).toUpperCase()
            }
        });
    } catch (error) {
        console.error('Get provider error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};