import React from 'react';

const Sharing = () => {
  return (
    <div className="sharing">
      <h2>Social Interaction</h2>
      <div className="social-media-buttons">
        <button>Share on Facebook</button> 
        < br/>< br/>
        <button>Share on Twitter</button>
      </div>
      <div className="comments-section">
        <h3>Comments</h3>
        {/* Comments and discussion area */}
      </div>
    </div>
  );
};

export default Sharing;
