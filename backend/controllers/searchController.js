const ServiceProvider = require('../models/ServiceProvider');

// Predefined search suggestions based on the project requirements
const searchKeywords = [
    'Web Developer',
    'Web Designer',
    'Web Security',
    'App Developer',
    'Machine Learning Engineer',
    'AI Expert',
    'Cyber Security Expert',
    'Logo Designer',
    '3D Modeling',
    'Game Developer',
    'Backend Development',
    'Frontend Development',
    'UI Designer',
    'Android Developer',
    'iOS Developer'
];

/**
 * @desc    Search service providers and get suggestions
 * @route   GET /api/search
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
        ).slice(0, 5); // Limit to 5 suggestions

        // Search for service providers in database
        const providers = await ServiceProvider.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { skills: { $in: [new RegExp(searchTerm, 'i')] } },
                { description: { $regex: searchTerm, $options: 'i' } }
            ]
        }).limit(10);

        res.json({
            success: true,
            suggestions,
            providers
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
 * @desc    Get all service providers
 * @route   GET /api/providers
 * @access  Public
 */
exports.getProviders = async (req, res) => {
    try {
        const providers = await ServiceProvider.find()
            .select('-reviews') // Exclude reviews for list view
            .sort({ rating: -1 }) // Sort by highest rating
            .limit(20);

        res.json({
            success: true,
            providers
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
            provider
        });
    } catch (error) {
        console.error('Get provider error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};