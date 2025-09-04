/**
 * Time synchronization module
 * 
 * This module provides time synchronization to ensure the countdown
 * works correctly even when deployed on GitHub Pages.
 */

class TimeSync {
    constructor(options = {}) {
        this.options = Object.assign({
            // Use a CORS-friendly API for GitHub Pages
            timeApiUrl: 'https://worldtimeapi.org/api/ip',
            fallbackApis: [
                'https://worldclockapi.com/api/json/utc/now',
                'https://showcase.api.linx.twenty57.net/UnixTime/tounix?date=now'
            ],
            syncInterval: 3600000, // 1 hour
            syncAttempts: 3,
            maxAllowableDelta: 300000, // 5 minutes
            onSyncComplete: null
        }, options);
        
        this.timeOffset = 0;
        this.lastSyncTime = 0;
        this.syncInProgress = false;
        this.syncSuccess = false;
        
        // Fallback: save the client-server time difference in localStorage
        this.localStorageKey = 'time-sync-offset';
        
        // Try to load previous offset from localStorage
        try {
            const savedOffset = localStorage.getItem(this.localStorageKey);
            if (savedOffset) {
                this.timeOffset = parseInt(savedOffset, 10);
                console.log('Loaded time offset from localStorage:', this.timeOffset);
            }
        } catch (e) {
            console.warn('Could not load time offset from localStorage');
        }
    }
    
    /**
     * Start time synchronization
     */
    start() {
        this.sync();
        
        // Set up periodic sync
        setInterval(() => this.sync(), this.options.syncInterval);
        
        return this;
    }
    
    /**
     * Get current synchronized time
     */
    now() {
        return Date.now() + this.timeOffset;
    }
    
    /**
     * Sync time with server with fallbacks for GitHub Pages
     */
    sync() {
        if (this.syncInProgress) return Promise.resolve(false);
        
        this.syncInProgress = true;
        const syncStartTime = Date.now();
        let syncAttempt = 0;
        
        const attemptSync = (apiIndex = 0) => {
            syncAttempt++;
            
            // If we've tried all APIs, use the date header method
            if (apiIndex >= this.options.fallbackApis.length + 1) {
                return this.syncViaDateHeader()
                    .then(success => {
                        this.syncInProgress = false;
                        return success;
                    })
                    .catch(() => {
                        console.warn('All time sync methods failed, using local time');
                        this.syncInProgress = false;
                        return false;
                    });
            }
            
            // Determine which API to use
            const apiUrl = apiIndex === 0 ? 
                this.options.timeApiUrl : 
                this.options.fallbackApis[apiIndex - 1];
            
            return fetch(apiUrl)
                .then(response => {
                    // Extract date from headers as a fallback
                    const dateHeader = response.headers.get('date');
                    if (dateHeader) {
                        this.processDateHeader(dateHeader, syncStartTime);
                    }
                    return response.json();
                })
                .then(data => {
                    // Calculate server time based on the API response format
                    let serverTime;
                    
                    if (data.unixtime) {
                        // WorldTimeAPI format
                        serverTime = data.unixtime * 1000;
                    } else if (data.timestamp) {
                        // Generic timestamp format
                        serverTime = new Date(data.timestamp).getTime();
                    } else if (data.currentDateTime) {
                        // WorldClockAPI format
                        serverTime = new Date(data.currentDateTime).getTime();
                    } else if (data.UnixTime) {
                        // Twenty57 UnixTime API format
                        serverTime = data.UnixTime * 1000;
                    } else {
                        throw new Error('Unrecognized time format from API');
                    }
                    
                    // Calculate round trip time
                    const clientReceiveTime = Date.now();
                    const roundTripTime = clientReceiveTime - syncStartTime;
                    
                    // Estimate one-way latency (assuming symmetric network delay)
                    const latency = roundTripTime / 2;
                    
                    // Adjust server time by adding the latency
                    const adjustedServerTime = serverTime + latency;
                    
                    // Calculate offset between client and server time
                    const newOffset = adjustedServerTime - clientReceiveTime;
                    
                    // Validate offset isn't too large (which might indicate an error)
                    if (Math.abs(newOffset) > this.options.maxAllowableDelta) {
                        console.warn('Time offset too large:', newOffset, 'ms');
                        if (syncAttempt < this.options.syncAttempts) {
                            return attemptSync(apiIndex + 1);
                        } else {
                            throw new Error('Time offset exceeds maximum allowable delta');
                        }
                    }
                    
                    // Update time offset
                    this.timeOffset = newOffset;
                    this.lastSyncTime = clientReceiveTime;
                    this.syncSuccess = true;
                    this.syncInProgress = false;
                    
                    // Save to localStorage for future visits
                    try {
                        localStorage.setItem(this.localStorageKey, this.timeOffset.toString());
                    } catch (e) {
                        console.warn('Could not save time offset to localStorage');
                    }
                    
                    console.log('Time synchronized. Offset:', this.timeOffset, 'ms');
                    
                    // Call callback if provided
                    if (typeof this.options.onSyncComplete === 'function') {
                        this.options.onSyncComplete({
                            offset: this.timeOffset,
                            syncTime: this.lastSyncTime
                        });
                    }
                    
                    return true;
                })
                .catch(error => {
                    console.warn(`Time sync error with API ${apiUrl}:`, error);
                    
                    // Try the next API in the list
                    return attemptSync(apiIndex + 1);
                });
        };
        
        return attemptSync();
    }
    
    /**
     * Sync via the Date header in a fetch request
     * This is a fallback method that works in most environments
     */
    syncViaDateHeader() {
        const syncStartTime = Date.now();
        
        return fetch('https://www.github.com', { method: 'HEAD' })
            .then(response => {
                const dateHeader = response.headers.get('date');
                if (!dateHeader) {
                    throw new Error('No date header in response');
                }
                
                return this.processDateHeader(dateHeader, syncStartTime);
            });
    }
    
    /**
     * Process a date header from an HTTP response
     */
    processDateHeader(dateHeader, syncStartTime) {
        const serverTime = new Date(dateHeader).getTime();
        const clientReceiveTime = Date.now();
        const roundTripTime = clientReceiveTime - syncStartTime;
        const latency = roundTripTime / 2;
        const adjustedServerTime = serverTime + latency;
        const newOffset = adjustedServerTime - clientReceiveTime;
        
        // Validate offset
        if (Math.abs(newOffset) > this.options.maxAllowableDelta) {
            console.warn('Date header time offset too large:', newOffset, 'ms');
            return false;
        }
        
        // Update time offset
        this.timeOffset = newOffset;
        this.lastSyncTime = clientReceiveTime;
        this.syncSuccess = true;
        
        // Save to localStorage
        try {
            localStorage.setItem(this.localStorageKey, this.timeOffset.toString());
        } catch (e) {
            console.warn('Could not save time offset to localStorage');
        }
        
        console.log('Time synchronized via date header. Offset:', this.timeOffset, 'ms');
        
        // Call callback if provided
        if (typeof this.options.onSyncComplete === 'function') {
            this.options.onSyncComplete({
                offset: this.timeOffset,
                syncTime: this.lastSyncTime
            });
        }
        
        return true;
    }
    
    /**
     * Check if a specific timestamp has been reached
     */
    hasReached(targetTimestamp) {
        return this.now() >= targetTimestamp;
    }
    
    /**
     * Get time remaining until a target timestamp
     */
    getTimeRemaining(targetTimestamp) {
        return Math.max(0, targetTimestamp - this.now());
    }
}

// Export the TimeSync class
window.TimeSync = TimeSync;
