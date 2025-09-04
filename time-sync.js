/**
 * Time synchronization module
 * 
 * This module provides more accurate time synchronization with a server
 * to ensure the celebration content appears exactly at the right time.
 */

class TimeSync {
    constructor(options = {}) {
        this.options = Object.assign({
            timeApiUrl: 'https://worldtimeapi.org/api/ip',
            syncInterval: 3600000, // 1 hour
            syncAttempts: 3,
            maxAllowableDelta: 300000, // 5 minutes
            onSyncComplete: null
        }, options);
        
        this.timeOffset = 0;
        this.lastSyncTime = 0;
        this.syncInProgress = false;
        this.syncSuccess = false;
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
     * Sync time with server
     */
    sync() {
        if (this.syncInProgress) return Promise.resolve(false);
        
        this.syncInProgress = true;
        const syncStartTime = Date.now();
        let syncAttempt = 0;
        
        const attemptSync = () => {
            syncAttempt++;
            
            return fetch(this.options.timeApiUrl)
                .then(response => response.json())
                .then(data => {
                    // Calculate server time
                    let serverTime;
                    if (data.unixtime) {
                        // WorldTimeAPI format
                        serverTime = data.unixtime * 1000;
                    } else if (data.timestamp) {
                        // Generic timestamp format
                        serverTime = new Date(data.timestamp).getTime();
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
                            return attemptSync();
                        } else {
                            throw new Error('Time offset exceeds maximum allowable delta');
                        }
                    }
                    
                    // Update time offset
                    this.timeOffset = newOffset;
                    this.lastSyncTime = clientReceiveTime;
                    this.syncSuccess = true;
                    this.syncInProgress = false;
                    
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
                    console.error('Time sync error:', error);
                    
                    // Retry if we haven't reached max attempts
                    if (syncAttempt < this.options.syncAttempts) {
                        return attemptSync();
                    } else {
                        this.syncInProgress = false;
                        return false;
                    }
                });
        };
        
        return attemptSync();
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
