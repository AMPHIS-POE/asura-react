
import React, { useState, useEffect } from 'react';
import './LiveNotifier.css';

const LiveNotifier = () => {
    const [streamerData, setStreamerData] = useState(null);

    useEffect(() => {
        const fetchLiveStreamers = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL;
                const response = await fetch(`${apiUrl}/wp-json/asura/v1/live-streamers`); 
                const data = await response.json();
                if (data && data.length > 0) {
                    setStreamerData(data[0]);
                }
            } catch (error) {
                console.error("Error fetching live streamers:", error);
            }
        };

        fetchLiveStreamers();
        const interval = setInterval(fetchLiveStreamers, 300000);
        return () => clearInterval(interval);
    }, []);

    if (!streamerData) {
        return null;
    }

    const isLive = streamerData.status === 'online';

    const channelUrl = `https://www.youtube.com/channel/${streamerData.youtube_channel_id}`;
    const liveUrl = isLive ? `https://www.youtube.com/watch?v=${streamerData.video_id}` : channelUrl;

    return (
        <a href={liveUrl} target="_blank" rel="noopener noreferrer" className={`live-notifier-card ${isLive ? 'online' : 'offline'}`}>
            <img src={streamerData.author_avatar_url} alt={streamerData.author_name} className="streamer-avatar" />
            <div className="streamer-info">
                <span className="streamer-name">{streamerData.author_name}</span>
                <span className="streamer-meta">{isLive ? streamerData.stream_title : 'Offline'}</span>
            </div>
            {isLive && (
                <div className="live-indicator">
                    <span className="live-dot"></span> Live Now
                </div>
            )}
        </a>
    );
};

export default LiveNotifier;