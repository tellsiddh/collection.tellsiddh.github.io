// Main app functionality
document.addEventListener('DOMContentLoaded', function() {
    loadCollections();
    setupForm();
});

// Load and display all saved collections
function loadCollections() {
    const collections = getCollections();
    const container = document.getElementById('collectionsContainer');
    const totalCount = document.getElementById('totalCount');
    
    totalCount.textContent = collections.length;
    
    if (collections.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h2>🌟 Start Your Collection</h2>
                <p>Add your first link above, or share links directly from Instagram/Reddit using the share button!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = collections.map(item => `
        <div class="collection-item">
            <div class="collection-title">${escapeHtml(item.title)}</div>
            <a href="${escapeHtml(item.url)}" target="_blank" class="collection-url">${escapeHtml(item.url)}</a>
            ${item.notes ? `<div class="collection-notes">${escapeHtml(item.notes)}</div>` : ''}
            <div class="collection-date">
                Saved on ${formatDate(item.dateAdded)} • ${item.hostname}
            </div>
            <button class="delete-btn" onclick="deleteItem('${item.id}')">🗑️ Delete</button>
        </div>
    `).join('');
}

// Setup form submission
function setupForm() {
    const form = document.getElementById('addLinkForm');
    const urlInput = document.getElementById('url');
    
    // Check if there's a URL in the query params (for direct sharing)
    const urlParams = new URLSearchParams(window.location.search);
    const sharedUrl = urlParams.get('url') || urlParams.get('text');
    if (sharedUrl) {
        urlInput.value = sharedUrl;
        // Auto-suggest title based on URL
        suggestTitle(sharedUrl);
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const url = document.getElementById('url').value;
        const title = document.getElementById('title').value || extractTitleFromUrl(url);
        const notes = document.getElementById('notes').value;
        
        if (!url) {
            alert('Please enter a URL');
            return;
        }
        
        const linkData = {
            id: Date.now().toString(),
            url: url,
            title: title,
            notes: notes,
            dateAdded: new Date().toISOString(),
            hostname: getHostname(url)
        };
        
        addToCollection(linkData);
        
        // Clear form
        form.reset();
        
        // Reload collections
        loadCollections();
        
        // Show success feedback
        showNotification('✅ Link saved to collection!');
    });
}

// Get collections from localStorage
function getCollections() {
    try {
        return JSON.parse(localStorage.getItem('myCollections') || '[]');
    } catch (e) {
        console.error('Error parsing collections:', e);
        return [];
    }
}

// Add item to collection
function addToCollection(item) {
    const collections = getCollections();
    collections.unshift(item); // Add to beginning
    localStorage.setItem('myCollections', JSON.stringify(collections));
}

// Delete item from collection
function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }
    
    const collections = getCollections();
    const filtered = collections.filter(item => item.id !== id);
    localStorage.setItem('myCollections', JSON.stringify(filtered));
    
    loadCollections();
    showNotification('🗑️ Item deleted');
}

// Extract hostname from URL
function getHostname(url) {
    try {
        return new URL(url).hostname;
    } catch (e) {
        return 'Unknown';
    }
}

// Extract title suggestion from URL
function extractTitleFromUrl(url) {
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname;
        
        if (hostname.includes('instagram.com')) {
            return 'Instagram Post';
        } else if (hostname.includes('reddit.com')) {
            return 'Reddit Post';
        } else if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
            return 'Tweet';
        } else if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
            return 'YouTube Video';
        } else if (hostname.includes('tiktok.com')) {
            return 'TikTok Video';
        } else {
            return hostname.replace('www.', '');
        }
    } catch (e) {
        return 'Saved Link';
    }
}

// Auto-suggest title when URL is entered
function suggestTitle(url) {
    const titleInput = document.getElementById('title');
    if (!titleInput.value) {
        titleInput.value = extractTitleFromUrl(url);
    }
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 1000;
        font-weight: 600;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Auto-suggest title when URL input changes
document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('url');
    if (urlInput) {
        urlInput.addEventListener('blur', function() {
            if (this.value) {
                suggestTitle(this.value);
            }
        });
    }
});

// Export data functionality (bonus feature)
function exportData() {
    const collections = getCollections();
    const dataStr = JSON.stringify(collections, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'my-collections.json';
    link.click();
}

// Import data functionality (bonus feature)
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (Array.isArray(importedData)) {
                localStorage.setItem('myCollections', JSON.stringify(importedData));
                loadCollections();
                showNotification('📥 Data imported successfully!');
            } else {
                throw new Error('Invalid format');
            }
        } catch (error) {
            alert('Error importing data. Please check the file format.');
        }
    };
    reader.readAsText(file);
}