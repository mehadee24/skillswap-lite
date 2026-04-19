const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    serviceProviderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceProvider',
        required: true
    },
    projectTitle: {
        type: String,
        required: true
    },
    projectDescription: {
        type: String,
        required: true
    },
    pricePaid: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    completionDate: {
        type: Date
    },
    clientRating: {
        type: Number,
        min: 1,
        max: 5
    },
    providerRating: {
        type: Number,
        min: 1,
        max: 5
    },
    clientReview: {
        type: String
    },
    providerReview: {
        type: String
    }
}, {
    timestamps: true
});

/**
 * Complete a project and update ratings for both client and provider
 */
projectSchema.methods.completeProject = async function(clientRating, providerRating) {
    this.status = 'completed';
    this.completionDate = new Date();
    this.clientRating = clientRating;
    this.providerRating = providerRating;
    
    await this.save();
    
    // Update provider's average rating
    const ServiceProvider = mongoose.model('ServiceProvider');
    const provider = await ServiceProvider.findById(this.serviceProviderId);
    
    if (provider) {
        const allProviderProjects = await this.model('Project').find({
            serviceProviderId: this.serviceProviderId,
            status: 'completed',
            providerRating: { $exists: true }
        });
        
        if (allProviderProjects.length > 0) {
            const totalRating = allProviderProjects.reduce((sum, p) => sum + p.providerRating, 0);
            provider.rating = totalRating / allProviderProjects.length;
            provider.projectsCompleted = allProviderProjects.length;
        } else {
            provider.rating = 0;
            provider.projectsCompleted = 0;
        }
        await provider.save();
    }
    
    // Update client's average rating
    const Client = mongoose.model('Client');
    const client = await Client.findById(this.clientId);
    
    if (client) {
        const allClientProjects = await this.model('Project').find({
            clientId: this.clientId,
            status: 'completed',
            clientRating: { $exists: true }
        });
        
        if (allClientProjects.length > 0) {
            const totalClientRating = allClientProjects.reduce((sum, p) => sum + p.clientRating, 0);
            client.rating = totalClientRating / allClientProjects.length;
        } else {
            client.rating = 0;
        }
        await client.save();
    }
};

module.exports = mongoose.model('Project', projectSchema);