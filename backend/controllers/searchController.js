const ServiceProvider = require('../models/ServiceProvider');

// Predefined search suggestions for autocomplete
const searchKeywords = [
    'Web Developer', 'Web Designer', 'Web Security',
    'App Developer', 'Machine Learning Engineer', 'AI Expert',
    'Cyber Security Expert', 'Logo Designer', '3D Modeling',
    'Game Developer', 'Backend Development', 'Frontend Development',
    'UI Designer', 'Android Developer', 'iOS Developer',
    'Cloud Architect', 'DevOps Engineer', 'Data Scientist',
    'Blockchain Developer', 'IoT Engineer', 'QA Tester',
    'Database Administrator', 'Network Engineer', 'ERP Consultant'
];

/**
 * @desc    Search service providers and get suggestions
 * @route   GET /api/search?q=keyword
 * @access  Public
 */
exports.search = async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q || q.length < 1) {
            return res.json({ 
                success: true, 
                suggestions: [],
                providers: []
            });
        }

        const searchTerm = q.toLowerCase();

        // Get suggestions from predefined keywords
        const suggestions = searchKeywords.filter(keyword => 
            keyword.toLowerCase().includes(searchTerm)
        ).slice(0, 5);

        // Search for service providers in database
        const providers = await ServiceProvider.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { skills: { $in: [new RegExp(searchTerm, 'i')] } },
                { description: { $regex: searchTerm, $options: 'i' } },
                { currentlyWorkingOn: { $regex: searchTerm, $options: 'i' } }
            ]
        })
        .select('name skills rating projectsCompleted description currentlyWorkingOn profileImage')
        .limit(20);

        res.json({
            success: true,
            suggestions,
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
        console.error('Search error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during search' 
        });
    }
};

/**
 * @desc    Get all service providers (with filters)
 * @route   GET /api/providers
 * @access  Public
 */
exports.getProviders = async (req, res) => {
    try {
        const { skill, minRating, search } = req.query;
        let query = {};

        // Filter by skill
        if (skill) {
            query.skills = { $regex: skill, $options: 'i' };
        }

        // Filter by minimum rating
        if (minRating) {
            query.rating = { $gte: parseFloat(minRating) };
        }

        // General search
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